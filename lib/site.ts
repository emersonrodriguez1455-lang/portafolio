import content from '@/content/content.json'

/** URL pública del sitio. Si se conecta un dominio propio, basta con cambiar NEXT_PUBLIC_SITE_URL en Vercel. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portafolio-c8jc.vercel.app').replace(/\/$/, '')

const { site } = content

export const SEO_TITLE = `${site.name} · ${site.role} en Chimaltenango, Guatemala`
export const SEO_DESCRIPTION =
  `${site.fullName} (${site.name}) es desarrollador junior de Chimaltenango, Guatemala, con enfoque en backend ` +
  '(Node.js, Express, SQL, APIs REST) y experiencia en frontend con React en sistemas internos de LEGUMEX. Portafolio, proyectos y contacto.'

/** Datos estructurados schema.org (JSON-LD). Solo datos que ya aparecen en el portafolio. */
export function buildJsonLd() {
  const personId = `${SITE_URL}/#persona`
  const sameAs = [site.githubUrl, (site as { linkedinUrl?: string }).linkedinUrl].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: site.name,
        alternateName: [site.fullName, 'Emerson Sontay Rodríguez'],
        givenName: 'Emerson Gerardo',
        familyName: 'Sontay Rodríguez',
        jobTitle: site.role,
        description:
          'Desarrollador junior con enfoque en backend (Node.js, Express, SQL, APIs REST) y experiencia en frontend con React. ' +
          'Hizo su práctica profesional en LEGUMEX (El Tejar, Chimaltenango), donde desarrolló el frontend de dos sistemas internos. ' +
          'Ingeniería en Sistemas en la Universidad Mariano Gálvez de Guatemala, con inicio previsto en 2027.',
        url: `${SITE_URL}/`,
        email: `mailto:${site.email}`,
        image: `${SITE_URL}/og-image.png`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chimaltenango',
          addressRegion: 'Chimaltenango',
          addressCountry: 'GT',
        },
        homeLocation: { '@type': 'Place', name: site.location },
        nationality: { '@type': 'Country', name: 'Guatemala' },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Liceo Cristiano Hispanoamericano',
          address: { '@type': 'PostalAddress', addressLocality: 'Chimaltenango', addressCountry: 'GT' },
        },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          name: 'Bachillerato Industrial y Perito en Computación',
          credentialCategory: 'Diploma de nivel medio',
          recognizedBy: { '@type': 'EducationalOrganization', name: 'Liceo Cristiano Hispanoamericano' },
        },
        knowsAbout: [
          'JavaScript', 'SQL', 'HTML5', 'CSS3', 'React', 'Tailwind CSS', 'Vite', 'Node.js', 'Express',
          'APIs REST', 'PostgreSQL', 'MySQL', 'SQLite', 'Desarrollo web', 'Backend',
        ],
        knowsLanguage: { '@type': 'Language', name: 'Español', alternateName: 'es' },
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#sitio`,
        url: `${SITE_URL}/`,
        name: `${site.name} · Portafolio`,
        inLanguage: 'es-GT',
        author: { '@id': personId },
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#perfil`,
        url: `${SITE_URL}/`,
        name: SEO_TITLE,
        description: SEO_DESCRIPTION,
        inLanguage: 'es-GT',
        isPartOf: { '@id': `${SITE_URL}/#sitio` },
        about: { '@id': personId },
        mainEntity: { '@id': personId },
        dateModified: new Date().toISOString().slice(0, 10),
      },
    ],
  }
}
