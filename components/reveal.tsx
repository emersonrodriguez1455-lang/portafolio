'use client'

import { useEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react'

type RevealProps = {
  /** "section": se escalonan los hijos de la <section> envuelta. "list": cada hijo directo entra por su cuenta. */
  variant?: 'section' | 'list'
  as?: 'div' | 'ul'
  /** Retraso solo para la primera pantalla (p. ej. dejar que el titular empiece a escribirse antes de las tarjetas). */
  firstDelay?: number
} & ComponentPropsWithoutRef<'div'>

/**
 * Hace aparecer sus bloques UNA sola vez, cuando asoman en pantalla (después se deja de observar).
 * - "section": el contenedor entra y sus bloques se escalonan en CSS.
 * - "list": cada hijo se observa por separado; los que entran a la vez se escalonan entre sí
 *   (una tarjeta fuera de pantalla no gasta su animación antes de verse).
 * La animación vive en CSS (`[data-reveal]` en globals.css); aquí solo se cambian atributos.
 */
export function Reveal({ variant = 'section', as: Tag = 'div', firstDelay = 0, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = variant === 'list' ? (Array.from(root.children) as HTMLElement[]) : [root]
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement
            if (variant === 'list') el.style.setProperty('--reveal-i', String(i))
            el.dataset.in = ''
            observer.unobserve(el)
          })
      },
      // Entra cuando asoma por encima del borde inferior: el movimiento ocurre donde se mira.
      variant === 'list' ? { rootMargin: '0px 0px -8% 0px', threshold: 0.1 } : { rootMargin: '0px 0px -12% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [variant])

  return (
    <Tag
      // @ts-expect-error: el ref es válido para cualquiera de los dos elementos permitidos
      ref={ref}
      data-reveal={variant}
      style={{ '--reveal-base': `${firstDelay}ms`, ...style } as CSSProperties}
      {...rest}
    />
  )
}
