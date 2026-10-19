import { ArrowUpRight, Play } from 'lucide-react'
import { StatusBadge } from '@/components/ui-bits'

export type CaseSection = { title: string; text?: string; list?: string[] }

export type Project = {
  id: string
  image?: { src: string; alt: string }
  title: string
  summary: string
  tags: string[]
  status: string
  video: { show: boolean; src?: string | null; poster?: string | null; description?: string }
  sections: CaseSection[]
  technologies: string[]
  demoUrl: string | null
  siteUrl: string | null
}

/**
 * Tarjeta resumida. Toda la tarjeta es clicable con el mouse (el clic sube hasta la tarjeta);
 * el botón "Ver caso" sigue siendo el control para teclado y lectores de pantalla.
 * Espaciado interno (md+): portada → estado 16 · estado → título 16 · título → resumen 12 · resumen → etiquetas 24 · etiquetas → botón 24.
 */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (origin: HTMLElement) => void }) {
  return (
    <article
      onClick={(event) => onOpen(event.currentTarget)}
      className="group/card relative flex w-full cursor-pointer flex-col gap-4 rounded-card bg-paper p-6 transition-[translate,scale,box-shadow] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)] focus-within:-translate-y-1 active:scale-[0.985] active:duration-100 lg:row-span-6 lg:grid lg:grid-rows-subgrid"
    >
      {project.image && (
        // Portada 16:10. El recorte vive solo en este contenedor, así el zoom no se sale de la imagen
        <div data-media className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist">
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={1280}
            height={800}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
          />
          {project.video.show && project.video.src && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-pill bg-ink/80 px-2.5 py-1 font-mono text-xs tracking-[-0.03em] text-paper backdrop-blur-sm">
              <Play aria-hidden="true" className="size-[0.875em] fill-current transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/card:scale-125" />
              Video
            </span>
          )}
        </div>
      )}

      <StatusBadge status={project.status} />

      <h2 className="text-[1.75rem] font-medium leading-[1.1] tracking-[-0.03em] uppercase md:-mb-1">{project.title}</h2>
      <p className="text-base text-slate md:mb-2">{project.summary}</p>

      <ul aria-label="Etiquetas" className="mt-auto flex flex-wrap gap-2 md:mb-2">
        {project.tags.map((tag) => (
          <li key={tag} className="mint-tag">
            {tag}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Ver caso: ${project.title}`}
        className="btn-dark self-start justify-self-start"
      >
        Ver caso
        <ArrowUpRight aria-hidden="true" className="size-[1.125em]" />
      </button>
    </article>
  )
}
