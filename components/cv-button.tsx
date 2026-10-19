import { Download } from 'lucide-react'
import content from '@/content/content.json'

type CvButtonProps = {
  className?: string
  inverted?: boolean
  /** En tablet la barra superior es estrecha: se ve "CV" y el lector de pantalla sigue leyendo "Descargar CV". */
  compact?: boolean
}

/** Botón "Descargar CV". Queda desactivado mientras no exista el archivo en content.json. */
export function CvButton({ className = '', inverted = false, compact = false }: CvButtonProps) {
  const cvUrl: string | null = content.site.cvUrl
  const colors = inverted ? 'bg-paper text-ink' : ''
  const label = (
    <>
      <Download aria-hidden="true" size={16} />
      <span>
        <span className={compact ? 'md:max-lg:sr-only' : undefined}>Descargar </span>CV
      </span>
    </>
  )

  if (!cvUrl) {
    return (
      <button type="button" disabled title="CV pendiente" className={`btn-dark btn-disabled ${colors} ${className}`}>
        {label}
      </button>
    )
  }

  return (
    <a href={cvUrl} download className={`btn-dark ${colors} ${className}`}>
      {label}
    </a>
  )
}
