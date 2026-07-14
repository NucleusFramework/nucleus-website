import { fetchLatestRelease } from '@/lib/site';

// Nucleus and the modules released from their own repos, each versioned independently.
const MODULES = [
  { name: 'Nucleus', repo: 'Nucleus', coordinate: 'dev.nucleusframework (Gradle plugin)' },
  { name: 'System tray', repo: 'ComposeNativeTray', coordinate: 'dev.nucleusframework:composenativetray' },
  { name: 'PDF reader', repo: 'ComposePdfReader', coordinate: 'dev.nucleusframework:pdfium' },
  { name: 'Native access', repo: 'NucleusNativeAccess', coordinate: 'dev.nucleusframework.nna (Gradle plugin)' },
] as const;

const LABELS = {
  en: { module: 'Module', version: 'Latest version', coordinate: 'Coordinate', repo: 'Repository' },
  fr: { module: 'Module', version: 'Dernière version', coordinate: 'Coordonnée', repo: 'Dépôt' },
} as const;

// Async server component: version numbers are fetched live from each repo's latest GitHub release
// (revalidated hourly, same pattern as fetchGitHubStars). Falls back to "latest" if a fetch fails.
export async function Versions({ lang = 'en' }: { lang?: string }) {
  const versions = await Promise.all(MODULES.map((m) => fetchLatestRelease(m.repo)));
  const t = LABELS[lang === 'fr' ? 'fr' : 'en'];
  return (
    <table>
      <thead>
        <tr>
          <th>{t.module}</th>
          <th>{t.version}</th>
          <th>{t.coordinate}</th>
          <th>{t.repo}</th>
        </tr>
      </thead>
      <tbody>
        {MODULES.map((m, i) => (
          <tr key={m.repo}>
            <td>{m.name}</td>
            <td>{versions[i] ?? 'latest'}</td>
            <td><code>{m.coordinate}</code></td>
            <td>
              <a href={`https://github.com/NucleusFramework/${m.repo}`} target="_blank" rel="noreferrer">
                {m.repo}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
