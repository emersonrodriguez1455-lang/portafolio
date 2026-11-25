import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Se permite a todos los rastreadores, incluidos los de buscadores y asistentes de IA,
// para que puedan encontrar y citar el portafolio.
const aiBots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended',
  'Bingbot', 'Googlebot', 'meta-externalagent', 'CCBot', 'DuckAssistBot', 'MistralAI-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: aiBots, allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
