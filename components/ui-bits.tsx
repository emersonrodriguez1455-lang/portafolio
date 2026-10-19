import {
  BookOpen,
  Blocks,
  Brain,
  CircleCheck,
  Code,
  Database,
  ListChecks,
  Puzzle,
  RefreshCw,
  ScanSearch,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import content from '@/content/content.json'

/** Marcador visible para datos que Emerson todavía debe entregar. */
export function Pending({ label }: { label: string }) {
  return <mark className="rounded-[4px] bg-volt px-1.5 py-0.5 font-mono text-xs text-ink">[PENDIENTE: {label}]</mark>
}

/** Insignia de estado de un proyecto. */
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-start gap-2 self-start justify-self-start rounded-xl bg-mist px-3 py-1 font-mono text-xs leading-normal tracking-[-0.03em] text-pretty text-slate">
      <span aria-hidden="true" className="mt-[0.4em] size-2 shrink-0 rounded-full bg-ink" />
      {status}
    </span>
  )
}

// Íconos genéricos (sin logos de marca) para habilidades que no son tecnologías
const genericIcons: Record<string, LucideIcon> = {
  database: Database,
  workflow: Workflow,
  refresh: RefreshCw,
  blocks: Blocks,
  list: ListChecks,
  check: CircleCheck,
  book: BookOpen,
  puzzle: Puzzle,
  brain: Brain,
  users: Users,
  search: ScanSearch,
}

const icons: Record<string, string> = content.icons

/**
 * Ícono de una tecnología o habilidad.
 * "devicon:..." usa el logo oficial de devicon; "lucide:..." usa un ícono genérico.
 */
export function SkillIcon({ name, size }: { name: string; size?: number }) {
  const [source, slug] = (icons[name] ?? 'lucide:code').split(':')
  // Sin `size`: tamaño fluido del sistema (--icon-skill). Con `size`: px de diseño convertidos a rem (16 px = 1 rem), así también escalan.
  const dim = size ? `${size / 16}rem` : 'var(--icon-skill)'

  if (source === 'devicon') {
    return (
      <img
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}.svg`}
        alt={`Logo de ${name}`}
        width={32}
        height={32}
        style={{ width: dim, height: dim }}
        loading="lazy"
        decoding="async"
      />
    )
  }

  const Icon = genericIcons[slug] ?? Code
  return <Icon aria-hidden="true" style={{ width: dim, height: dim }} strokeWidth={1.5} />
}
