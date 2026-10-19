import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/inter/index.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import content from '@/content/content.json'
import { PressPulse } from '@/components/press-pulse'
import './globals.css'

// Sustitutos libres de las fuentes Suisse indicadas en DESIGN.md.
// Se sirven con @fontsource (local, sin pedir nada a Google) para que Turbopack compile sin red.
// Las variables conservan los nombres que usa globals.css.
const fontVars = {
  '--font-anton': "'Anton'",
  '--font-inter': "'Inter Variable'",
  '--font-jetbrains': "'JetBrains Mono'",
} as React.CSSProperties

const title = `${content.site.name} · ${content.site.role}`

export const metadata: Metadata = {
  title,
  description: content.site.headline,
  openGraph: {
    title,
    description: content.hero.summary,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    locale: 'es_GT',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, images: ['/og-image.png'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#e5e5e5',
  width: 'device-width',
  initialScale: 1,
  // Permite usar env(safe-area-inset-*) para la barra de pestañas en iPhone
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-GT" style={fontVars}>
      {/* Algunas extensiones del navegador agregan atributos al <body> antes de hidratar; se ignoran solo en este nodo */}
      <body suppressHydrationWarning>
        {children}
        <PressPulse />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}