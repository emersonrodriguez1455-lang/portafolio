'use client'

import { useEffect } from 'react'

const PRESSABLE = 'a[href], button:not(:disabled)'
const DEFAULT_COLOR = 'rgb(0 0 0 / 0.22)'

/**
 * Pulso al presionar cualquier enlace o botón: un anillo que sale del borde y se desvanece.
 * Un solo listener para toda la página; cada elemento puede cambiar el color con `--pulse-color`.
 * Usa box-shadow (no ::after) para no chocar con el enlace extendido de las tarjetas.
 */
export function PressPulse() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const pulse = (element: HTMLElement) => {
      if (reducedMotion.matches) return
      const color = getComputedStyle(element).getPropertyValue('--pulse-color').trim() || DEFAULT_COLOR
      element.animate([{ boxShadow: `0 0 0 0 ${color}` }, { boxShadow: '0 0 0 10px transparent' }], {
        duration: 520,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      })
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const element = (event.target as Element).closest<HTMLElement>(PRESSABLE)
      if (element) pulse(element)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const element = (event.target as Element).closest<HTMLElement>(PRESSABLE)
      if (element) pulse(element)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
