import content from '@/content/content.json'
import { CvButton } from '@/components/cv-button'
import { SiteNav } from '@/components/site-nav'

/**
 * Barra superior: nombre a la izquierda, navegación al centro y CV a la derecha.
 * Celular: la barra es fija (como antes). Desde tablet solo la píldora de secciones queda fija;
 * el nombre y el CV se desplazan con la página.
 * El desenfoque vive en un pseudo-elemento: si estuviera en el <header>, la barra
 * de pestañas fija del celular quedaría atrapada dentro de él.
 */
export function SiteHeader() {
  const { site, nav } = content

  return (
    <header className="site-header sticky top-0 z-40 before:absolute before:inset-0 before:-z-10 before:border-b before:border-ink/5 before:bg-canvas before:shadow-[0_8px_24px_-20px_rgb(0_0_0/0.5)] md:static md:before:hidden">
      <div className="container-page flex items-center justify-between gap-4 py-3 md:py-[var(--nav-top)]">
        <a href="#proyectos" className="flex min-w-0 flex-col rounded-lg leading-tight">
          <span className="truncate text-base font-medium">{site.name}</span>
          <span className="mono-label truncate">{site.role}</span>
        </a>

        <SiteNav links={nav} />

        <CvButton compact className="shrink-0 px-4 py-2 text-sm lg:px-5 lg:py-2.5 lg:text-base" />
      </div>
    </header>
  )
}
