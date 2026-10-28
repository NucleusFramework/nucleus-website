import type { Metadata } from 'next';
import { i18n } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/landing-i18n';
import { SITE } from '@/lib/site';

// Privacy policy of the Nucleus Lab app, the URL its Microsoft Store listing points to.

export const metadata: Metadata = {
  title: 'Nucleus Lab privacy policy',
  description: 'What the Nucleus Lab app accesses on your device, and what it never collects or sends.',
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

interface PageProps {
  params: Promise<{ lang: string }>;
}

const UPDATED = '2026-10-28';

const content: Record<Lang, { title: string; updated: string; sections: { heading: string; body: string[] }[] }> = {
  en: {
    title: 'Nucleus Lab privacy policy',
    updated: `Last updated: ${UPDATED}`,
    sections: [
      {
        heading: 'What Nucleus Lab is',
        body: [
          'Nucleus Lab is the test bench of the Nucleus framework: each screen ("probe") checks one operating system feature on your machine. It is published by the Nucleus project, an open-source project.',
        ],
      },
      {
        heading: 'What we collect',
        body: [
          'Nothing. Nucleus Lab has no account, no analytics, no telemetry and no crash reporting. We do not collect, store or receive any personal information, and we do not sell or share any.',
        ],
      },
      {
        heading: 'What the app accesses on your device',
        body: [
          'Some probes read device features, only when you open that probe and ask for it: your location (after the operating system asks for your permission), the clipboard, screenshots of your screen or of the Lab’s own windows, system information (processor, memory, displays, network adapters), files you pick, and the result of a system authentication prompt (the app never sees your fingerprint, face or password).',
          'This data is shown on screen and stays on your device. Results you choose to keep (check marks, notes, window layout) are saved in the app’s local data folder, and are removed when you uninstall the app.',
        ],
      },
      {
        heading: 'Network access',
        body: [
          'The app only connects to the internet when a probe you run needs it: for example to test secure connections against public test sites, to check for app updates, or to load an example web page. These requests send no personal information.',
        ],
      },
      {
        heading: 'Purchases',
        body: [
          'Purchases, trials and licenses are handled entirely by the Microsoft Store. The app only receives whether a product is owned; payment details are never visible to it. The Microsoft Privacy Statement applies to those transactions: https://privacy.microsoft.com/privacystatement',
        ],
      },
      {
        heading: 'Contact',
        body: [`Questions about this policy: open an issue at ${SITE.github}/issues`],
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité de Nucleus Lab',
    updated: `Dernière mise à jour : ${UPDATED}`,
    sections: [
      {
        heading: 'Ce qu’est Nucleus Lab',
        body: [
          'Nucleus Lab est le banc de test du framework Nucleus : chaque écran (« probe ») vérifie une fonctionnalité du système d’exploitation sur votre machine. Il est publié par le projet Nucleus, un projet open source.',
        ],
      },
      {
        heading: 'Ce que nous collectons',
        body: [
          'Rien. Nucleus Lab n’a ni compte, ni statistiques d’usage, ni télémétrie, ni rapport de plantage. Nous ne collectons, ne stockons et ne recevons aucune donnée personnelle, et nous n’en vendons ni n’en partageons aucune.',
        ],
      },
      {
        heading: 'Ce que l’application lit sur votre appareil',
        body: [
          'Certains probes lisent des fonctionnalités de l’appareil, uniquement quand vous ouvrez ce probe et le demandez : votre position (après l’autorisation demandée par le système), le presse-papiers, des captures de votre écran ou des fenêtres du Lab, des informations système (processeur, mémoire, écrans, cartes réseau), les fichiers que vous choisissez, et le résultat d’une demande d’authentification système (l’application ne voit jamais votre empreinte, votre visage ni votre mot de passe).',
          'Ces données sont affichées à l’écran et restent sur votre appareil. Ce que vous choisissez de garder (vérifications, notes, disposition des fenêtres) est enregistré dans le dossier de données local de l’application, et supprimé à sa désinstallation.',
        ],
      },
      {
        heading: 'Accès au réseau',
        body: [
          'L’application ne se connecte à internet que lorsqu’un probe que vous lancez en a besoin : par exemple pour tester des connexions sécurisées sur des sites de test publics, vérifier les mises à jour ou charger une page web d’exemple. Ces requêtes n’envoient aucune donnée personnelle.',
        ],
      },
      {
        heading: 'Achats',
        body: [
          'Les achats, essais et licences sont entièrement gérés par le Microsoft Store. L’application reçoit seulement l’information qu’un produit est possédé ; elle ne voit jamais les moyens de paiement. La déclaration de confidentialité de Microsoft s’applique à ces transactions : https://privacy.microsoft.com/privacystatement',
        ],
      },
      {
        heading: 'Contact',
        body: [`Pour toute question sur cette politique : ouvrez une issue sur ${SITE.github}/issues`],
      },
    ],
  },
};

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const page = content[isLang(lang) ? lang : 'en'];
  return (
    <main className="prose" style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
      <h1>{page.title}</h1>
      <p>
        <em>{page.updated}</em>
      </p>
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
