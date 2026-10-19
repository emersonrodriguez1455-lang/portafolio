import { MessageCircle } from 'lucide-react'
import content from '@/content/content.json'
import { CvButton } from '@/components/cv-button'
import { Pending } from '@/components/ui-bits'
import { SectionHeading } from '@/components/section-heading'

/** Contacto: correo, WhatsApp (sin número visible), GitHub, ubicación, idioma y disponibilidad. */
export function ContactSection() {
  const { site, contact } = content
  const githubUrl: string | null = site.githubUrl

  const details = [
    { label: 'Ubicación', value: site.location },
    { label: 'Idioma', value: contact.language },
    { label: 'Disponibilidad', value: contact.availability },
  ]

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="flex flex-col gap-8 rounded-card bg-paper px-5 py-8 md:gap-10 md:p-12 lg:p-16"
    >
      <div className="flex flex-col gap-4">
        <SectionHeading id="contacto-titulo" text={contact.title} />
        <p className="text-lg text-slate md:text-xl">{contact.message}</p>
      </div>

      <div className="flex flex-col gap-4">
        <a
          href={`mailto:${site.email}`}
          className="self-start break-all rounded-lg bg-volt px-3 py-2 text-lg font-medium underline-offset-4 transition-transform duration-150 ease-out select-none hover:underline active:scale-[0.97] active:duration-75 md:text-2xl"
        >
          {site.email}
        </a>
        <div className="flex flex-wrap gap-3">
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-dark">
            <MessageCircle aria-hidden="true" size={18} />
            Escribir por WhatsApp
          </a>
          {githubUrl ? (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-slate">
              GitHub <Pending label="URL" />
            </span>
          )}
        </div>
      </div>

      <dl className="grid gap-4 border-t border-ash pt-6 sm:grid-cols-3">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1">
            <dt className="mono-label">{detail.label}</dt>
            <dd className="font-medium">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        <CvButton />
        <a href="#proyectos" className="btn-ghost">
          Ver proyectos
        </a>
        {!site.cvUrl && <Pending label="archivo del CV en PDF" />}
      </div>
    </section>
  )
}
