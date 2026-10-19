'use client'

import { useEffect, useRef } from 'react'
import content from '@/content/content.json'
import { SectionHeading } from '@/components/section-heading'

/**
 * Sobre mí: columna izquierda fija con el titular y una ficha de 4 datos (los números cuentan al entrar);
 * columna derecha con el primer párrafo como "lead", el resto en lectura normal y la formación como pie.
 * Lenguaje de "Cómo trabajo con la IA" (radios grandes, mono para etiquetas, acento menta), pero en tarjetas claras.
 * La ficha solo aparece desde tablet: el celular se mantiene como estaba.
 */
export function AboutSection() {
  const { about } = content
  const [lead, ...rest] = about.paragraphs

  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-x-12 lg:gap-x-16">
      <div className="flex flex-col gap-8 md:sticky md:top-28 md:self-start">
        <SectionHeading id="sobre-mi-titulo" text={about.title} />

        <dl className="hidden grid-cols-2 gap-3 md:grid lg:gap-4">
          {about.facts.map((fact, i) => (
            <div
              key={fact.label}
              style={{ '--k': i } as React.CSSProperties}
              className={`fact flex flex-col-reverse justify-between gap-6 rounded-2xl p-4 transition-[translate,box-shadow] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)] lg:p-5 ${
                i === 2 ? 'bg-mint' : 'bg-paper'
              }`}
            >
              <dt className="mono-label">{fact.label}</dt>
              <FactValue value={fact.value} />
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-4 text-base leading-relaxed text-slate md:text-lg">
        <p className="md:mb-2 md:text-2xl md:leading-snug md:font-medium md:tracking-[-0.02em] md:text-ink md:text-pretty">{lead}</p>
        {rest.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="border-t border-ash pt-4 font-mono text-xs text-smoke md:mt-4">{about.education}</p>
      </div>
    </section>
  )
}

/** Valor de una ficha. Si es un número, cuenta de 0 al valor la primera vez que se ve (llama la atención sobre lo importante). */
function FactValue({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !/^\d+$/.test(value) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = Number(value)
    let frame = 0
    el.textContent = '0'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now() + 350 // espera a que la ficha termine de entrar
        const tick = (now: number) => {
          const p = Math.min(Math.max((now - start) / 900, 0), 1)
          el.textContent = String(Math.round(target * (1 - (1 - p) ** 3))) // ease-out cúbico
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = value
    }
  }, [value])

  return (
    <dd ref={ref} className="font-display text-4xl leading-none tracking-[-0.03em] uppercase tabular-nums lg:text-5xl">
      {value}
    </dd>
  )
}
