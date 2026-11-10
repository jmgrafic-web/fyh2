# Find Your Haven — sitio web

Sitio estático en Jekyll, listo para GitHub Pages. Cuatro idiomas (EN/ES/NL/FR)
para las páginas fijas, y una colección de artículos (`_articles/`) para la
revista/blog, pensada para ir creciendo sin tocar el resto del sitio.

## Estructura

```
_config.yml         configuración del sitio
_data/strings.yml    textos de interfaz (menú, botones) por idioma
_includes/           cabecera, pie, bloque SEO
_layouts/            plantilla general y plantilla de artículo
_articles/           un archivo .md por artículo — AQUÍ es donde se añade contenido
en/ es/ nl/ fr/       páginas de inicio por idioma
en|es|nl|fr/blog/     índice de la revista por idioma (se genera solo)
assets/               CSS y (cuando los añadas) imágenes
index.html            página raíz: selector de idioma + redirección automática
ARTICLES-GUIA.md      cómo añadir un artículo nuevo — léelo antes de publicar el primero
```

## Identidad visual — v10 «estudio de arquitectura»

Rediseño completo con el mismo contenido de la v8. Todo está en `assets/css/main.css` (tokens al
principio y bloque «v10» al final):

| Color | Uso | Valor |
|---|---|---|
| Hormigón claro | Fondos | `#EBE9E4` |
| Grafito | Texto, secciones oscuras, pie | `#111111` / `#121211` |
| Gris cálido | Texto secundario | `#7C7972` |
| Terracota | Acento puntual (números, cuadrados, iconos) | `#C8552D` |

- **Tipografía:** Archivo (titulares grandes y texto) e IBM Plex Mono (etiquetas técnicas). Están
  alojadas en `assets/fonts/`, sin Google Fonts.
- **Gestos:** retícula de 4 columnas visible, etiquetas numeradas `01 — Nuestro modelo`, titulares
  enormes con interlineado apretado, botones en píldora con icono, formularios de línea y el nombre
  gigante en el pie.

### Portada (una sola plantilla para los 4 idiomas)
- Plantilla: `_includes/home.html`. Textos: `_data/home.yml` (un bloque por idioma). Los
  `{es,en,nl,fr}/index.html` solo llevan el front matter.
- Secciones: hero a pantalla completa → cinta en movimiento (argumentos + zonas) → 01 Modelo →
  02 Servicios (sección oscura, imagen que sigue al cursor) → banda con cita y parallax →
  03 Proceso (scroll horizontal fijado en escritorio, deslizable en móvil) → 04 Revista → guía →
  05 Contacto → 06 Partners (oscura) → pie.

### Movimiento (`assets/js/motion.js`)
Librerías alojadas en `assets/js/vendor/`: GSAP 3.15 + ScrollTrigger + SplitText (licencia
estándar gratuita de GSAP, válida para webs comerciales) y Lenis 1.3 (desplazamiento suave).
- Cargador de entrada (solo la primera visita de la sesión), entrada del hero, titulares que suben
  por líneas, párrafo que se enciende palabra a palabra, fotos que se abren al hacer scroll,
  parallax, línea que se dibuja, cinta que acelera con el scroll, imagen flotante en servicios,
  botones magnéticos, nombre del pie letra a letra y cabecera que se esconde al bajar.
- Sin JavaScript, o con «reducir movimiento» activado en el sistema, la web se ve completa y
  estática.

- La **página raíz** (`index.html`, selector de idioma) usa ahora la misma foto, imagotipo y tipografías que la web.
  El navegador entra directo al primer idioma preferido del usuario que esté disponible (EN, ES, NL, FR).
- **Página 404** de marca (`404.html`), en los 4 idiomas y marcada como `noindex`.
- **PDF de la guía gratuita**, en los 4 idiomas, con esta identidad (imagotipo, fuentes y azul corporativo; texto
  seleccionable). Se generan desde `_guides/` (ver "Guía gratuita" más abajo).

## Imagotipo y favicons

El imagotipo se carga desde `assets/img/brand/` tal y como se entregó (sin tocar):
`fyh-mark-white(-sm).png` sobre la portada y `fyh-mark-blue(-sm).png` cuando la cabecera pasa a
fondo claro (al hacer scroll y en las páginas interiores). La versión pequeña (`-sm`) es la que
se ve en la cabecera; la grande se carga solo en pantallas de muy alta densidad. Tamaño: 28 px de alto.
Los favicons (`favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`) están hechos con ese
mismo imagotipo sobre fondo blanco cálido, para que se vean bien también en pestañas oscuras.

## Imagen del hero (portada)

La portada usa la foto de la terraza con piscina (`assets/img/hero/`), en tres encuadres que el
navegador elige solo:

- **Escritorio** (`hero-terraza-desktop`, 16:9), **tablet en vertical** (`hero-terraza-tablet`, 3:4)
  y **móvil** (`hero-terraza-mobile`, 4:5, encuadre centrado en la casa y el mar).
- La foto ocupa toda la pantalla con un degradado oscuro abajo y a la izquierda; el titular va en
  blanco, muy grande, encima.

Cada encuadre está en WebP y JPG. Para cambiar la foto, sustituye los tres archivos manteniendo los
nombres.

## SEO: cómo está montado

- **hreflang** completo entre las 4 versiones de cada página (cada una se lista a sí misma), con `x-default` al inglés.
- Datos estructurados: `Organization` (portadas), `Article` y `BreadcrumbList` (artículos).
- Un H1 por página; títulos ≤ 62 caracteres y metadescripciones de 120-160 en todos los artículos.
- Enlazado interno: lecturas relacionadas curadas, 2-6 enlaces contextuales por artículo, portada → artículos,
  pie de página → guías principales, selector de idioma → mismo artículo en otro idioma.
- Sitemap automático (`jekyll-sitemap`); `noindex` en la 404 y en las páginas de agradecimiento.

## Nota sobre la URL actual

Este paquete está configurado para publicarse en `https://jmgrafic-web.github.io/fyhcatalonia/`
(repo de proyecto llamado `fyhcatalonia`). Todo el sitio usa `site.baseurl` internamente para
que los enlaces, el CSS y el JS funcionen correctamente bajo esa subcarpeta — no hace falta
tocar nada más para que funcione tal cual.

Si en el futuro **renombras el repo** o **conectas un dominio propio**, solo tienes que editar
dos líneas en `_config.yml`:
- `url:` → tu nuevo dominio (o `https://jmgrafic-web.github.io` si usas un dominio propio con este mismo repo)
- `baseurl:` → `""` (vacío) si el sitio pasa a vivir en la raíz del dominio, o `"/nuevo-nombre-repo"` si sigue siendo un repo de proyecto con otro nombre

Después de cambiar esas dos líneas, haz commit — GitHub reconstruye el sitio solo.

## Desplegar en GitHub Pages (la primera vez)

1. Crea un repositorio nuevo en GitHub y sube todo el contenido de esta carpeta
   a la raíz del repositorio (no lo metas dentro de una subcarpeta).
2. En el repositorio: **Settings → Pages → Build and deployment → Source**,
   elige **Deploy from a branch**, rama `main` (o `master`), carpeta `/ (root)`.
3. Espera 1-2 minutos y GitHub te dará la URL pública (algo como
   `https://tu-usuario.github.io/tu-repo/`).
4. Abre `_config.yml` y cambia el valor de `url:` por esa URL (o por tu dominio
   propio, si vas a conectar uno). Esto es importante para que el `sitemap.xml`,
   las etiquetas `hreflang` y los enlaces de SEO sean correctos.
5. Si conectas un dominio propio (recomendado, tipo `findyourhaven.com`):
   Settings → Pages → Custom domain, y sigue las instrucciones de GitHub para
   los registros DNS. Cuando lo tengas, vuelve a actualizar `url:` en `_config.yml`.

Cada `git push` a la rama principal reconstruye el sitio entero automáticamente
— no hace falta ningún paso manual adicional, ni siquiera para añadir artículos.

## Formularios (captación de clientes)

El sitio tiene **dos formularios**, ambos por Formspree (gratis, sin backend propio):

### 1. Formulario de contacto (sección «Contacto» de cada home)
Formulario mínimo y sin presión comercial: nombre, correo electrónico, teléfono (opcional),
«¿En qué podemos ayudarte?» (desplegable) y mensaje, con el botón «Enviar consulta». Se envía con
JavaScript (`assets/js/contact.js`) sin recargar la página y muestra el mensaje de confirmación
(«Gracias por escribirnos…»). Sin JavaScript se envía igualmente de forma normal a Formspree.
Incluye un campo trampa (`_gotcha`) contra spam.

Para activarlo: crea un formulario en [formspree.io](https://formspree.io) y pon su endpoint en el
atributo `action` del `<form class="contact-form">` de `es/`, `en/`, `nl/` y `fr/index.html`
(ahora pone `TU_ID_FORMSPREE` / `YOUR_FORMSPREE_ID`). Cada envío llega con el asunto
«Nueva consulta desde la web (ES/EN/NL/FR)» y el idioma de la página.

### 1b. Formulario de partners (sección «Partners», justo antes del pie)
Para profesionales que quieren colaborar: nombre, empresa o estudio, email, especialidad y un
mensaje opcional. Funciona igual que el de contacto (`data-contact-form`); llega con el asunto
«Nueva solicitud de partner (ES/EN/NL/FR)» y el campo `Tipo: Partner`. Usa el mismo endpoint
de Formspree (o uno propio si prefieres separarlos).

### 2. Guía gratuita — lead magnet ("Comprar en la Costa Brava 2026")
Hay un PDF por idioma (`assets/downloads/`): `guia-costa-brava-2026.pdf` (ES), `costa-brava-buying-guide-2026.pdf` (EN),
`costa-brava-koopgids-2026.pdf` (NL) y `guide-achat-costa-brava-2026.pdf` (FR). Se entregan a quien deja su email en
dos sitios: el bloque azul "Mantente informado" de la portada y el recuadro de la guía en el índice de la Revista.
Son formularios simples, sin JavaScript: al enviarlos, Formspree redirige a la página de agradecimiento del mismo
idioma, que muestra el botón de descarga (y, debajo, el paso al Informe Preliminar):

| Idioma | Página de agradecimiento |
|---|---|
| ES | `/es/gracias-guia/` |
| EN | `/en/thank-you-guide/` |
| NL | `/nl/bedankt-gids/` |
| FR | `/fr/merci-guide/` |

Esas páginas están marcadas `noindex` y fuera del sitemap. Para activarlo: crea un formulario en Formspree y
sustituye `TU_ID_FORMSPREE` / `YOUR_FORMSPREE_ID` en el bloque `.newsletter-form` de las 4 portadas y en el bloque
`.leadbox` de los 4 `blog/index.html`.

**Cambiar el contenido de la guía:** los textos de los 4 idiomas están en `_guides/build_guides.py` (diccionario `STR`) y
el diseño en `_guides/head.tpl`. Tras editar, `python3 _guides/build_guides.py` regenera los 4 PDF (necesita
`wkhtmltopdf` y las fuentes Cormorant Garamond / DM Sans (las del PDF de la guía) instaladas con los nombres de familia indicados en el script).
Esa carpeta empieza por `_`, así que Jekyll no la publica.

### Antes de lanzar
- Antes de recoger datos personales de verdad (nombre, email, teléfono) en producción, conviene
  validar la política de privacidad y el texto de consentimiento del formulario (ya enlaza a la
  política de cada idioma; el texto es orientativo, como indica el documento de textos).
- El endpoint de Formspree en el plan gratuito tiene un límite mensual de envíos; revisa el plan
  si esperas mucho volumen.


## Vista previa en local (opcional)

Si tienes Ruby instalado:

```bash
bundle install
bundle exec jekyll serve
```

Y abre `http://localhost:4000`. No es obligatorio: puedes desplegar directamente
en GitHub Pages y revisar los cambios ahí, como comentabas que harías.

## Pendiente antes de pasar a producción

- [ ] Cambiar `url:` en `_config.yml` por el dominio o URL final.
- [ ] Activar los dos formularios con Formspree (ver sección "Formularios" arriba).
- [ ] Sustituir el email `hello@findyourhaven.com` si el definitivo es otro
      (aparece en el pie de página y en las 4 páginas de inicio).
- [x] Imagen para compartir en redes (`assets/img/og-cover.jpg`, 1200×630): creada a partir de la foto del hero (terraza con piscina).
- [ ] Revisar los textos legales (política de privacidad, cookies) antes de recoger datos
      reales a través de los formularios.



## Añadir artículos nuevos

Lee **ARTICLES-GUIA.md**: explica el encabezado de cada artículo (incluido el bloque `translations` con las 4 versiones
y las 3 "lecturas relacionadas"), cómo enlazar entre artículos y a la home, y qué hace el sitio automáticamente
(migas de pan, datos estructurados, columna "Guías" del pie, sitemap). Hoy hay 96 artículos: 24 por idioma.

## Home (v6 — «Nova proposta» de textos + propuesta visual)

Secciones, en este orden: hero (titular, subtítulo, texto y dos llamadas) + tres argumentos
(un solo interlocutor · sin coste para ti · profesionales de confianza), Nuestro modelo (Tú → Find
Your Haven → Nuestros partners), Servicios (6, lista numerada con flecha a más información y foto
lateral), Cómo trabajamos (4 pasos con foto), Revista (pestañas por tema, 3 artículos por pestaña,
generadas solas desde `_articles/`; include `_includes/home-magazine.html`), guía gratuita, Contacto y Partners.
**No** hay sección de inmuebles destacados (así lo indica el documento de textos).
Los textos de cada idioma están en `{es,en,nl,fr}/index.html`.

### Fotografías de la portada (`assets/img/home/`)

| Archivo | Dónde sale |
|---|---|
| `nuestro-modelo.jpg` | Nuestro modelo (salón abierto al mar) |
| `servicios.jpg` | Servicios, foto lateral (casa de piedra entre olivos) |
| `paso-01.jpg` … `paso-04.jpg` | Cómo trabajamos (salón, comedor, dormitorio, baño) |
| `contacto.jpg` | Contacto, solo en escritorio (casa con buganvilla) |

Las fotos se recortan solas según el hueco. El punto de encuadre de las verticales se ajusta en
`main.css` con `object-position` (`.model-photo img`, `.svc-photo img`, `.contact-photo img`).
La imagen para compartir en redes (`assets/img/og-cover.jpg`) también sale de la foto del hero.

## Páginas legales

En los 4 idiomas, enlazadas desde el pie: **Aviso legal** (`/es/aviso-legal/`, `/en/legal-notice/`,
`/nl/juridische-informatie/`, `/fr/mentions-legales/`), **Política de privacidad** y **Política de
cookies** (`/{idioma}/cookies/`). La de cookies dice que ahora no se instala ninguna; si se añade
analítica (p. ej. Google Analytics), hay que poner un banner de consentimiento y completar la tabla.
En el aviso legal, los datos del titular que faltan salen marcados en terracota entre corchetes
(`<span class="todo">`): razón social, NIF, domicilio, datos registrales y, si procede, el colegio
profesional. Sustitúyelos por el texto real (y quita el `span`).

## Antes de publicar (lista de comprobación)

1. **Formspree:** crear el formulario en formspree.io y sustituir `TU_ID_FORMSPREE` / `YOUR_FORMSPREE_ID` por el ID real en los 4 `index.html` (formulario de contacto y guía) y los 4 `blog/index.html` (búsqueda global en el repo).
2. **Validar dos textos (lo pide el documento de textos):** la frase «Nuestro servicio de acompañamiento no tiene coste para ti» (y el argumento «Sin coste para ti» bajo el hero) debe describir bien el modelo comercial, y el texto legal del formulario debe revisarse antes de publicar.
3. **Datos legales:** completar los campos entre corchetes del aviso legal (4 idiomas). La política de privacidad (`/es/privacidad/`, `/en/privacy/`, `/nl/privacy/`, `/fr/confidentialite/`) identifica al responsable solo por nombre comercial y email. Si Find Your Haven opera como sociedad o autónoma, añadir razón social, NIF y domicilio (exigido por la LSSI) y revisarla con un asesor.
4. **Subir al repo `jmgrafic-web/fyhcatalonia`** y activar GitHub Pages (rama `main`, carpeta raíz).
5. Tras publicar: probar el formulario, la descarga de la guía, el cambio de idioma y validar los datos estructurados en search.google.com/test/rich-results; enviar `sitemap.xml` en Search Console.
