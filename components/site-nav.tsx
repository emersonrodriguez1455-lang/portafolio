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

/**
 * Transición "ascensor" al usar la navegación: el contenido actual sale hacia arriba (si el destino está más abajo)
 * o hacia abajo (si está más arriba), se salta al destino sin que se vea el recorrido y el nuevo contenido entra desde el
 * lado contrario. Solo ocurre con la navegación; el scroll normal con la rueda o el dedo no cambia.
 * Con "reducir movimiento" se hace solo un fundido, sin desplazamiento.
 */
function elevatorTo(top: number, goingDown: boolean, onDone: () => void) {
  const main = document.querySelector<HTMLElement>('main')
  if (!main) {
    window.scrollTo({ top, behavior: 'instant' })
    onDone()
    return
  }
  const shift = prefersReducedMotion() ? 0 : 72 // px que recorre el contenido
  const dir = goingDown ? -1 : 1

  // 1) Sale: acelera hacia fuera (ease-in) mientras se desvanece
  main.style.transition = 'transform 220ms cubic-bezier(0.4, 0, 1, 1), opacity 200ms linear'
  main.style.transform = `translateY(${dir * shift}px)`
  main.style.opacity = '0'

  window.setTimeout(() => {
    // 2) Salto invisible al destino y colocación en el lado contrario
    main.style.transition = 'none'
    window.scrollTo({ top, behavior: 'instant' })
    main.style.transform = `translateY(${-dir * shift}px)`
    void main.offsetHeight
    // 3) Entra: frena suave (ease-out)
    main.style.transition = 'transform 520ms cubic-bezier(0.25, 1, 0.5, 1), opacity 360ms ease-out'
    main.style.transform = 'translateY(0)'
    main.style.opacity = '1'
    window.setTimeout(() => {
      main.style.transition = main.style.transform = main.style.opacity = ''
      onDone()
    }, 540)
  }, 220)
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
  const busy = useRef(false)

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

    if (busy.current) return
    history.replaceState(null, '', href)
    // El indicador gris viaja de inmediato hasta el destino; mientras dura el desplazamiento el observador no lo mueve.
    setActive(href)
    lockUntil.current = Number.POSITIVE_INFINITY

    const root = document.documentElement
    const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0
    const maxScroll = root.scrollHeight - window.innerHeight
    const top = Math.min(maxScroll, Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset))
    busy.current = true

    // Mientras dura la transición todo lo que aparece se muestra completo (sin cascadas a medias)
    root.dataset.navScrolling = ''
    elevatorTo(top, top > window.scrollY, () => {
      lockUntil.current = performance.now() + 120
      delete root.dataset.navScrolling
      busy.current = false
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
                className={`flex flex-col items-center gap-0.5 rounded-[1.375rem] px-2 py-2 text-[0.6875rem] font-medium transition-[color,scale] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] select-none hover:scale-[1.06] active:scale-95 active:duration-100 md:flex-row md:gap-2 md:rounded-[3rem] md:px-3 md:py-2 whitespace-nowrap md:text-sm lg:px-5 lg:py-2.5 lg:text-base ${
                  isActive ? 'text-ink' : 'text-slate hover:text-ink'
                }`}
              >
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className="size-[var(--icon)] shrink-0 transition-transform duration-300 md:size-[1.1em]"
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