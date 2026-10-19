'use client'

import { useEffect, useRef, useState } from 'react'
import { Typewriter } from '@/components/typewriter'

type SectionHeadingProps = {
  id: string
  text: string
  /** En fondos oscuros el halo menta se atenúa */
  tone?: 'light' | 'dark'
}

/**
 * Titular de sección que se escribe letra por letra la primera vez que entra en pantalla.
 * Mientras está en "idle", las animaciones CSS de la máquina de escribir quedan en pausa.
 */
export function SectionHeading({ id, text, tone = 'light' }: SectionHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [state, setState] = useState<'idle' | 'typing'>('idle')

  useEffect(() => {
    const heading = ref.current
    if (!heading) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setState('typing')
        observer.disconnect()
      },
      { threshold: 0.6 },
    )
    observer.observe(heading)
    return () => observer.disconnect()
  }, [])

  return (
    <h2 ref={ref} id={id} data-tw={state} data-tone={tone} className="display-heading heading-glow self-start">
      <Typewriter text={text} start={120} speed={55} caret />
    </h2>
  )
}
