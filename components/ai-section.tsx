import content from '@/content/content.json'
import { SectionHeading } from '@/components/section-heading'

/** Cómo trabajo con IA: bloque invertido (negro) para dar contraste. */
export function AiSection() {
  const { ai } = content

  return (
    <section
      aria-labelledby="ia-titulo"
      className="grid gap-6 rounded-t-[2.5rem] rounded-b-card bg-ink px-6 py-10 text-paper md:grid-cols-[1fr_1.4fr] md:gap-8 md:rounded-t-[4rem] md:p-12 lg:p-16"
    >
      <SectionHeading id="ia-titulo" text={ai.title} tone="dark" />
      <p className="text-base leading-relaxed text-ash md:text-lg">{ai.text}</p>
    </section>
  )
}
