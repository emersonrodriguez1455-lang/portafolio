import content from '@/content/content.json'
import { SectionHeading } from '@/components/section-heading'
import { SkillIcon } from '@/components/ui-bits'

/** Habilidades agrupadas con ícono y nombre. Sin barras ni niveles: el título del grupo lo comunica. */
export function SkillsSection() {
  const { skills } = content

  return (
    <section id="habilidades" aria-labelledby="habilidades-titulo" className="flex flex-col gap-6 md:gap-8">
      <SectionHeading id="habilidades-titulo" text={skills.title} />

      {/* La última tarjeta completa la fila (2 o 3 columnas) para no dejar huecos; su lista se reparte sola por ancho */}
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 sm:max-lg:[&>article:last-child:nth-child(odd)]:col-span-2 lg:[&>article:last-child:nth-child(3n+1)]:col-span-3 lg:[&>article:last-child:nth-child(3n+2)]:col-span-2">
        {skills.groups.map((group) => (
          <article
            key={group.title}
            className="flex flex-col gap-5 rounded-card bg-paper p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-14px_rgb(0_0_0/0.14)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)] md:p-6"
          >
            <h3 className="mono-label">{group.title}</h3>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-4">
              {group.items.map((item) => (
                <li key={item} className="group flex cursor-default flex-col items-start gap-2 text-sm font-medium">
                  <span className="skill-icon inline-flex rounded-xl p-1 transition-[transform,background-color] duration-300 group-hover:bg-mist">
                    <SkillIcon name={item} />
                  </span>
                  <span className="text-graphite transition-colors duration-200 group-hover:text-ink">{item}</span>
                </li>
              ))}
            </ul>
            {'note' in group && group.note ? (
              <p className="text-xs leading-relaxed text-graphite">{group.note}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
