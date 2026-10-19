import content from '@/content/content.json'
import { SectionHeading } from '@/components/section-heading'

/**
 * Sobre mí: columna izquierda fija con el titular y una imagen; columna derecha con el primer párrafo
 * como "lead", el resto en lectura normal y la formación como pie.
 * La imagen solo aparece desde tablet: el celular se mantiene como estaba.
 * Para poner una foto: en content.json, `about.photo` = { "src": "/ruta.jpg", "alt": "…" }.
 */
export function AboutSection() {
  const { about } = content
  const [lead, ...rest] = about.paragraphs
  const photo = about.photo as { src: string; alt: string } | null

  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-x-12 lg:gap-x-16">
      <div className="flex flex-col gap-8 md:sticky md:top-28 md:self-start">
        <SectionHeading id="sobre-mi-titulo" text={about.title} />

        <figure className="hidden aspect-[4/3] overflow-hidden rounded-card bg-mint shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-14px_rgb(0_0_0/0.14)] md:block">
          {photo ? (
            <img src={photo.src} alt={photo.alt} width={960} height={720} loading="lazy" decoding="async" className="size-full object-cover" />
          ) : (
            <DeveloperIllustration />
          )}
        </figure>
      </div>

      <div className="flex flex-col gap-4 text-base leading-relaxed text-slate md:text-lg">
        <p className="md:mb-2 md:text-2xl md:leading-snug md:font-medium md:tracking-[-0.02em] md:text-ink md:text-pretty">{lead}</p>
        {rest.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="border-t border-ash pt-4 font-mono text-xs text-smoke md:mt-4">{about.education}</p>
      </div>
    </section>
  )
}

/** Ilustración provisional (persona programando) con los colores del sistema. Se reemplaza por una foto con `about.photo`. */
function DeveloperIllustration() {
  const skin = '#e9b996'
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Ilustración de una persona programando frente a una laptop" className="size-full">
      <circle cx="396" cy="74" r="40" fill="#fff100" opacity="0.9" />
      <circle cx="64" cy="318" r="84" fill="#ffffff" opacity="0.4" />

      {/* Persona */}
      <path d="M146 290 C146 234 184 206 240 206 C296 206 334 234 334 290 Z" fill="#2f2f2f" />
      <rect x="226" y="184" width="28" height="30" rx="10" fill={skin} />
      <circle cx="240" cy="158" r="36" fill={skin} />
      <path d="M203 156 C199 122 224 108 245 111 C273 114 282 136 277 158 C269 142 253 137 238 139 C225 141 212 146 203 156 Z" fill="#000" />
      <rect x="219" y="157" width="18" height="15" rx="5" fill="#fff" fillOpacity="0.45" stroke="#000" strokeWidth="2.5" />
      <rect x="243" y="157" width="18" height="15" rx="5" fill="#fff" fillOpacity="0.45" stroke="#000" strokeWidth="2.5" />
      <path d="M237 164 H243" stroke="#000" strokeWidth="2.5" />
      <path d="M231 183 Q240 190 249 183" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M226 212 L224 240 M254 212 L256 240" stroke="#d1ffca" strokeWidth="3.5" strokeLinecap="round" />

      {/* Laptop y escritorio */}
      <rect x="176" y="224" width="128" height="60" rx="9" fill="#ffffff" stroke="#000" strokeWidth="3" />
      <circle cx="240" cy="254" r="7" fill="#d1ffca" stroke="#000" strokeWidth="2.5" />
      <rect x="160" y="282" width="160" height="8" rx="4" fill="#000" />
      <rect x="36" y="290" width="408" height="14" rx="7" fill="#000" />

      {/* Tarjetas flotantes */}
      <g className="float" style={{ '--fd': '0s' } as React.CSSProperties}>
        <rect x="34" y="62" width="120" height="78" rx="14" fill="#fff" />
        <circle cx="50" cy="78" r="3.5" fill="#000" />
        <circle cx="62" cy="78" r="3.5" fill="#d1ffca" stroke="#000" strokeWidth="1" />
        <rect x="48" y="94" width="62" height="7" rx="3.5" fill="#000" />
        <rect x="48" y="108" width="86" height="7" rx="3.5" fill="#c6c6c6" />
        <rect x="48" y="122" width="44" height="7" rx="3.5" fill="#d1ffca" />
      </g>
      <g className="float" style={{ '--fd': '-1.6s' } as React.CSSProperties}>
        <rect x="334" y="124" width="104" height="46" rx="23" fill="#000" />
        <text x="386" y="154" textAnchor="middle" fontSize="20" fill="#d1ffca" className="font-mono">
          {'</>'}
        </text>
      </g>
      <g className="float" style={{ '--fd': '-3.2s' } as React.CSSProperties}>
        <rect x="52" y="184" width="88" height="40" rx="20" fill="#fff" />
        <text x="96" y="210" textAnchor="middle" fontSize="16" fill="#000" className="font-mono">
          API
        </text>
      </g>
      <g className="float" style={{ '--fd': '-2.4s' } as React.CSSProperties}>
        <rect x="350" y="214" width="88" height="40" rx="20" fill="#fff" />
        <text x="394" y="240" textAnchor="middle" fontSize="16" fill="#000" className="font-mono">
          SQL
        </text>
      </g>
    </svg>
  )
}
