#!/usr/bin/env node
// Regenerates public/llms.txt and public/llms-full.txt from content/docs/**/*.mdx (English only),
// following the sidebar order defined by each directory's meta.json.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'content/docs');
const SITE_URL = 'https://nucleusframework.dev';

function readMeta(dir) {
  const p = path.join(dir, 'meta.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[kv[1]] = val;
  }
  return { data, body: raw.slice(m[0].length) };
}

// Strip MDX-only wrapper components (Callout, Tabs, Tab) and fumadocs-ui imports,
// but never touch the inside of fenced code blocks (Kotlin generics like List<String>
// would otherwise look like JSX tags).
function cleanBody(body) {
  const segments = body.split(/(```[\s\S]*?```)/g);
  return segments
    .map((seg) => {
      if (seg.startsWith('```')) return seg;
      let text = seg;
      text = text.replace(/^import\s+\{[^}]*\}\s+from\s+['"]fumadocs-ui[^'"]*['"];?\s*$/gm, '');
      text = text.replace(/<Callout[^>]*>\n?/g, '').replace(/<\/Callout>\n?/g, '');
      text = text.replace(/<Version[^>]*\/>\n?/g, '');
      text = text.replace(/<Tabs[^>]*>\n?/g, '').replace(/<\/Tabs>\n?/g, '');
      text = text.replace(/<Tab\s+value=["']([^"']+)["']>\n?/g, '\n**$1**\n\n');
      text = text.replace(/<\/Tab>\n?/g, '');
      text = text.replace(/\n{3,}/g, '\n\n');
      return text;
    })
    .join('')
    .trim();
}

// Recursively resolves a directory's meta.json page order into an ordered tree of
// { file, slug, data, body } leaves and { section, title, description, children } nodes.
function resolveSection(dir, slugPrefix) {
  const meta = readMeta(dir);
  const pages =
    meta?.pages ??
    fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mdx') && !f.endsWith('.fr.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .sort();

  const nodes = [];
  for (const name of pages) {
    const filePath = path.join(dir, `${name}.mdx`);
    const subDir = path.join(dir, name);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, body } = parseFrontmatter(raw);
      const slug = name === 'index' ? slugPrefix : [...slugPrefix, name];
      nodes.push({ type: 'page', slug, data, body: cleanBody(body) });
    } else if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
      const subMeta = readMeta(subDir);
      nodes.push({
        type: 'section',
        title: subMeta?.title ?? name,
        description: subMeta?.description ?? '',
        children: resolveSection(subDir, [...slugPrefix, name]),
      });
    }
  }
  return nodes;
}

function urlFor(slug) {
  return slug.length === 0 ? `${SITE_URL}/docs` : `${SITE_URL}/docs/${slug.join('/')}`;
}

function flattenPages(nodes, out = []) {
  for (const node of nodes) {
    if (node.type === 'page') out.push(node);
    else flattenPages(node.children, out);
  }
  return out;
}

const tree = resolveSection(DOCS_DIR, []);
const allPages = flattenPages(tree);

// ---------------------------------------------------------------------------
// llms.txt — concise index per the llms.txt convention (llmstxt.org)
// ---------------------------------------------------------------------------
function renderIndexNodes(nodes, depth) {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'page') {
      const title = node.data.title ?? node.slug.join('/');
      const desc = node.data.description ? `: ${node.data.description}` : '';
      out += `${'  '.repeat(Math.max(depth - 1, 0))}- [${title}](${urlFor(node.slug)})${desc}\n`;
    } else {
      out += `\n${'#'.repeat(Math.min(depth + 2, 4))} ${node.title}\n\n`;
      out += renderIndexNodes(node.children, depth + 1);
    }
  }
  return out;
}

const rootIndexPage = allPages.find((p) => p.slug.length === 0);

const llmsTxt = `# Nucleus

> Nucleus is a Kotlin framework for building native cross-platform desktop apps on top of Compose Multiplatform. It combines a Gradle plugin, runtime libraries, and GitHub Actions to handle OS integration (30+ runtime modules), packaging (18 distribution formats), performance (GraalVM Native Image and JVM AOT cache), and native window decorations (Tao backend).

- Docs: ${SITE_URL}/docs
- GitHub: https://github.com/NucleusFramework/Nucleus
- Gradle Plugin Portal: https://plugins.gradle.org/plugin/dev.nucleusframework
- Maven Central: https://central.sonatype.com/search?q=dev.nucleusframework
- License: Apache 2.0 / MIT

## Documentation
${renderIndexNodes(tree, 1)}
## Full documentation

- [llms-full.txt](${SITE_URL}/llms-full.txt): the complete documentation in a single file
`;

// ---------------------------------------------------------------------------
// llms-full.txt — every page's full content, in sidebar order
// ---------------------------------------------------------------------------
const fullParts = [
  `# Nucleus — full documentation\n\n> ${rootIndexPage?.data.description ?? ''}\n\nSource: ${SITE_URL}/docs\n`,
];

for (const page of allPages) {
  const title = page.data.title ?? page.slug.join('/');
  fullParts.push(
    `\n---\n\n# ${title}\n\nURL: ${urlFor(page.slug)}\n${page.data.description ? `\n${page.data.description}\n` : ''}\n${page.body}\n`,
  );
}

const llmsFullTxt = fullParts.join('') + '\n';

fs.writeFileSync(path.join(ROOT, 'public/llms.txt'), llmsTxt);
fs.writeFileSync(path.join(ROOT, 'public/llms-full.txt'), llmsFullTxt);

console.log(`Wrote public/llms.txt (${allPages.length} pages indexed)`);
console.log(`Wrote public/llms-full.txt (${llmsFullTxt.length} bytes)`);
