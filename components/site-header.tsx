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
        {/* Monograma: el nombre y el rol ya están en el inicio, así no se repiten */}
        <a
          href="#proyectos"
          aria-label={`${site.name}, ir al inicio`}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-lg leading-none tracking-[-0.02em] text-paper transition-[scale] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 active:duration-100 lg:size-12 lg:text-xl"
        >
          {site.name
            .split(' ')
            .map((word) => word[0])
            .join('')}
        </a>

        <SiteNav links={nav} />

        <CvButton compact className="shrink-0 px-4 py-2 text-sm lg:px-5 lg:py-2.5 lg:text-base" />
      </div>
    </header>
  )
}
