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
    docs/          # Fumadocs docs (latest + /2.0 + /2.1 + …)
content/docs/      # MDX content for latest (EN + FR)
content/versioned/ # Frozen archives per minor line (2.0, 2.1, …)
components/
  landing/         # landing page sections
  docs/            # version switcher, shared docs layout
lib/
  source.ts        # DOC_VERSIONS + Fumadocs loaders
  i18n.ts          # EN/FR config
  site.ts          # site-wide metadata
scripts/
  snapshot-docs.mjs    # freeze latest → content/versioned/<X.Y>
  fetch-versions.mjs   # lib/versions.json for snippet injection
styles/            # landing CSS
```

## Adding a page

Drop a `.mdx` file under `content/docs/<section>/`. Add its slug to the matching `meta.json`. Provide a French translation as `name.fr.mdx`.

## Versioning the docs (2.0 / 2.1 / 2.2 / …)

When Nucleus ships a **new minor or major** and you rewrite the live docs, **archive the previous line first**, then relabel latest.

Full procedure (happy path, late recovery from git, checklist):

→ **[`.docs-versioning.md`](.docs-versioning.md)**

Short form when `content/docs/` is still the line to freeze:

```bash
npm run snapshot-docs 2.2          # copies content/docs → content/versioned/2.2 + scaffolds routes
# then wire source.config.ts + lib/source.ts (script prints the exact lines)
# bump latest label to "2.4 (latest)", write new docs under content/docs/
```

Do **not** snapshot for patch releases (2.1.9 → 2.1.10): keep editing latest.

## SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- OpenGraph image: dynamic via `/opengraph-image`
- JSON-LD: `SoftwareApplication` schema in root layout
- llms.txt: `/llms.txt` and `/llms-full.txt`

## License

MIT — see [`LICENSE`](LICENSE).

