'use client'

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { FolderKanban, Mail, Sparkles, UserRound, type LucideIcon } from 'lucide-react'

type NavLink = { label: string; href: string }

const icons: Record<string, LucideIcon> = {
  '#proyectos': FolderKanban,
  '#sobre-mi': UserRound,
  '#habilidades': Sparkles,
  '#contacto': Mail,
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Desplazamiento suave con aceleración y frenado. El `scroll-behavior: smooth` nativo es lineal
 * y su duración no se controla; aquí crece con la distancia (máx. 1.2 s) para que un salto largo se sienta
 * como bajar, no como un corte. Se cancela si la persona usa la rueda, el dedo o el teclado.
 */
function smoothScrollTo(top: number, onDone: () => void) {
  const start = window.scrollY
  const distance = top - start
  const duration = Math.min(1200, 450 + Math.abs(distance) * 0.2)
  let startTime: number | null = null
  let frame = 0

  const finish = () => {
    cancelAnimationFrame(frame)
    interruptEvents.forEach((type) => window.removeEventListener(type, finish))
    onDone()
  }
  const step = (now: number) => {
    startTime ??= now
    const progress = Math.min(1, (now - startTime) / duration)
    window.scrollTo({ top: start + distance * easeInOutCubic(progress), behavior: 'instant' })
    if (progress < 1) frame = requestAnimationFrame(step)
    else finish()
  }

  const interruptEvents = ['wheel', 'touchstart', 'keydown'] as const
  interruptEvents.forEach((type) => window.addEventListener(type, finish, { passive: true, once: true }))
  frame = requestAnimationFrame(step)
}

/**
 * Navegación principal.
 * - Celular: barra de pestañas fija abajo (zona del pulgar), con ícono y texto.
 * - Tablet y escritorio: píldora dentro de la barra superior.
 * Un indicador se desliza hasta la sección activa; en un salto largo pasa visualmente por las secciones del camino.
 * Desde tablet la píldora es fija arriba (`--nav-top`) y centrada; el nombre y el CV no son fijos.
 */
export function SiteNav({ links }: { links: NavLink[] }) {
  const [active, setActive] = useState(links[0]?.href ?? '')
  const listRef = useRef<HTMLUListElement>(null)
  const lockUntil = useRef(0)

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))

    // Contacto está al final: si ya no se puede bajar más, es la sección activa.
    const lastHref = links[links.length - 1]?.href
    const onScroll = () => {
      if (performance.now() < lockUntil.current) return
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom && lastHref) setActive(lastHref)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [links])

  // Posiciona el indicador sobre el enlace activo y lo recoloca si cambia el tamaño (p. ej. al pasar de celular a escritorio).
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const place = () => {
      // Se mide el <li>: es el hijo directo de la lista posicionada, así offsetLeft es relativo a ella.
      const current = list.querySelector<HTMLElement>('[aria-current]')?.closest('li')
      if (!current) return
      list.style.setProperty('--ind-x', `${current.offsetLeft}px`)
      list.style.setProperty('--ind-w', `${current.offsetWidth}px`)
      // Se activa la transición después de la primera medida, así no se desliza desde 0 al cargar.
      requestAnimationFrame(() => (list.dataset.ready = 'true'))
    }

    place()
    const resizeObserver = new ResizeObserver(place)
    resizeObserver.observe(list)
    return () => resizeObserver.disconnect()
  }, [active])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector<HTMLElement>(href)
    if (!target) return
    event.preventDefault()

    history.replaceState(null, '', href)

    const root = document.documentElement
    const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0
    const maxScroll = root.scrollHeight - window.innerHeight
    const top = Math.min(maxScroll, Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset))

    if (prefersReducedMotion()) {
      window.scrollTo({ top, behavior: 'instant' })
      return
    }

    // Durante el recorrido las secciones de paso se ven completas (sin huecos a medio aparecer)
    // y solo el destino espera fuera de vista para entrar en cascada al llegar.
    const targetReveal = target.closest<HTMLElement>('[data-reveal]') ?? target.querySelector<HTMLElement>('[data-reveal]')
    const targetRect = targetReveal?.getBoundingClientRect()
    const targetOnScreen = targetRect && targetRect.bottom > 0 && targetRect.top < window.innerHeight
    if (targetReveal && !targetOnScreen) targetReveal.dataset.target = ''
    root.dataset.navScrolling = ''

    // El indicador viaja con el scroll: pasa por las secciones intermedias y termina en el destino.
    smoothScrollTo(top, () => {
      setActive(href)
      lockUntil.current = performance.now() + 120
      delete root.dataset.navScrolling
      requestAnimationFrame(() => targetReveal && delete targetReveal.dataset.target)
    })
  }

  return (
    <nav
      aria-label="Principal"
      className="site-nav fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 rounded-[1.75rem] bg-paper/90 p-1.5 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)] ring-1 ring-ink/5 backdrop-blur-md md:right-auto md:bottom-auto md:left-1/2 md:top-[var(--nav-top)] md:-translate-x-1/2 md:rounded-[3rem] md:bg-paper/95 md:p-1 md:shadow-[0_8px_24px_-12px_rgb(0_0_0/0.3)] md:ring-black/5 md:backdrop-blur-sm"
    >
      <ul ref={listRef} className="nav-list relative grid auto-cols-fr grid-flow-col md:flex md:gap-1">
        <span aria-hidden="true" className="nav-indicator" />
        {links.map((link) => {
          const isActive = active === link.href
          const Icon = icons[link.href]
          return (
            <li key={link.href} className="relative z-10">
              <a
                href={link.href}
                onClick={(event) => navigate(event, link.href)}
                aria-current={isActive ? 'location' : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-[1.375rem] px-2 py-2 text-[0.6875rem] font-medium transition-[color,scale] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] select-none hover:scale-[1.06] active:scale-95 active:duration-100 md:flex-row md:rounded-[3rem] md:px-3 md:py-2 whitespace-nowrap md:text-sm lg:px-5 lg:py-2.5 lg:text-base ${
                  isActive ? 'text-ink' : 'text-slate hover:text-ink'
                }`}
              >
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className="size-[var(--icon)] transition-transform duration-300 md:hidden"
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                )}
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}