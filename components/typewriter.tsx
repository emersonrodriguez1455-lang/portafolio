import type { CSSProperties } from 'react'

type TypewriterProps = {
  text: string
  /** Milisegundos antes de escribir la primera letra */
  start?: number
  /** Milisegundos entre letras */
  speed?: number
  /** Cursor que parpadea al terminar */
  caret?: boolean
}

/**
 * Efecto máquina de escribir hecho solo con CSS (ver `.tw-char` en globals.css).
 * Todas las letras ocupan su lugar desde el inicio, así el diseño no salta;
 * solo se vuelven visibles una por una. Los lectores de pantalla leen el texto completo.
 */
export function Typewriter({ text, start = 0, speed = 45, caret = false }: TypewriterProps) {
  const chars = Array.from(text)
  const timing = {
    '--tw-start': `${start}ms`,
    '--tw-speed': `${speed}ms`,
    '--tw-end': `${start + chars.length * speed}ms`,
  } as CSSProperties

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={timing}>
        {chars.map((char, i) => (
          <span key={i} className="tw-char" style={{ '--i': i } as CSSProperties}>
            {char}
          </span>
        ))}
        {caret && <span className="tw-caret" />}
      </span>
    </>
  )
}
