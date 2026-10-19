'use client'

import { useState, type CSSProperties } from 'react'
import content from '@/content/content.json'
import { ProjectCard, type Project } from '@/components/project-card'
import { ProjectDialog } from '@/components/project-dialog'
import { Typewriter } from '@/components/typewriter'
import { Reveal } from '@/components/reveal'
import { HeroCodeCard } from '@/components/hero-code-card'
import { LayoutTemplate, Sparkles, Sprout } from 'lucide-react'

// Un ícono por chip: Junior · Frontend · Asistido con IA (Backend ya va en el titular)
const focusIcons = [Sprout, LayoutTemplate, Sparkles]

/**
 * Titular + tres tarjetas en la primera pantalla. Al abrir una, se muestra el caso completo.
 * Ritmo vertical (rejilla de 8 px, solo tablet y escritorio; el celular no cambia):
 * saludo → titular 16 · titular → chips 32 · chips → párrafo 16 · hero → tarjetas 80–96.
 * Más espacio entre grupos distintos que dentro de un mismo grupo (proximidad).
 */
export function ProjectsSection() {
  const projects = content.projects as Project[]
  const { hero } = content
  // El proyecto se conserva al cerrar para que la animación de salida muestre el contenido.
  // `origin` es la tarjeta pulsada: el caso se expande desde ella y vuelve a ella al cerrar.
  const [selection, setSelection] = useState<{ project: Project; openId: number; origin: HTMLElement | null } | null>(null)

  return (
    <section
      id="proyectos"
      aria-label="Presentación y proyectos"
      className="flex flex-col gap-6 pt-4 md:gap-20 md:pt-12 lg:gap-24 lg:pt-16"
    >
      <div className="hero-glow flex flex-col gap-4">
        <p className="mono-label">
          <Typewriter text={hero.greeting} start={100} speed={28} />
        </p>

        <h1
          data-text={hero.title}
          className="shine-title font-display text-5xl leading-[0.9] tracking-[-0.03em] uppercase md:text-7xl lg:text-[5.5rem]"
        >
          <Typewriter text={hero.title} start={300} speed={38} caret />
        </h1>

        {/* Texto a la izquierda; desde escritorio, la tarjeta de código a la derecha. Chips y párrafo no esperan al titular */}
        <div className="flex flex-col gap-4 md:mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-x-16">
          <div className="flex flex-col gap-4">
            <ul aria-label="Enfoque" className="flex shrink-0 flex-wrap gap-2">
              {hero.focus.map((item, i) => {
                const Icon = focusIcons[i]
                return (
                  <li
                    key={item}
                    className={`rise inline-flex items-center gap-2 rounded-pill px-3 py-1 font-mono text-xs tracking-[-0.03em] md:px-4 md:py-1.5 md:text-sm ${
                      i === hero.focus.length - 1 ? 'bg-ink text-paper' : 'bg-mint'
                    }`}
                    style={{ '--d': `${350 + i * 70}ms` } as CSSProperties}
                  >
                    {Icon && <Icon aria-hidden="true" className="size-[1.1em] shrink-0" />}
                    {item}
                  </li>
                )
              })}
            </ul>
            <p
              className="rise max-w-2xl text-sm leading-relaxed text-pretty text-slate md:max-w-[65ch] md:text-base"
              style={{ '--d': '560ms' } as CSSProperties}
            >
              {hero.summary}
            </p>
          </div>
          <HeroCodeCard className="hidden lg:block" />
        </div>
      </div>

      {/* En tablet (2 columnas) la última tarjeta impar ocupa toda la fila para no dejar un hueco */}
      <Reveal
        as="ul"
        variant="list"
        firstDelay={450}
        className="grid gap-3 md:grid-cols-2 md:gap-6 md:max-lg:[&>li:last-child:nth-child(odd)]:col-span-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          // Subgrid en escritorio: portada, estado, título, resumen, etiquetas y botón quedan alineados entre las tres tarjetas
          <li key={project.id} className="flex lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-4">
            <ProjectCard project={project} onOpen={(origin) => setSelection({ project, openId: Date.now(), origin })} />
          </li>
        ))}
      </Reveal>

      <ProjectDialog project={selection?.project ?? null} openId={selection?.openId ?? 0} origin={selection?.origin ?? null} />
    </section>
  )
}
