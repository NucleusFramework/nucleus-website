# Nucleus website

The marketing site and documentation for [Nucleus](https://github.com/NucleusFramework/Nucleus) — the Kotlin framework for cross-platform native desktop apps.

Built with **Next.js 15** (App Router), **Fumadocs UI**, **MDX**, **TypeScript**, **React 19**. Bilingual (EN / FR).

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # SSG: 173 pages
npm start          # serve production build
```

## Layout

```
app/
  [lang]/
    (landing)/     # marketing site
    docs/          # Fumadocs docs
content/docs/      # MDX content (EN + FR)
components/
  landing/         # landing page sections
lib/
  source.ts        # Fumadocs source loader
  i18n.ts          # EN/FR config
  site.ts          # site-wide metadata
styles/            # landing CSS
```

## Adding a page

Drop a `.mdx` file under `content/docs/<section>/`. Add its slug to the matching `meta.json`. Provide a French translation as `name.fr.mdx`.

## SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- OpenGraph image: dynamic via `/opengraph-image`
- JSON-LD: `SoftwareApplication` schema in root layout
- llms.txt: `/llms.txt` and `/llms-full.txt`
