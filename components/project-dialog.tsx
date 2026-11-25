'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import type { Project } from '@/components/project-card'
import { Pending, SkillIcon, StatusBadge } from '@/components/ui-bits'
import { Typewriter } from '@/components/typewriter'

const EXPAND_QUERY = '(min-width: 48rem) and (prefers-reduced-motion: no-preference)'
const FULL = 'inset(0px 0px 0px 0px round 2rem)'

/**
 * Caso completo en un <dialog> nativo:
 * - showModal() atrapa el foco y atenúa el fondo.
 * - Esc lo cierra (comportamiento del navegador).
 * - Al cerrar, el navegador devuelve el foco al botón que lo abrió.
 * - Desde tablet, el caso se EXPANDE desde la tarjeta pulsada (un recorte `clip-path` que crece hasta
 *   ocupar el diálogo, sin deformar el contenido) y al cerrar se encoge de vuelta a ella.
 *   En celular sigue siendo una hoja que sube desde abajo; con "reducir movimiento" solo se funde.
 */
export function ProjectDialog({ project, openId, origin }: { project: Project | null; openId: number; origin: HTMLElement | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)

  // Recorte del diálogo que coincide con la tarjeta pulsada (null si no aplica)
  const cardClip = () => {
    const dialog = dialogRef.current
    if (!dialog || !origin?.isConnected || !window.matchMedia(EXPAND_QUERY).matches) return null
    const d = dialog.getBoundingClientRect()
    const c = origin.getBoundingClientRect()
    return `inset(${c.top - d.top}px ${d.right - c.right}px ${d.bottom - c.bottom}px ${c.left - d.left}px round 2rem)`
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!openId || !dialog || dialog.open) return
    if (origin && window.matchMedia(EXPAND_QUERY).matches) dialog.dataset.expand = ''
    else delete dialog.dataset.expand
    dialog.showModal()
    const from = 'expand' in dialog.dataset ? cardClip() : null
    // Entra rápido y frena suave (ease-out): primero asoma con opacidad, luego crece hasta ocupar todo
    if (from) {
      dialog.animate(
        [
          { clipPath: from, opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { clipPath: FULL, opacity: 1 },
        ],
        { duration: 600, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId])

  const close = () => {
    const dialog = dialogRef.current
    if (!dialog?.open || closing.current) return
    const to = 'expand' in dialog.dataset ? cardClip() : null
    if (!to) return dialog.close()
    closing.current = true
    // Salida ≈ 70 % de la entrada (420 ms)
    const animation = dialog.animate(
      [
        { clipPath: FULL, opacity: 1 },
        { opacity: 1, offset: 0.7 },
        { clipPath: to, opacity: 0 },
      ],
      { duration: 420, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
    )
    animation.onfinish = () => {
      dialog.close()
      animation.cancel()
      closing.current = false
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => event.target === event.currentTarget && close()}
      onClose={() => dialogRef.current?.querySelectorAll('video').forEach((video) => video.pause())}
      onCancel={(event) => {
        // Esc: se anima el cierre en vez de ocultar de golpe
        event.preventDefault()
        close()
      }}
      aria-labelledby="caso-titulo"
      className="case-dialog mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overscroll-contain rounded-t-card rounded-b-none bg-paper p-0 text-ink md:m-auto md:max-h-[calc(100dvh-2rem)] md:w-[calc(100%-2rem)] md:max-w-3xl md:rounded-card"
    >
      {project && (
        <div key={openId} className="case-body flex flex-col gap-6 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:p-8">
          <span aria-hidden="true" className="mx-auto -mb-3 h-1.5 w-10 shrink-0 rounded-full bg-ash md:hidden" />
          <button
            type="button"
            onClick={close}
            autoFocus
            aria-label="Cerrar caso"
            className="sticky top-0 z-10 ml-auto -mb-4 grid size-10 place-items-center rounded-full bg-ink text-paper transition-transform duration-150 ease-out hover:rotate-90 active:scale-90 active:duration-75"
          >
            <X aria-hidden="true" className="size-[1.25rem]" />
          </button>

          {project.video.show ? (
            <CaseVideo video={project.video} fallbackPoster={project.image?.src} title={project.title} />
          ) : (
            project.image && (
              <img
                src={project.image.src}
                alt={project.image.alt}
                width={1280}
                height={800}
                decoding="async"
                className="aspect-[16/10] w-full rounded-3xl bg-mist object-cover"
              />
            )
          )}

          <div className="flex flex-col items-start gap-3">
            <h2 id="caso-titulo" className="font-display text-4xl leading-[0.9] tracking-[-0.03em] uppercase md:text-5xl">
              <Typewriter text={project.title} start={200} speed={28} />
            </h2>
            <StatusBadge status={project.status} />
          </div>

          {project.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h3 className="mono-label">{section.title}</h3>
              {section.text && <p className="leading-relaxed text-slate">{section.text}</p>}
              {section.list && (
                <ul className="list-disc space-y-1 pl-5 leading-relaxed text-slate">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {project.technologies.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="mono-label">Tecnologías</h3>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li key={tech} className="flex items-center gap-2 rounded-xl bg-mist px-3 py-2 text-sm font-medium">
                    <SkillIcon name={tech} size={20} />
                    {tech}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex flex-wrap gap-3 border-t border-ash pt-6">
            {project.siteUrl ? (
              <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="btn-dark">
                Ver sitio del equipo
                <ExternalLink aria-hidden="true" size={16} />
              </a>
            ) : project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-dark">
                Ver demo
                <ExternalLink aria-hidden="true" size={16} />
              </a>
            ) : null}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={project.siteUrl || project.demoUrl ? 'btn-ghost' : 'btn-dark'}>
                Ver código en GitHub
                <ExternalLink aria-hidden="true" size={16} />
              </a>
            )}
            <button type="button" onClick={close} className="btn-ghost">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}

/** Video de recorrido: sin autoplay, con carga diferida. Si aún no hay archivo, muestra un marcador. */
function CaseVideo({ video, title, fallbackPoster }: { video: Project['video']; title: string; fallbackPoster?: string }) {
  return (
    <figure className="flex flex-col gap-2">
      {video.src ? (
        <video
          controls
          playsInline
          preload="none"
          poster={video.poster ?? fallbackPoster}
          className="aspect-video w-full rounded-3xl bg-ink"
          aria-label={`Video de recorrido de ${title}`}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      ) : (
        <div className="grid aspect-video w-full place-items-center rounded-3xl bg-mist">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-display text-3xl uppercase md:text-5xl">Video próximamente</span>
            <Pending label="archivo de video" />
          </div>
        </div>
      )}
      {video.description && <figcaption className="text-sm text-slate">{video.description}</figcaption>}
    </figure>
  )
}
