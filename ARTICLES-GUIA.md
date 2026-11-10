# Cómo añadir un artículo nuevo a la Revista FYH

La revista tiene **24 artículos en cada uno de los 4 idiomas (96 en total)**, organizados en 5 temas (una página por tema e idioma), con bloque «Empieza por aquí» y buscador.
Para publicar uno nuevo basta con crear su archivo: la home, el índice de la revista, la paginación, el buscador, el
pie de página y las "lecturas relacionadas" se actualizan solos cuando GitHub Pages reconstruye el sitio.

> Lo normal es que me pidas el artículo y yo te devuelva los archivos ya listos (los 4 idiomas, con enlaces y
> encabezado correctos). Esta guía es para quien quiera hacerlo a mano.

## 1. Un archivo por idioma dentro de `_articles/`

Nombre: `{idioma}-{slug}.md`, por ejemplo `es-notaria-espana-dia-de-la-firma.md` y `en-spanish-notary-completion-day.md`.
Un artículo = 4 archivos (es, en, nl, fr), cada uno con su propia URL en su idioma.

## 2. Encabezado (front matter)

```yaml
---
layout: article
lang: es                          # es | en | nl | fr
topic: Proceso de compra          # categoría corta (etiqueta; también agrupa "lecturas relacionadas")
title: "Título del artículo (el H1 de la página)"
seo_title: "Título para Google, máx. ~60 caracteres"
description: "Meta-descripción: 120-160 caracteres, con la palabra clave y una razón para hacer clic."
date: 2026-06-01
permalink: /es/blog/mi-articulo/  # siempre /{idioma}/blog/{slug}/
translations:                     # TODAS las versiones, INCLUIDA la propia (obligatorio para el hreflang)
  es: /es/blog/mi-articulo/
  en: /en/blog/my-article/
  nl: /nl/blog/mijn-artikel/
  fr: /fr/blog/mon-article/
related:                          # 3 artículos del MISMO idioma, a mano (si no, se eligen solos por tema)
  - /es/blog/otro-articulo/
  - /es/blog/otro-mas/
  - /es/blog/y-otro/
image: "https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1800&q=75"
cta_body: "Frase de cierre invitando a contactar."
# pillar: true / pillar_order: 6 / footer_label: "Texto corto"   <- solo si debe salir en el pie de página (columna "Guías")
---
```

Puntos que importan para el SEO:

- **`translations`**: cada versión debe listar las cuatro (incluida ella misma) y las cuatro deben coincidir. Así Google
  sirve a cada visitante su idioma y no lo trata como contenido duplicado. También hace que el selector de idioma de la
  cabecera lleve a *este mismo artículo* en el otro idioma.
- **`seo_title` y `description`**: lo que se ve en Google. Si no pones `seo_title` se usa `title`.
- **`related`**: las tres tarjetas "Sigue leyendo" del final. Elígelas por afinidad real (mismo problema, siguiente paso).
- **`image`**: foto libre de Unsplash o Pexels (URL de la imagen, con `?auto=format&fit=crop&w=1800&q=75`).

## 3. Contenido en Markdown (debajo del `---` final)

Títulos con `##`, listas con `-`, negrita con `**así**`. No hace falta HTML ni CSS.

**Enlaces internos** — pon entre 2 y 4 por artículo, con texto descriptivo (no "pincha aquí"):

```
[la guía de due diligence]({{ site.baseurl }}/es/blog/due-diligence-tecnica-inmobiliaria/)   ← a otro artículo
[nuestros servicios]({{ site.baseurl }}/es/#servicios)                                          ← a una parte de la home
```

Anclas de la home por idioma: ES `#quienes-somos #servicios #proceso #territorio #contacto` · EN `#about #services
#process #areas #contact` · NL `#over-ons #diensten #proces #gebieden #contact` · FR `#qui-sommes-nous #services
#processus #territoire #contact`. El prefijo `{{ site.baseurl }}` es obligatorio mientras la web viva en una subcarpeta
(y sigue funcionando si algún día pasa a la raíz de un dominio).

## 4. Publicar

```bash
git add _articles/ && git commit -m "Nuevo artículo: ..." && git push
```

GitHub Pages reconstruye en 30 segundos – 2 minutos. El artículo aparece solo en el índice de su idioma, en el
sitemap, en el buscador y en la paginación.

## Qué hace el sitio por su cuenta (no hay que tocarlo)

- **Lecturas relacionadas** al final de cada artículo (las de `related`, y si faltan, las del mismo `topic`).
- **Migas de pan** (Inicio / Revista) y datos estructurados `Article` y `BreadcrumbList` para Google.
- **Columna "Guías"** en el pie de página con los artículos marcados `pillar: true` (hoy 5 por idioma).
- **Portada → artículos**: las tarjetas de territorio y de servicios de la home enlazan a los artículos correspondientes.
- **Sitemap automático**; las páginas de agradecimiento y la 404 van marcadas `noindex`.

## Paginación y buscador

Todos los artículos de un idioma se renderizan en una lista y `assets/js/journal.js` los reparte en bloques de 6 (hoy 3
páginas). El buscador filtra por título, descripción y tema (sin tildes ni mayúsculas). Para cambiar los 6 por página:
`data-per-page="6"` en `{idioma}/blog/index.html`.

## Ideas de temas pendientes

Cubiertos: guía de compra, due diligence, masías del Empordà, Sitges vs Costa Brava, coste de reforma, impuestos,
hipotecas, Golden Visa, alquiler vacacional, vivir todo el año, Cadaqués/Begur/Llafranc, rentabilidad, errores sin
abogado, guía de Sitges, masía vs obra nueva, **la notaría y el día de la firma, el Maresme, la Costa Daurada**.

Para seguir: arquitectura mediterránea y qué buscar en una casa de los años 60-70 · interiorismo mediterráneo (materiales
y colores) · comprar en subasta o a un banco: riesgos · comunidad de propietarios: qué pedir antes de comprar un piso ·
Costa Brava vs Algarve vs Toscana · primeros testimonios reales de clientes.


## Campos nuevos: `category` y `start_here`

Cada artículo debe llevar **`category`** (una de: `comprar`, `zonas`, `reformar`, `dinero`, `vivir`). Con él aparece en la página de su tema (`/es/blog/tema/...`), en las migas de pan y en el JSON-LD. 
Para destacar un artículo en el bloque «Empieza por aquí» de la revista añade `start_here: true` (hoy: guía de compra, NIE y due diligence).

Los nombres, URLs y textos de los 5 temas están en `_data/topics.yml` (por idioma). Las páginas de tema son `{idioma}/blog/{tema|topic|onderwerp|theme}/{slug}/index.html` y usan el layout `topic-hub`.
