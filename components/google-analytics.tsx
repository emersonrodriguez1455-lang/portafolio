import Script from 'next/script'

/**
 * Google Analytics 4: queda APAGADO mientras no exista la variable NEXT_PUBLIC_GA_ID en Vercel
 * (por ejemplo "G-XXXXXXXXXX"). Al agregarla y volver a desplegar, empieza a medir.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  )
}
