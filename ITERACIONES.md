# Registro de iteraciones

| Vuelta | Qué se cambió | Puntaje | Fallos que quedan |
| --- | --- | --- | --- |
| 1 | Construcción completa: contenido en JSON, barra, tarjetas, tarjeta expandida, secciones, SEO | 8.6 | Nombre accesible de "Ver caso" con espacio extra; insignia de estado estirada a todo el ancho |
| 2 | `aria-label` explícito en "Ver caso"; insignia con `self-start` | 9.2 | Fuentes Suisse sustituidas; no se midió la velocidad con Lighthouse |
| 3 | Titular nuevo "Programador Entry Level" en la tipografía condensada del sistema + chips Backend / Frontend / Asistido con IA + párrafo que explica la base backend; animación de entrada escalonada con halo menta; secciones que aparecen con degradado al bajar; barra de progreso; íconos que crecen al pasar el mouse; botones y tarjetas que se hunden al presionar | 9.3 | Desborde horizontal de 17 px en celular por el halo; corte duro del halo bajo la barra; subtítulo de la barra todavía decía "Desarrollador Junior" |
| 4 | `overflow-x: clip` en `html`; halo recortado arriba; rol actualizado; titular más compacto en celular; revisión a 768 px y medición de velocidad | 9.7 | Ver "Lo que falta para 10" |

## Puntaje final por criterio

| Criterio | Nota | Evidencia |
| --- | --- | --- |
| Contenido fiel y reglas duras | 2.4 / 2.5 | Titular "Programador Entry Level" con la explicación del backend como base y la IA en ambos lados. Sin "Full Stack" ni nombre de empresa. Siguen los [PENDIENTE] de CV, GitHub y video |
| Estructura y orden | 1.5 / 1.5 | A 360, 768 y 1110 px se ven el titular y las tarjetas en la primera pantalla (a 360 se ve el inicio de la primera tarjeta) |
| Responsive y accesibilidad | 1.5 / 1.5 | Revisado a 360, 768 y 1110 px, sin desborde horizontal (`scrollWidth` = ancho). Toda la animación se apaga con "reducir movimiento"; foco y Esc de la tarjeta siguen bien |
| Simplicidad del código | 1.5 / 1.5 | Toda la animación es CSS: cero JavaScript extra y cero dependencias nuevas. La aparición al bajar usa `animation-timeline: view()`, y donde no hay soporte el contenido se ve normal |
| Rendimiento y SEO | 1.0 / 1.0 | CLS 0, FCP/LCP 312 ms, hidratación 84 ms (medido en desarrollo). Las animaciones solo usan `transform`, `opacity` y `filter` |
| Fidelidad al estilo | 0.9 / 1.0 | El titular usa la condensada en mayúsculas con interlineado 0.9, igual que los títulos de sección. Las fuentes siguen siendo sustitutas de Suisse |
| Microinteracciones (nuevo) | incluido arriba | Íconos al 125 % con rebote al pasar el mouse (verificado: `matrix(1.247…)`); botones al 95 % al presionar; la tarjeta se hunde al hacer clic |
| Explicable por Emerson | 0.9 / 1.0 | Cada bloque de CSS de movimiento tiene un comentario corto que dice qué hace |
| **Total** | **9.7 / 10** | |

## Lo que falta para 10

- Fuentes Suisse con licencia, o aceptar formalmente las sustitutas libres (+0.1).
- Llenar los [PENDIENTE]: CV, GitHub y videos (+0.1).
- Medir con Lighthouse sobre la versión publicada, no la de desarrollo (+0.1).

## Qué se decidió NO construir

- Menú hamburguesa: los 3 enlaces caben en una píldora incluso a 360 px.
- Librería de animación (Framer Motion, GSAP): todo el movimiento se hizo con CSS nativo, que pesa 0 KB y es fácil de llevar a Vite.
- Galería de capturas y demos: el brief las deja para después.
- Componentes shadcn/ui: HTML nativo resuelve todo y la migración a Vite queda más fácil.

## Marcadores [PENDIENTE] y preguntas para Emerson

- URL de GitHub (`site.githubUrl`).
- Archivo del CV en PDF (`site.cvUrl`).
- Videos de Tickets TIC y Formatos TIC (`video.src` / `video.poster`).
- ~~Permiso para mostrar el nombre de la empresa~~: resuelto, se muestra LEGUMEX.

> **Versión vigente: v5 (17 oct 2026).** Máquina de escribir al abrir, secciones que aparecen al bajar, menú activo en gris, tarjetas animadas, LEGUMEX y CV descargable.

## Vuelta 5: entrada, scroll, navegación y tarjetas

- Entrada tipo máquina de escribir (solo al abrir la página): saludo y titular letra por letra, con cursor que avanza y parpadea al final. Solo CSS, sin saltos de diseño; los lectores de pantalla leen el texto completo; desactivada con "reducir movimiento".
- Error encontrado y corregido: con `steps(1)` y 1 ms, el redondeo dejaba letras invisibles y el cursor pegado. Se cambió a interpolación lineal.
- Al bajar, cada bloque aparece por separado: sube, se enfoca y un borde suave lo descubre (mask-position, porque los degradados de `mask-image` no se pueden animar).
- La navegación marca en gris la sección visible (`aria-current="location"`) y al tocarla.
- Tarjeta de caso: entra subiendo y creciendo, fondo oscuro con desenfoque, contenido en cascada; al cerrar hace la salida (el contenido se conserva durante la animación).
- Nombre de la empresa (LEGUMEX) y CV descargable conectados.
- ¿Quieres comprar las fuentes Suisse o te quedas con las sustitutas libres?

## Vuelta 6: navegación tipo app, transiciones entre vistas y pulso — 9.8 / 10

Bucle de 10 hallazgos (cada uno encontrado en navegador a 390, 768, 1440 y 1920 px y corregido):

1. Celular: la cabecera ocupaba dos filas pegajosas (~110 px). Ahora es una fila y la navegación es una barra de pestañas fija abajo, con ícono y texto, respetando el área segura del iPhone.
2. El activo de la navegación cambiaba de color de golpe: ahora un indicador se desliza y estira hasta la pestaña, con un leve rebote.
3. Nueva pestaña "Habilidades" (`#habilidades`).
4. El salto entre secciones pasaba por las intermedias y el indicador parpadeaba: ahora usa View Transitions con dirección (baja o sube) y la barra queda quieta. Sin soporte o con "reducir movimiento" hace scroll normal.
5. El indicador medía `offsetLeft` del enlace dentro de un `li` posicionado (siempre 0): se mide el `li`.
6. Titulares de sección con máquina de escribir y halo menta al entrar en pantalla, no solo al abrir.
7. La máscara de aparición recortaba las tildes de "MÍ" y "CÓMO" (error previo) y cortaba el halo en un rectángulo: los titulares quedan fuera de la máscara.
8. Bloques altos (habilidades en celular) quedaban borrosos y el último bloque de la página no terminaba de aparecer: rango `entry 0% entry min(100%, 280px)`.
9. Tarjetas huérfanas en tablet (proyectos) y en escritorio (habilidades): la última completa la fila.
10. Pulso en todos los enlaces y botones (anillo con `box-shadow`, mouse y teclado); tarjeta de caso como hoja inferior en celular con título tecleado; hover de íconos solo con mouse; contenedor más ancho en monitores ≥ 1536 px.

Pendiente para 10: los mismos [PENDIENTE] de la vuelta 5 (fuentes Suisse, CV/GitHub/videos, Lighthouse en producción).

## Vuelta 7: fotos y videos en las cards, escala fluida, píldora fija y hovers (18 oct 2026)

Cambios (sin tocar textos, colores ni estructura de secciones; celular sin cambios de escala):

1. Cards de proyecto con portada 16:10 (`public/projects/*.webp`) y distintivo "Video" cuando hay recorrido. El diálogo muestra el video (con `poster`, `playsInline`, `preload="none"`) o, si no hay video (Rastro), la portada.
2. Videos de Tickets TIC y Formatos TIC comprimidos (~2.3 MB y ~4.8 MB) en `public/videos/`, con portada. `content.json` ahora tiene `image` por proyecto.
3. Tokens fluidos en `:root` (`--pad-x`, `--pad-y`, `--gap`, `--icon`, `--icon-skill`, `--nav-top`) con mínimos iguales a los valores de celular. `container-page` usa `--pad-x` y llega a 100rem. Íconos de habilidades e interfaz en rem/tokens. `px` de radios y desplazamientos pasados a rem.
4. Desde tablet solo la píldora de secciones es fija (arriba, centrada, fondo casi sólido y blur moderado); nombre y CV se desplazan. En celular la barra y la pestaña inferior siguen igual.
5. El indicador de la píldora ya no salta al destino: viaja y pasa por las secciones del camino.
6. Botones: hover 1.05 y pulsado 0.95 con la misma curva de resorte (`.btn-dark`, `.btn-ghost`). Etiquetas suben 2 px. Logos de habilidades: escala 1.3 + elevación, con el hover en todo el contenedor. Con "reducir movimiento" no hay escalado.

No hecho / decisiones abiertas:
- Framer Motion y `layoutId` (el prompt los pide): el proyecto decidió animar con CSS y cero librerías. Se mantuvo la hoja/tarjeta actual del diálogo. Pendiente decidir si se agrega la dependencia para la expansión card → panel.
- `html { font-size }` se dejó como está (escala desde 64rem). El valor del prompt agrandaría la laptop.
- No se pudo compilar ni medir anchos en navegador en esta vuelta (sin `node_modules` ni red): falta correr `pnpm dev` y revisar 360, 390, 768, 1024, 1280, 1536, 1920, 2560 y 3840 px.

## Vuelta 8: build, medición real en navegador y bucle de mejora (18 oct 2026)

Hecho:
- `pnpm install` y fuentes: `next/font/google` cambiado por `@fontsource/anton`, `@fontsource-variable/inter` y `@fontsource/jetbrains-mono` (solo latin). Las variables `--font-anton`, `--font-inter` y `--font-jetbrains` se mantienen (puestas en `<html style>` en `layout.tsx`). El sitio levanta con Turbopack.
- Capturas y medición a 360, 390, 768, 1024, 1280, 1536, 1920, 2560 y 3840 px: `documentElement.scrollWidth` = ancho en los 9 (sin scroll horizontal). El `body` marca 7–130 px de más a 360–2560 px por el pseudo-elemento del halo (`.hero-glow::before`), recortado por `overflow-x: clip`; no hay scroll real. No se tocó para no alterar el móvil.
- Verificado en navegador: cards 16:10 (ratio 1.6) con etiqueta "Video" en Tickets y Formatos; diálogo con `<video>` (`poster`, `playsInline`, `preload="none"`, carga y duración 65 s) y portada en Rastro; píldora `fixed` y centrada a 768, 1024 y 1280 mientras nombre y CV salen de pantalla; indicador pasa por Sobre mí → Habilidades → Contacto; hover `.btn-dark` y `.btn-ghost` 1.05 y pulsado 0.95; logos 1.3 con elevación de 0.25rem (hover en el contenedor); móvil: barra de pestañas fija abajo y cabecera `sticky`, igual que antes.
- Nota de método: Playwright no pudo descargar Chromium (red bloqueada); se usó un Chromium empaquetado en npm (`@sparticuz/chromium`) fuera del proyecto, sin tocar `package.json` por esto.

Bucle (cambio mínimo por problema, medido antes y después):

| Criterio | Ronda 0 | Ronda 1 |
| --- | --- | --- |
| Escalado | 7 | 8 |
| Animación | 7.5 | 8 |
| Interacción | 8.5 | 8.5 |
| Jerarquía | 8 | 8 |
| Navegación | 7 | 8.5 |
| Rendimiento | 8.5 | 8.5 |
| Accesibilidad | 6.5 | 8 |
| Coherencia con tokens | 7.5 | 8 |
| **Promedio** | **7.6** | **8.2** |

Ronda 1 (los 3 problemas más graves):
1. A 768 px "Sobre mí" se partía en dos líneas y la píldora tocaba el subtítulo del nombre. `components/site-nav.tsx`: `whitespace-nowrap` y `md:px-3` (era `md:px-4`). Medido: enlaces de 36 px en una sola línea, 11 px de aire; móvil y ≥ lg sin cambios.
2. Con "reducir movimiento" los botones seguían escalando a 1.05 (Tailwind v4 usa la propiedad `scale` y la regla solo anulaba `transform`; la nota de la vuelta 7 era incorrecta). `app/globals.css`: regla propia `scale: 1 !important` (en la misma regla, Lightning CSS la fundía con `transform` y se perdía). Medido: 1 con reducir movimiento, 1.05 sin él.
3. `.btn-ghost` tenía `rounded-[4px]` y `border-[1.5px]` en px. Pasado a rem (`0.25rem`, `0.094rem`): idéntico a 16 px (móvil), escala con el resto en pantallas grandes.

Corte por límite de uso tras la ronda 1 (promedio 8.2, ningún criterio bajo 8; falta 0.3 para 8.5).

Problemas abiertos:
- `html { font-size }` a 1024 px vale 14.4 px, menos que a 768 px (16 px). Es decisión documentada de la vuelta 7; queda abierta si se quiere una curva sin bajada.
- En la primera carga las cards esperan 2 s (`firstDelay`) más ~0.9 s de transición: en pantallas altas (p. ej. 4K) la primera pantalla queda vacía unos 3 s bajo el titular.
- Desborde del halo recortado por `overflow-x: clip` (ver arriba).
- Sin medir: Lighthouse en producción (solo se midió en desarrollo); `pnpm build` no se ejecutó en esta vuelta.
- Siguen los [PENDIENTE] de GitHub y las decisiones de Framer Motion / `layoutId`.

Qué haría la ronda 2: (a) reducir el retraso inicial de las cards o mostrarlas desde el primer fotograma cuando caben en la primera pantalla; (b) decidir la curva de `font-size` entre 1024 y 1280 px; (c) correr `pnpm build` y Lighthouse sobre la versión compilada y volver a puntuar.

## Vuelta 9: problemas abiertos, animaciones sin peso y fluidez (18 oct 2026)

Objetivo del usuario: que el sistema no se sienta plano (animaciones y transiciones donde corresponden) y que sea rápido, sin trabarse.

Cambios:
1. **Fluidez:** la aparición al bajar (`[data-reveal]`) y la entrada `rise` animaban `filter: blur()`, que se repinta en cada fotograma. Ahora solo usan `opacity` y `transform` (con un leve `scale(0.97)`/`0.98` para conservar la sensación de "enfocarse"). Medido en móvil, mismo barrido de scroll: tareas largas 1083 → 304 ms, p95 de cuadro 33.4 → 16.8 ms.
2. **Cards sin pantalla vacía:** `firstDelay` de 2000 → 900 ms; entran mientras se escribe el titular.
3. **Escala sin bajada:** de 1024 a 1279 px el `html` vale 16 px (antes 14.4); desde 1280 px la curva fluida es la misma (1366 ≈ 16.5, 1920 = 20, tope 24). A 1024 px el título de la card 3 baja a 3 líneas; el resto de filas se alinea por subgrid.
4. **Halo:** `#proyectos { overflow-x: clip }`. El halo sigue sangrando hasta el borde de la pantalla, pero `body.scrollWidth` ya es igual al ancho en 360, 390, 768, 1024, 1180, 1280, 1920 y 3840 px.
5. **Microanimaciones nuevas (solo `translate`/`transform`):** la flecha de `.btn-dark` y `.btn-ghost` se adelanta al pasar el mouse; el ícono de reproducir de la etiqueta "Video" crece al pasar sobre la card. Con "reducir movimiento" quedan apagadas (regla propia con `translate: none`).
6. Verificado en producción: `pnpm build` compila sin errores (fuentes @fontsource incluidas); botones 1.05 sin "reducir movimiento" y 1 con él.

| Criterio | Vuelta 8 | Vuelta 9 |
| --- | --- | --- |
| Escalado | 8 | 9 |
| Animación | 8 | 8.5 |
| Interacción | 8.5 | 9 |
| Jerarquía | 8 | 8.5 |
| Navegación | 8.5 | 8.5 |
| Rendimiento | 8.5 | 8.5 |
| Accesibilidad | 8 | 8.5 |
| Coherencia con tokens | 8 | 8.5 |
| Fluidez (nuevo) | – | 8 |
| **Promedio** | **8.2** | **8.6** |

Lighthouse (producción local, contenedor sin GPU): accesibilidad 100, SEO 100, buenas prácticas 96, CLS ≈ 0. Rendimiento 41 (móvil) y 58 (escritorio) **no es fiable**: el TBT lo domina el renderizado por CPU del contenedor ("Other" sin atribuir) y varía entre corridas (1920 px: 231 vs 1185 ms sin cambio relevante). Hay que repetirlo en el sitio publicado.

Problemas abiertos:
- Lighthouse real en la versión publicada (y en un equipo con GPU).
- `.nav-indicator` anima `width` (no compuesta); es un elemento diminuto, pero se podría pasar a `transform: scaleX` si aparece lag al navegar.
- `metadataBase` sin definir en `layout.tsx` (aviso del build): poner la URL pública al publicar.
- GitHub [PENDIENTE] y decisión de Framer Motion / `layoutId`.

Siguiente ronda: medir en el sitio publicado; si el indicador se siente pesado, convertirlo a `transform`; revisar con el usuario qué otras transiciones quiere (p. ej. expansión card → panel).
## Ronda 5: diseño y movimiento (plan de 4 fases)

| Fase | Qué se hizo | Verificación |
| --- | --- | --- |
| 1 Ritmo | Hero en una columna (chips → párrafo, 65ch); escritorio: título→chips 32, chips→párrafo 16, hero→cards 96, entre cards 24, sección→sección 96/128; dentro de la card 16/16/12/24/24. Móvil sin cambios | `getBoundingClientRect` a 1280 px: 16 · 32 · 16 · 96 · 24 · [16,16,12,24,24] |
| 2 Botones | Cursor manita en todo lo clicable; hover ×1.10, presionar ×0.95. Causa raíz: Tailwind v4 anima `scale` y el CSS transicionaba `transform` (el efecto saltaba sin animarse; lo mismo en la elevación de las cards y la píldora) | `getComputedStyle`: hover `scale 1.1`, active `0.95`, `cursor pointer` |
| 3 Entrada | Tokens de movimiento; card sube 32 px + fundido (600 ms, ease-out), imagen con barrido + zoom 1.08→1, partes en cascada de 70 ms, cards 90 ms; una sola vez; sin retraso largo. "Ver caso" ahora se expande desde la card pulsada y se encoge al cerrar (tablet y escritorio) | Muestreo cada 150 ms: translateY 32→0, opacidad 0→1, clip-path 100 %→0 |
| 4 Sobre mí | Columna fija con ficha de 4 datos (números que cuentan), lead más grande, formación como pie | Captura a 1280 px; móvil sin ficha |

Comprobado: sin scroll horizontal a 360, 390, 768, 1024, 1280, 1536, 1920, 2560 y 3840 px; todos los bloques terminan visibles tras recorrer la página; `pnpm build` sin errores; consola sin errores.

Pendiente para la siguiente ronda: puntaje formal 0–10 por criterio, medición de fluidez (p95 de cuadro) sobre la versión publicada, revisar capturas de Sobre mí a 768 y de la expansión en tablet.

## Ronda 6: inicio, navegación y aparición

- Inicio: brillo metálico en el titular (copia del texto con `background-clip: text`, franja de izquierda a derecha cada 7 s); tarjeta de código (Express) a la derecha en escritorio; chips con íconos; monograma "ES" en la barra para no repetir nombre ni rol; párrafo sin "entendiendo y validando".
- Navegación: transición "ascensor" solo al usar la barra (sale hacia arriba/abajo según el destino, salto invisible, entra por el lado contrario). Medido: salida 0→-72 px, entrada +72→0, opacidad 0→1. El scroll normal no cambia.
- Aparición ligada al scroll (`animation-timeline: view()`) en las secciones; en navegadores sin soporte queda la entrada por IntersectionObserver.
- "Reducir movimiento" (activo en el Chrome de Emerson): se conserva la cascada pero solo con fundido; la ilustración de Sobre mí ahora se ve también en celular.
- Pendiente: puntaje formal 0–10, p95 de cuadro en la versión publicada.

## Ronda 7: titular "Programador Backend" + chip "Junior"

- Decisión basada en la investigación (reclutadores buscan por términos de rol estándar; el nivel no necesita ir en grande): titular "Programador Backend", chip "Junior" (con ícono) junto a "Frontend" y "Asistido con IA". Actualizados `site.role`, `site.headline` (SEO) y `projectsIntro`.
- Revisado en 390, 768, 1280 y 1920 px: sin scroll horizontal ni errores de consola; hover del botón = escala 1.1.
- Aviso: el CV en PDF aún trae los marcadores `[URL GITHUB]` y `[URL PORTAFOLIO]`, y el sitio muestra `[PENDIENTE: URL]` en GitHub. Hay que llenarlos antes de aplicar a puestos.

## Ronda 8: CV en una hoja

- CV rehecho en 1 página (Carta), texto seleccionable, una columna, fuente estándar (Liberation Sans/Arial). Reemplaza `public/cv/emerson-sontay-cv.pdf`.
- Cambios: línea de resumen "Desarrollador (Programador) Junior"; IA como herramienta (sin "orquestación de agentes"); sin `library-api` hasta terminarla; sin primaria; Ingeniería en Sistemas, UMG (inicio previsto 2027); soporte TI integrado en un solo CV; sin inglés (se responde "básico" en preguntas de portales).
- Pendiente: URL de GitHub y del portafolio publicado (se agregan al regenerar el PDF).

## Ronda 9: coherencia portafolio ↔ CV

- Sección "Cómo trabajo con IA" y grupo de habilidades de IA reescritos sin "orquestación de agentes/subagentes/skills": IA como herramienta que se dirige, se revisa y se prueba (igual que el CV).
- Nuevo grupo "Soporte TI" (como en el CV) y "Diseño responsive" en Interfaces.
- Sobre mí: la formación incluye Ingeniería en Sistemas, UMG (inicio previsto 2027).
- Contacto: ya no se muestra "GitHub [PENDIENTE]" mientras no haya URL; el caso ya no muestra el botón deshabilitado "Demo próximamente".
- CV descargable actualizado (1 hoja). Revisado a 1280 y 390 px: sin scroll horizontal, sin marcadores [PENDIENTE] visibles. Nota: los logos de tecnologías cargan desde la CDN de devicon (no se ven en mi entorno de pruebas, sí en un navegador normal).
- Pendiente: URL de GitHub y del sitio publicado; terminar library-api antes de citarla.
