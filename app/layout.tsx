import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/inter/index.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import content from '@/content/content.json'
import { PressPulse } from '@/components/press-pulse'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SITE_URL, SEO_TITLE, SEO_DESCRIPTION, buildJsonLd } from '@/lib/site'
import './globals.css'

// Sustitutos libres de las fuentes Suisse indicadas en DESIGN.md.
// Se sirven con @fontsource (local, sin pedir nada a Google) para que Turbopack compile sin red.
// Las variables conservan los nombres que usa globals.css.
const fontVars = {
  '--font-anton': "'Anton'",
  '--font-inter': "'Inter Variable'",
  '--font-jetbrains': "'JetBrains Mono'",
} as React.CSSProperties

const title = SEO_TITLE
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${content.site.name}` },
  description: SEO_DESCRIPTION,
  applicationName: `${content.site.name} · Portafolio`,
  authors: [{ name: content.site.fullName, url: SITE_URL }],
  creator: content.site.fullName,
  keywords: [
    'Emerson Sontay', 'Emerson Gerardo Sontay Rodríguez', 'Emerson Sontay Rodríguez', 'desarrollador junior',
    'programador', 'Chimaltenango', 'Guatemala', 'backend', 'Node.js', 'React', 'portafolio',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title,
    description: content.hero.summary,
    url: '/',
    siteName: `${content.site.name} · Portafolio`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    locale: 'es_GT',
    type: 'profile',
    firstName: 'Emerson',
    lastName: 'Sontay Rodríguez',
  },
  twitter: { card: 'summary_large_image', title, description: SEO_DESCRIPTION, images: ['/og-image.png'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
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
        <script
          type="application/ld+json"
          // JSON-LD de schema.org (Person, WebSite y ProfilePage) para buscadores y asistentes de IA
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c') }}
        />
        {children}
        <PressPulse />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
            <GoogleAnalytics />
          </>
        )}
      </body>
    </html>
  )
}