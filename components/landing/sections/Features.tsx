import * as React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { NUCLEUS_LINE } from '@/lib/nucleus-version';
import { TaoBackendStrip } from './TaoBackendStrip';
import { type Bi, type Lang, featuresT, pick } from '@/lib/landing-i18n';

interface FeatureItem {
  name: Bi<string>;
  desc: Bi<string>;
  icon: string;
  /** English docs path under /docs (locale prefix applied at render). */
  href: string;
  new?: boolean;
}

/** Lead with the 2.5 headlines, then the broader OS surface. */
const ITEMS: FeatureItem[] = [
  {
    name: { en: 'Spell check', fr: 'Correction orthographique' },
    desc: {
      en: 'The OS spell engine in Compose text fields — Hunspell, NSSpellChecker, Windows Spell Checking. Suggestions in the context menu.',
      fr: 'Le moteur de correction de l\'OS dans les champs Compose — Hunspell, NSSpellChecker, Windows Spell Checking. Suggestions dans le menu contextuel.',
    },
    icon: 'spellcheck',
    href: '/docs/os/spell-check',
    new: true,
  },
  {
    name: { en: 'Native context menus', fr: 'Menus contextuels natifs' },
    desc: {
      en: 'One flag swaps the Compose menu for the platform one — NSMenu, Fluent, Adwaita, Breeze, with shortcut labels.',
      fr: 'Un drapeau remplace le menu Compose par celui de la plateforme — NSMenu, Fluent, Adwaita, Breeze, avec libellés de raccourcis.',
    },
    icon: 'menu',
    href: '/docs/window/context-menu',
    new: true,
  },
  {
    name: { en: 'Overlay windows', fr: 'Fenêtres overlay' },
    desc: {
      en: 'Watermarks and desktop widgets — click-through, always-on-bottom, visible on every workspace.',
      fr: 'Watermarks et widgets de bureau — traversants, toujours en arrière-plan, visibles sur tous les bureaux.',
    },
    icon: 'window',
    href: '/docs/tao/overlay-windows',
    new: true,
  },
  {
    name: { en: 'NativeView', fr: 'NativeView' },
    desc: {
      en: 'Embed NSView, HWND, or GtkWidget inside Compose — now with Compose blended over it in the same scene.',
      fr: 'Intégrez un NSView, un HWND ou un GtkWidget dans Compose — désormais avec Compose fondu par-dessus dans la même scène.',
    },
    icon: 'native',
    href: '/docs/tao/native-views',
  },
  {
    name: { en: 'GPU render context', fr: 'Contexte de rendu GPU' },
    desc: {
      en: 'In-process GPU on the scene device — Skia DirectContext, Metal / ANGLE / EGL. No second GPU, no copy.',
      fr: 'GPU in-process sur le device de la scène — DirectContext Skia, Metal / ANGLE / EGL. Pas de second GPU, pas de copie.',
    },
    icon: 'texture',
    href: '/docs/tao/gpu-render-context',
  },
  {
    name: { en: 'TextureView', fr: 'TextureView' },
    desc: {
      en: 'External GPU textures in the Compose scene — D3D11, Metal, DMA-BUF. Real z-order, no CPU copy.',
      fr: 'Textures GPU externes dans la scène Compose — D3D11, Metal, DMA-BUF. Vrai ordre z, sans copie CPU.',
    },
    icon: 'texture',
    href: '/docs/tao/texture-view',
  },
  {
    name: { en: 'AwakeMode', fr: 'AwakeMode' },
    desc: {
      en: 'Keep the system awake for long jobs without forcing the screen on — one handle per feature, no stepping on each other.',
      fr: 'Gardez le système éveillé pour les jobs longs sans forcer l\'écran — un handle par fonctionnalité, sans interférence.',
    },
    icon: 'update',
    href: '/docs/lifecycle/energy-manager',
  },
  {
    name: { en: 'Differential updates', fr: 'Mises à jour différentielles' },
    desc: {
      en: 'Download only the blocks that changed — electron-builder block maps, HTTP ranges, silent fallback to full.',
      fr: 'Ne téléchargez que les blocs modifiés — block maps electron-builder, requêtes HTTP range, repli silencieux sur le téléchargement complet.',
    },
    icon: 'update',
    href: '/docs/packaging/auto-update',
  },
  {
    name: { en: 'Task Scheduler', fr: 'Task Scheduler' },
    desc: {
      en: 'WorkManager for desktop — periodic, cron, and on-boot tasks the OS runs even when the app is closed. launchd, Task Scheduler, systemd.',
      fr: 'Le WorkManager du desktop — tâches périodiques, cron et au boot que l\'OS lance même app fermée. launchd, Task Scheduler, systemd.',
    },
    icon: 'scheduler',
    href: '/docs/lifecycle/scheduler',
  },
  {
    name: { en: 'Decorated Window', fr: 'Fenêtre décorée' },
    desc: {
      en: 'Custom title bar, native controls, theme-aware. Tao backend by default.',
      fr: 'Barre de titre personnalisée, contrôles natifs, adaptée au thème. Backend Tao par défaut.',
    },
    icon: 'window',
    href: '/docs/tao/decorated-window',
  },
  {
    name: { en: 'Window Scaffold', fr: 'Scaffold de fenêtre' },
    desc: {
      en: 'Full-window layouts, glass regions, Mica/Acrylic, custom chrome primitives.',
      fr: 'Mises en page plein fenêtre, régions de verre, Mica/Acrylic, primitives de chrome.',
    },
    icon: 'window',
    href: '/docs/tao/window-scaffold',
  },
  {
    name: { en: 'Native Notifications', fr: 'Notifications natives' },
    desc: {
      en: 'macOS, Win Toast, freedesktop — one Kotlin API, plus per-platform DSL options.',
      fr: 'macOS, Toast Windows, freedesktop — une seule API Kotlin, plus options DSL par plateforme.',
    },
    icon: 'bell',
    href: '/docs/os/notifications',
  },
  {
    name: { en: 'System Tray', fr: 'Zone de notification' },
    desc: {
      en: 'Status icons with menus, badges, click handlers — across all three OSes.',
      fr: 'Icônes de statut avec menus, badges et clics — sur les trois systèmes.',
    },
    icon: 'tray',
    href: '/docs/os/system-tray',
  },
  {
    name: { en: 'Dock & Launcher', fr: 'Dock et launcher' },
    desc: {
      en: 'Badges, jump lists, dock menus, Unity launcher entries.',
      fr: 'Badges, jump lists, menus du dock, entrées du launcher Unity.',
    },
    icon: 'dock',
    href: '/docs/lifecycle',
  },
  {
    name: { en: 'Dark Mode Detector', fr: 'Détecteur de mode sombre' },
    desc: {
      en: 'Reactive OS theme — bridges Compose isSystemInDarkTheme under nucleusApplication.',
      fr: 'Thème système réactif — relie isSystemInDarkTheme de Compose sous nucleusApplication.',
    },
    icon: 'theme',
    href: '/docs/os/dark-mode',
  },
  {
    name: { en: 'Global Hotkey', fr: 'Raccourci global' },
    desc: {
      en: 'OS-level shortcuts, multi-modifier, work app-wide — stable portal ids on Wayland.',
      fr: 'Raccourcis au niveau OS, multi-modificateurs, valables dans toute l\'app — ids portail stables sous Wayland.',
    },
    icon: 'key',
    href: '/docs/os/global-hotkey',
  },
  {
    name: { en: 'Taskbar Progress', fr: 'Progression barre des tâches' },
    desc: {
      en: 'Progress bars on Windows taskbar, macOS dock, Unity launcher.',
      fr: 'Barres de progression sur la barre des tâches Windows, le dock macOS et le launcher Unity.',
    },
    icon: 'progress',
    href: '/docs/lifecycle/taskbar-progress',
  },
  {
    name: { en: 'Deep Links', fr: 'Liens profonds' },
    desc: {
      en: 'Protocol handlers + file associations on all platforms.',
      fr: 'Gestionnaires de protocole et associations de fichiers sur toutes les plateformes.',
    },
    icon: 'link',
    href: '/docs/lifecycle/deep-links',
  },
  {
    name: { en: 'Native HTTP / SSL', fr: 'HTTP / SSL natifs' },
    desc: {
      en: 'OS trust store merged into JDK defaults.',
      fr: 'Magasin de confiance de l\'OS fusionné aux valeurs par défaut du JDK.',
    },
    icon: 'shield',
    href: '/docs/performance/native-ssl',
  },
  {
    name: { en: 'Native Access', fr: 'Native Access' },
    desc: {
      en: 'Write Kotlin/Native and call from JVM. No C, no glue.',
      fr: 'Écrivez en Kotlin/Native et appelez depuis la JVM. Sans C, sans glue.',
    },
    icon: 'chip',
    href: '/docs/performance/native-code',
  },
];

function FeatIcon({ name }: { name: string }) {
  const c = 'currentColor';
  const sw = 1.4;
  switch (name) {
    case 'window': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth={sw}/><path d="M3 9h18" stroke={c} strokeWidth={sw}/><circle cx="6" cy="7" r="0.6" fill={c}/><circle cx="8" cy="7" r="0.6" fill={c}/><circle cx="10" cy="7" r="0.6" fill={c}/></svg>;
    case 'texture': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth={sw}/><path d="M3 15l5-4 4 3 4-5 5 6" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><circle cx="9" cy="9" r="1.2" fill={c}/></svg>;
    case 'native': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="10" height="8" rx="1.5" stroke={c} strokeWidth={sw}/><rect x="11" y="12" width="10" height="8" rx="1.5" stroke={c} strokeWidth={sw}/><path d="M8 12v2M16 12V9" stroke={c} strokeWidth={sw} strokeLinecap="round" opacity="0.6"/></svg>;
    case 'bell': return <svg viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0v3l1.5 3h-15L6 12V9z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M10 18a2 2 0 004 0" stroke={c} strokeWidth={sw}/></svg>;
    case 'tray': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="16" width="18" height="4" rx="1" stroke={c} strokeWidth={sw}/><circle cx="7" cy="18" r="0.8" fill={c}/><circle cx="10" cy="18" r="0.8" fill={c}/><circle cx="13" cy="18" r="0.8" fill={c}/><path d="M9 12l3 3 3-3M12 4v11" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'dock': return <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="14" width="20" height="6" rx="2" stroke={c} strokeWidth={sw}/><circle cx="7" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><circle cx="12" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><circle cx="17" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><path d="M12 4v6" stroke={c} strokeWidth={sw} strokeLinecap="round"/><circle cx="17" cy="6" r="2" fill={c}/></svg>;
    case 'theme': return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={c} strokeWidth={sw}/><path d="M12 4a8 8 0 000 16V4z" fill={c}/></svg>;
    case 'key': return <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke={c} strokeWidth={sw}/><path d="M6 10v0M10 10v0M14 10v0M18 10v0M6 14h12" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'progress': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="4" rx="2" stroke={c} strokeWidth={sw}/><path d="M5 12h9" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>;
    case 'update': return <svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12h3l2 3 3-6 2 3h2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/></svg>;
    case 'scheduler': return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={c} strokeWidth={sw}/><path d="M12 8v4l3 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4l2 2M19 4l-2 2" stroke={c} strokeWidth={sw} strokeLinecap="round" opacity="0.55"/></svg>;
    case 'link': return <svg viewBox="0 0 24 24" fill="none"><path d="M10 14l4-4M9 7l1-1a4 4 0 015.7 5.7l-1 1M15 17l-1 1a4 4 0 01-5.7-5.7l1-1" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'shield': return <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chip': return <svg viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke={c} strokeWidth={sw}/><rect x="9" y="9" width="6" height="6" stroke={c} strokeWidth={sw}/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'spellcheck': return <svg viewBox="0 0 24 24" fill="none"><path d="M4 14L7.5 6l3.5 8M5.2 11.4h4.6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9.5l2.5 2.5L21 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M3 18.5c1-1.2 2-1.2 3 0s2 1.2 3 0 2-1.2 3 0 2 1.2 3 0 2-1.2 3 0" stroke={c} strokeWidth={sw} strokeLinecap="round" opacity="0.65"/></svg>;
    case 'menu': return <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" stroke={c} strokeWidth={sw}/><path d="M7.5 9h9M7.5 12h9M7.5 15h5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    default: return null;
  }
}

interface FeaturesProps {
  lang: Lang;
}

export function Features({ lang }: FeaturesProps) {
  const base = lang === 'fr' ? '/fr' : '/en';
  return (
    <section className="features" id="features">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(featuresT.eyebrow, lang)}
          title={pick(featuresT.title, lang)}
          subtitle={pick(featuresT.subtitle, lang)}
        />
        <div className="feat-grid">
          {ITEMS.map((f) => (
            <Link
              key={f.href}
              href={`${base}${f.href}`}
              className="feat-card"
            >
              {f.new && (
                <span className="feat-new">
                  {pick(featuresT.newIn, lang).replace('{line}', NUCLEUS_LINE)}
                </span>
              )}
              <div className="feat-icon"><FeatIcon name={f.icon} /></div>
              <div className="feat-name">{pick(f.name, lang)}</div>
              <div className="feat-desc">{pick(f.desc, lang)}</div>
            </Link>
          ))}
        </div>

        <div className="feat-cta">
          <Link href={`${base}/docs/changelog`} className="btn btn-ghost">
            {pick(featuresT.cta, lang)}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <TaoBackendStrip lang={lang} />
      </div>
    </section>
  );
}
