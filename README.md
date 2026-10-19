# Portafolio de Emerson Sontay

Sitio de una sola página. Primero se ven los proyectos y después Sobre mí, IA, Habilidades y Contacto.

## Cómo editar el contenido

Todo el texto vive en **`content/content.json`**. No hace falta tocar el código para:

- Cambiar textos, proyectos, habilidades o datos de contacto.
- Activar el CV: pon la ruta en `site.cvUrl` (por ejemplo `"/cv-emerson-sontay.pdf"`) y copia el PDF a `public/`.
- Agregar GitHub: pon la URL en `site.githubUrl`.
- Agregar un video: copia el `.mp4` y su portada a `public/videos/` y llena `video.src` y `video.poster` del proyecto.
- Activar un demo: pon la URL en `demoUrl`.
- Un ícono nuevo: agrégalo en `icons` (`"devicon:carpeta/archivo"` o `"lucide:nombre"`).

Si un dato falta (`null`), la página muestra un marcador amarillo **[PENDIENTE]**.

## Correr y publicar

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # versión de producción
```

Para publicar: conecta el repositorio en Vercel (gratis). No necesita variables de entorno.

## Estructura

```
content/content.json        Todo el contenido
app/layout.tsx              Fuentes, título, descripción e imagen para compartir
app/page.tsx                Orden de las secciones
app/globals.css             Colores y estilos del archivo de diseño (tokens)
components/site-header.tsx  Barra superior delgada
components/projects-section.tsx  Frase + tarjetas; controla qué caso está abierto
components/project-card.tsx      Una sola tarjeta reutilizable
components/project-dialog.tsx    Caso completo (tarjeta expandida)
components/about-section.tsx, ai-section.tsx, skills-section.tsx, contact-section.tsx
components/cv-button.tsx    Botón "Descargar CV" (desactivado si no hay archivo)
components/ui-bits.tsx      Piezas pequeñas: marcador PENDIENTE, insignia, íconos
```

## Decisiones técnicas (en lenguaje simple)

- **`<dialog>` nativo del navegador para la tarjeta expandida.** Atrapa el foco, se cierra con Esc y devuelve el foco al botón que la abrió sin librerías. Solo agregué cerrar al hacer clic fuera.
- **Una sola tarjeta de proyecto** que recibe datos del JSON, en lugar de tres copias.
- **El caso completo se arma con una lista de secciones** (título + texto o viñetas). Así Rastro, que tiene otras secciones, usa el mismo componente.
- **Íconos de devicon por CDN** con `<img>` y carga diferida: logos oficiales sin instalar paquetes. Para las habilidades que no son tecnologías uso íconos genéricos de `lucide-react`, que ya venía en el proyecto.
- **Fuentes sustitutas libres:** Anton (títulos), Inter (texto) y JetBrains Mono (etiquetas), en lugar de Suisse, que es de pago. Así lo indica el archivo de diseño.
- **Sin shadcn/ui ni estado global:** la página no los necesita. Solo hay un `useState` (qué proyecto está abierto).
- **Bloqueo del scroll con CSS** (`html:has(dialog[open])`) en lugar de JavaScript.
- **Video sin reproducción automática** y con `preload="none"`, para que la página cargue rápido.
- **Empresa de la práctica:** LEGUMEX (El Tejar, Chimaltenango), nombrada en "Sobre mí".
- **CV:** `public/cv/emerson-sontay-cv.pdf`, enlazado desde `site.cvUrl`.
- **Dependencias:** solo las de Next.js, Tailwind, `lucide-react` (íconos) y `@vercel/analytics` (visitas). No agregué ninguna.

## Cómo migrar a Vite (fase 2)

1. `pnpm create vite@latest portafolio -- --template react-ts`, luego instala Tailwind v4 (`@tailwindcss/vite`) y `lucide-react`.
2. Copia `content/`, `components/` y el contenido de `app/globals.css` a `src/`.
3. Borra la línea `'use client'` de los componentes (en Vite no existe).
4. Crea `src/App.tsx` con el contenido de `app/page.tsx`.
5. Cambia las fuentes de `next/font` por `@fontsource/anton`, `@fontsource-variable/inter` y `@fontsource/jetbrains-mono`. Ajusta `--font-display/sans/mono` en el CSS.
6. Pasa el título, la descripción y las etiquetas Open Graph de `layout.tsx` a `index.html`.
7. Configura el alias `@/` en `vite.config.ts` y `tsconfig.json`, o usa rutas relativas.
8. Pasa los encabezados de seguridad de `next.config.mjs` a `vercel.json`.
