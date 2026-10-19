import type { CSSProperties } from 'react'

/** Tokens de color del "editor": palabra clave (volt), texto (menta), puntuación (humo) */
const k = 'text-volt'
const s = 'text-mint'
const p = 'text-smoke'

const lines: { key: string; parts: [string, string?][] }[] = [
  { key: 'a', parts: [['import', k], [' express ', 'text-paper'], ['from', k], [" 'express'", s]] },
  { key: 'b', parts: [['const', k], [' app = express()', 'text-paper']] },
  { key: 'c', parts: [['', p]] },
  { key: 'd', parts: [['app', 'text-paper'], ['.get(', p], ["'/tickets'", s], [', ', p], ['async', k], [' (req, res) => {', p]] },
  { key: 'e', parts: [['  const', k], [' rows = ', 'text-paper'], ['await', k], [' sql`SELECT * FROM tickets`', s]] },
  { key: 'f', parts: [['  res.json(rows)', 'text-paper']] },
  { key: 'g', parts: [['})', p]] },
]

/**
 * Tarjeta decorativa del inicio (solo escritorio): un editor con una ruta de Express que se escribe línea a línea,
 * con dos etiquetas flotantes. Equilibra el titular enorme con algo visual relacionado con el backend.
 * Es ilustrativa: no representa un archivo real del portafolio.
 */
export function HeroCodeCard({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rise relative ${className}`} style={{ '--d': '500ms' } as CSSProperties}>
      <div className="overflow-hidden rounded-card bg-ink shadow-[0_1px_2px_rgb(0_0_0/0.1),0_24px_48px_-24px_rgb(0_0_0/0.55)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <span className="size-2.5 rounded-full bg-slate" />
          <span className="size-2.5 rounded-full bg-slate" />
          <span className="size-2.5 rounded-full bg-mint" />
          <span className="ml-2 font-mono text-xs tracking-[-0.03em] text-smoke">server.js</span>
        </div>
        <pre className="overflow-hidden px-5 pt-5 pb-7 font-mono text-[0.8125rem] leading-[1.7] tracking-[-0.03em] whitespace-pre text-ash">
          {lines.map((line, i) => (
            <div key={line.key} className="code-line min-h-[1.7em]" style={{ '--k': i } as CSSProperties}>
              {line.parts.map(([text, color], j) => (
                <span key={j} className={color}>
                  {text}
                </span>
              ))}
              {i === lines.length - 1 && <span className="code-caret" />}
            </div>
          ))}
        </pre>
      </div>

      <span className="float absolute -top-4 right-8 rounded-pill bg-mint px-4 py-1.5 font-mono text-sm tracking-[-0.03em] shadow-[0_8px_20px_-10px_rgb(0_0_0/0.4)]" style={{ '--fd': '0s' } as CSSProperties}>
        Node.js
      </span>
      <span className="float absolute -bottom-4 left-8 rounded-pill bg-paper px-4 py-1.5 font-mono text-sm tracking-[-0.03em] shadow-[0_8px_20px_-10px_rgb(0_0_0/0.4)]" style={{ '--fd': '-2.5s' } as CSSProperties}>
        SQL
      </span>
    </div>
  )
}
