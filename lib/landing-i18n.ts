import * as React from 'react';
import { NUCLEUS_VTAG } from './nucleus-version';

export type Lang = 'en' | 'fr';

export interface Bi<T = React.ReactNode> {
  en: T;
  fr: T;
}

export function pick<T>(entry: Bi<T>, lang: Lang): T {
  return entry[lang] ?? entry.en;
}

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'fr';
}

// =====================================================================
// TopNav
// =====================================================================
export const navT = {
  docs: { en: 'Docs', fr: 'Docs' } as Bi<string>,
  toolkits: { en: 'Toolkits', fr: 'Toolkits' } as Bi<string>,
  nativeApis: { en: 'Native APIs', fr: 'APIs natives' } as Bi<string>,
  download: { en: 'Download', fr: 'Télécharger' } as Bi<string>,
  changelog: { en: 'Changelog', fr: 'Changelog' } as Bi<string>,
  getStarted: { en: 'Get started', fr: 'Démarrer' } as Bi<string>,
  switchEn: { en: 'EN', fr: 'EN' } as Bi<string>,
  switchFr: { en: 'FR', fr: 'FR' } as Bi<string>,
};

// =====================================================================
// Hero
// =====================================================================
export const heroT = {
  eyebrow: {
    en: 'Compose Desktop, production-ready',
    fr: 'Compose Desktop, prêt pour la prod',
  } as Bi<string>,
  h1: {
    en: React.createElement(React.Fragment, null,
      'Ship desktop with the ',
      React.createElement('span', { className: 'hero-grad' }, 'Kotlin team'),
      ' you already have.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Shippe le desktop avec l\'équipe ',
      React.createElement('span', { className: 'hero-grad' }, 'Kotlin'),
      ' que tu as déjà.',
    ),
  } as Bi,
  sub: {
    en: React.createElement(React.Fragment, null,
      'Compose Multiplatform draws the UI. Nucleus makes it a real desktop app — native chrome, OS APIs, packaging, and stores. Same Kotlin codebase as your ',
      React.createElement('span', { className: 'hero-sub-em' }, 'Android'), ', ',
      React.createElement('span', { className: 'hero-sub-em' }, 'iOS'), ' and ',
      React.createElement('span', { className: 'hero-sub-em' }, 'web'),
      ' apps. ',
      React.createElement('span', { className: 'hero-sub-dim' }, 'No second stack. No JNI circus.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Compose Multiplatform dessine l\'UI. Nucleus en fait une vraie app desktop — chrome natif, APIs OS, packaging et stores. La même base Kotlin que tes apps ',
      React.createElement('span', { className: 'hero-sub-em' }, 'Android'), ', ',
      React.createElement('span', { className: 'hero-sub-em' }, 'iOS'), ' et ',
      React.createElement('span', { className: 'hero-sub-em' }, 'web'),
      '. ',
      React.createElement('span', { className: 'hero-sub-dim' }, 'Pas de seconde stack. Pas de JNI circus.'),
    ),
  } as Bi,
  ctaPrimary: { en: 'Get started', fr: 'Démarrer' } as Bi<string>,
  ctaSecondary: { en: 'Migrate from Compose Desktop', fr: 'Migrer depuis Compose Desktop' } as Bi<string>,
  stars: { en: 'stars', fr: 'étoiles' } as Bi<string>,
  coldStart: { en: 'Cold start', fr: 'Démarrage à froid' } as Bi<string>,
  ram: { en: 'RAM', fr: 'RAM' } as Bi<string>,
  modules: { en: 'Modules', fr: 'Modules' } as Bi<string>,
  formats: { en: 'Formats', fr: 'Formats' } as Bi<string>,
};

// =====================================================================
// Pitch
// =====================================================================
export const pitchT = {
  title: {
    en: React.createElement(React.Fragment, null,
      'Everywhere else, Kotlin owns the whole platform.', React.createElement('br'),
      React.createElement('span', { className: 'hero-grad' }, 'Now desktop does too.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Partout ailleurs, Kotlin règne sur toute la plateforme.', React.createElement('br'),
      React.createElement('span', { className: 'hero-grad' }, 'Le desktop aussi, maintenant.'),
    ),
  } as Bi,
  sub: {
    en: React.createElement(React.Fragment, null,
      'On ', React.createElement('span', { className: 'pitch-em' }, 'Android'),
      ', Kotlin and Compose are first-class. On ',
      React.createElement('span', { className: 'pitch-em' }, 'iOS'),
      ' and the ',
      React.createElement('span', { className: 'pitch-em' }, 'web'),
      ', the same story. Desktop had Compose for the UI — and left you to invent the rest: native chrome, OS APIs, signing, auto-update, stores. Vanilla Compose Desktop stops at the window. ',
      React.createElement('span', { className: 'pitch-em' }, 'Nucleus is the production layer your Kotlin team was missing.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Sur ', React.createElement('span', { className: 'pitch-em' }, 'Android'),
      ', Kotlin et Compose sont citoyens de première classe. Sur ',
      React.createElement('span', { className: 'pitch-em' }, 'iOS'),
      ' et le ',
      React.createElement('span', { className: 'pitch-em' }, 'web'),
      ', même histoire. Le desktop avait Compose pour l\'UI — et te laissait inventer le reste : chrome natif, APIs OS, signature, auto-update, stores. Compose Desktop vanilla s\'arrête à la fenêtre. ',
      React.createElement('span', { className: 'pitch-em' }, 'Nucleus est la couche de production qui manquait à ton équipe Kotlin.'),
    ),
  } as Bi,
};

// =====================================================================
// KMP Platform Row
// =====================================================================
export const kmpT = {
  os_apis: { en: 'OS APIs', fr: 'APIs OS' } as Bi<string>,
  browser_apis: { en: 'Browser APIs', fr: 'APIs navigateur' } as Bi<string>,
  native_ui: { en: 'Native UI', fr: 'UI native' } as Bi<string>,
  input: { en: 'Input', fr: 'Entrées' } as Bi<string>,
  optimize: { en: 'Optimize', fr: 'Optimisation' } as Bi<string>,
  package: { en: 'Package', fr: 'Empaquetage' } as Bi<string>,
  distribute: { en: 'Distribute', fr: 'Distribution' } as Bi<string>,
  via: { en: 'via Nucleus', fr: 'via Nucleus' } as Bi<string>,

  // Android
  androidApis: { en: 'Native, built-in', fr: 'Natives, intégrées' } as Bi<string>,
  androidUi: { en: 'Material 3 widgets', fr: 'Widgets Material 3' } as Bi<string>,
  androidInput: { en: 'Touch · gestures', fr: 'Tactile · gestes' } as Bi<string>,
  androidOpt: { en: 'R8 · ProGuard · AAB shrink', fr: 'R8 · ProGuard · réduction AAB' } as Bi<string>,
  androidPkg: { en: '.aab via Gradle', fr: '.aab via Gradle' } as Bi<string>,
  androidDist: { en: 'Google Play, in two clicks', fr: 'Google Play, en deux clics' } as Bi<string>,

  // iOS
  iosApis: { en: 'Kotlin/Native ↔ UIKit', fr: 'Kotlin/Native ↔ UIKit' } as Bi<string>,
  iosUi: { en: 'SwiftUI interop', fr: 'Interop SwiftUI' } as Bi<string>,
  iosInput: { en: 'Touch · Apple Pencil', fr: 'Tactile · Apple Pencil' } as Bi<string>,
  iosOpt: { en: 'LLVM AOT · App Thinning', fr: 'LLVM AOT · App Thinning' } as Bi<string>,
  iosPkg: { en: '.ipa via Xcode', fr: '.ipa via Xcode' } as Bi<string>,
  iosDist: { en: 'App Store Connect', fr: 'App Store Connect' } as Bi<string>,

  // Web
  webApis: { en: 'Kotlin/JS · Wasm', fr: 'Kotlin/JS · Wasm' } as Bi<string>,
  webUi: { en: 'HTML / DOM interop', fr: 'Interop HTML / DOM' } as Bi<string>,
  webInput: { en: 'Mouse · touch · pointer', fr: 'Souris · tactile · pointeur' } as Bi<string>,
  webOpt: { en: 'Tree-shaking · code split', fr: 'Tree-shaking · code splitting' } as Bi<string>,
  webPkg: { en: 'Webpack bundle', fr: 'Bundle Webpack' } as Bi<string>,
  webDist: { en: 'Push to any CDN', fr: 'Push sur n\'importe quel CDN' } as Bi<string>,

  // Desktop
  desktopApis: { en: '40+ Kotlin modules · Native Access via Kotlin/Native', fr: '40+ modules Kotlin · accès natif via Kotlin/Native' } as Bi<string>,
  desktopUi: { en: 'macOS · Fluent · Yaru in Compose + native overlay', fr: 'macOS · Fluent · Yaru en Compose + overlay natif' } as Bi<string>,
  desktopInput: { en: 'Mouse · keyboard · multi-touch · pen · Wayland gestures', fr: 'Souris · clavier · multi-touch · stylet · gestes Wayland' } as Bi<string>,
  desktopOpt: { en: 'GraalVM closed-world · JIT + AOT cache · native-lib stripping', fr: 'GraalVM closed-world · cache JIT + AOT · stripping des libs natives' } as Bi<string>,
  desktopPkg: { en: '18 formats, signed + notarized', fr: '18 formats, signés + notarisés' } as Bi<string>,
  desktopDist: { en: 'MS Store · App Store · Snap · GitHub · auto-update', fr: 'MS Store · App Store · Snap · GitHub · mise à jour auto' } as Bi<string>,
};

// =====================================================================
// OneLanguageBar — vanilla CMP vs Nucleus gap
// =====================================================================
export const oneLangT = {
  themTag: { en: 'Vanilla Compose Desktop', fr: 'Compose Desktop vanilla' } as Bi<string>,
  themCap: {
    en: 'Skia window, mouse and keyboard only — no multi-touch, no pen. Tray APIs on Windows and Linux are legacy and barely usable; notifications stay minimal. System integration is a thin demo surface, not a production desktop stack. Six jpackage formats; you still own chrome, signing, auto-update, and stores.',
    fr: 'Fenêtre Skia, souris et clavier uniquement — pas de multi-touch, pas de stylet. Le tray Windows et Linux est obsolète et à peine utilisable ; les notifications restent basiques. L\'intégration système est une couche de démo, pas un stack desktop de production. Six formats jpackage ; chrome, signature, auto-update et stores restent à votre charge.',
  } as Bi<string>,
  usTag: { en: 'Compose + Nucleus', fr: 'Compose + Nucleus' } as Bi<string>,
  usCap: {
    en: 'Same Compose UI — plus native decorated windows, 40+ Kotlin OS modules, 18 packaging formats, auto-update, and store-ready CI. Drop-in on the JetBrains plugin.',
    fr: 'La même UI Compose — plus fenêtres décorées natives, 40+ modules OS Kotlin, 18 formats de packaging, auto-update et CI prête pour les stores. Drop-in sur le plugin JetBrains.',
  } as Bi<string>,
  themPill1: { en: 'No touch / pen', fr: 'Pas de tactile / stylet' } as Bi<string>,
  themPill2: { en: 'Legacy tray', fr: 'Tray obsolète' } as Bi<string>,
  themPill3: { en: 'Not production-ready', fr: 'Inutilisable en prod' } as Bi<string>,
  usPill1: { en: 'Native chrome', fr: 'Chrome natif' } as Bi<string>,
  usPill2: { en: '40+ OS modules', fr: '40+ modules OS' } as Bi<string>,
  usPill3: { en: 'Ship & stores', fr: 'Ship & stores' } as Bi<string>,
};

// =====================================================================
// Shipped components — "one API, every platform" shelf
// =====================================================================
export const componentsT = {
  eyebrow: { en: 'Batteries included', fr: 'Piles incluses' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'It ships ',
      React.createElement('span', { className: 'hero-grad' }, 'components'),
      ' too — one Compose API, every platform.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Il livre aussi des ',
      React.createElement('span', { className: 'hero-grad' }, 'composants'),
      ' — une seule API Compose, chaque plateforme.',
    ),
  } as Bi,
  subtitle: {
    en: 'Each one replaces four native engines you\'d otherwise write, test, and keep in sync — behind a single composable identical on Android, iOS, web, and desktop.',
    fr: 'Chacun remplace quatre moteurs natifs qu\'il faudrait sinon écrire, tester et garder synchronisés — derrière un seul composable identique sur Android, iOS, web et desktop.',
  } as Bi<string>,
  replaces: { en: 'replaces', fr: 'remplace' } as Bi<string>,
  comingSoon: { en: 'Coming soon', fr: 'Prochainement' } as Bi<string>,
};

// =====================================================================
// Features (runtime modules grid)
// =====================================================================
export const featuresT = {
  eyebrow: { en: 'Runtime', fr: 'Runtime' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      '40+ modules. ',
      React.createElement('br'),
      'Every OS feature, ',
      React.createElement('span', { className: 'hero-grad' }, 'first-class.'),
    ),
    fr: React.createElement(React.Fragment, null,
      '40+ modules. ',
      React.createElement('br'),
      'Chaque fonctionnalité OS, ',
      React.createElement('span', { className: 'hero-grad' }, 'citoyenne de première classe.'),
    ),
  } as Bi,
  subtitle: {
    en: 'TextureView and NativeView put GPU frames and platform widgets inside Compose. Differential auto-update ships only the blocks that changed. Task Scheduler runs background work like WorkManager even when the app is closed. Plus the full OS surface — notifications, tray, hotkeys, dark mode — one Kotlin shape per capability.',
    fr: 'TextureView et NativeView placent textures GPU et widgets natifs dans Compose. L\'auto-update différentiel ne télécharge que les blocs modifiés. Le Task Scheduler lance du travail en arrière-plan comme WorkManager, même app fermée. Et toute la surface OS — notifications, tray, raccourcis globaux, mode sombre — une API Kotlin par capacité.',
  } as Bi<string>,
  newIn: { en: 'New in {line}', fr: 'Nouveau dans {line}' } as Bi<string>,
  cta: { en: 'See what shipped in this release', fr: 'Voir le contenu de cette version' } as Bi<string>,
};

// =====================================================================
// Tao backend strip (under Features)
// =====================================================================
export const taoStripT = {
  badge: { en: 'Powered by Tao', fr: 'Propulsé par Tao' } as Bi<string>,
  badgeNew: { en: 'Default backend', fr: 'Backend par défaut' } as Bi<string>,
  lede: {
    en: 'Tao is the Rust windowing crate behind Tauri 2. Nucleus uses it as the default window backend — no AWT — so you get TextureView for external GPU textures, NativeView for platform widgets, native Wayland, multi-touch, pen input, and window-scaffold chrome in the same Compose tree.',
    fr: 'Tao est la crate de fenêtrage Rust derrière Tauri 2. Nucleus en fait le backend de fenêtre par défaut — sans AWT — : TextureView pour les textures GPU externes, NativeView pour les widgets natifs, Wayland natif, multi-touch, stylet et chrome via window scaffold, dans le même arbre Compose.',
  } as Bi<string>,
  textureTitle: { en: 'TextureView', fr: 'TextureView' } as Bi<string>,
  textureDesc: {
    en: 'External GPU textures composited in the scene — D3D11, Metal, DMA-BUF. No CPU frame copy.',
    fr: 'Textures GPU externes compositées dans la scène — D3D11, Metal, DMA-BUF. Aucune copie CPU des frames.',
  } as Bi<string>,
  nativeTitle: { en: 'NativeView', fr: 'NativeView' } as Bi<string>,
  nativeDesc: {
    en: 'Embed NSView, HWND, or GtkWidget in Compose layout — same slot lifecycle as AndroidView.',
    fr: 'Embarquez un NSView, HWND ou GtkWidget dans le layout Compose — même cycle de vie de slot qu\'AndroidView.',
  } as Bi<string>,
  waylandTitle: { en: 'Native Wayland', fr: 'Wayland natif' } as Bi<string>,
  waylandDesc: {
    en: 'First-class Wayland support — no XWayland fallback, fractional scaling, gestures.',
    fr: 'Support Wayland de premier plan — sans repli XWayland, scaling fractionnaire, gestes.',
  } as Bi<string>,
  touchTitle: { en: 'Multi-touch & pen', fr: 'Multi-touch et stylet' } as Bi<string>,
  touchDesc: {
    en: 'Pinch, swipe, rotate, pressure and tilt — every pointer event carries the full source.',
    fr: 'Pinch, swipe, rotation, pression et inclinaison — chaque événement pointeur porte la source complète.',
  } as Bi<string>,
};

// =====================================================================
// Accessibility
// =====================================================================
export const accessibilityT = {
  eyebrow: { en: 'Native accessibility', fr: 'Accessibilité native' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'One semantics tree. ',
      React.createElement('span', { className: 'hero-grad' }, 'Three native screen readers.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Un arbre de sémantique. ',
      React.createElement('span', { className: 'hero-grad' }, 'Trois lecteurs d\'écran natifs.'),
    ),
  } as Bi,
  subtitle: {
    en: 'The Tao backend projects your Compose semantics onto NSAccessibility, UI Automation, and AT-SPI. VoiceOver, Narrator, and Orca just work — no extra wiring, no platform-specific code. And accessibility matters now more than ever: as AI agents increasingly interact with applications, they rely on the same structured accessibility trees to read and control programs.',
    fr: 'Le backend Tao projette ta sémantique Compose sur NSAccessibility, UI Automation et AT-SPI. VoiceOver, Narrator et Orca fonctionnent directement — pas de câblage supplémentaire, pas de code spécifique par plateforme. Et l\'accessibilité compte plus que jamais : alors que les agents IA interagissent de plus en plus avec les applications, ils s\'appuient sur les mêmes arbres d\'accessibilité structurés pour lire et contrôler les programmes.',
  } as Bi<string>,
  macosName: { en: 'macOS', fr: 'macOS' } as Bi<string>,
  macosReader: { en: 'VoiceOver', fr: 'VoiceOver' } as Bi<string>,
  macosApi: { en: 'NSAccessibility', fr: 'NSAccessibility' } as Bi<string>,
  macosTag: { en: 'AXIdentifier · testTag', fr: 'AXIdentifier · testTag' } as Bi<string>,
  windowsName: { en: 'Windows', fr: 'Windows' } as Bi<string>,
  windowsReader: { en: 'Narrator', fr: 'Narrator' } as Bi<string>,
  windowsApi: { en: 'UI Automation', fr: 'UI Automation' } as Bi<string>,
  windowsTag: { en: 'AutomationId · testTag', fr: 'AutomationId · testTag' } as Bi<string>,
  linuxName: { en: 'Linux', fr: 'Linux' } as Bi<string>,
  linuxReader: { en: 'Orca', fr: 'Orca' } as Bi<string>,
  linuxApi: { en: 'AT-SPI via AccessKit', fr: 'AT-SPI via AccessKit' } as Bi<string>,
  linuxTag: { en: 'AccessKit author id · testTag', fr: 'AccessKit author id · testTag' } as Bi<string>,
  footnote: {
    en: 'No assistive tech attached? The backend skips the walk entirely, so scrolling and animation stay smooth. The first screen-reader query activates the projection automatically.',
    fr: 'Aucune technologie d\'assistance connectée ? Le backend saute le parcours entièrement pour garder le défilement et les animations fluides. La première requête d\'un lecteur d\'écran active la projection automatiquement.',
  } as Bi<string>,
  // Preview UI strings
  pv_settings: { en: 'Settings', fr: 'Paramètres' } as Bi<string>,
  pv_account: { en: 'Account', fr: 'Compte' } as Bi<string>,
  pv_active: { en: 'Active', fr: 'Actif' } as Bi<string>,
  pv_voiceOver: { en: 'VoiceOver', fr: 'VoiceOver' } as Bi<string>,
  pv_focusHint: { en: 'Focus moves to the switch', fr: 'Le focus se déplace sur le switch' } as Bi<string>,
  pv_easeOfAccess: { en: 'Ease of Access', fr: 'Accès facile' } as Bi<string>,
  pv_narrator: { en: 'Narrator', fr: 'Narrateur' } as Bi<string>,
  pv_describe: { en: 'Describe the world around me', fr: 'Décrire le monde autour de moi' } as Bi<string>,
  pv_focusedElement: { en: 'Focused element', fr: 'Élément focalisé' } as Bi<string>,
  pv_accessibility: { en: 'Accessibility', fr: 'Accessibilité' } as Bi<string>,
  pv_screenReader: { en: 'Screen Reader', fr: 'Lecteur d\'écran' } as Bi<string>,
  pv_orca: { en: 'Orca Screen Reader', fr: 'Lecteur d\'écran Orca' } as Bi<string>,
  pv_atspi: { en: 'AT-SPI bus bridged via AccessKit', fr: 'Bus AT-SPI ponté via AccessKit' } as Bi<string>,
};

// =====================================================================
// Toolkits
// =====================================================================
export const toolkitsT = {
  eyebrow: { en: 'Five native looks', fr: 'Cinq looks natifs' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'Match every desktop, ',
      React.createElement('span', { className: 'hero-grad' }, 'by design.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Colle à chaque desktop, ',
      React.createElement('span', { className: 'hero-grad' }, 'par design.'),
    ),
  } as Bi,
  subtitle: {
    en: 'Write your UI once in Compose, render it in the desktop style of your choice — macOS 26 Liquid Glass, Windows 11 Fluent, Ubuntu Yaru, IntelliJ Jewel, or cross-platform Material 3. macOS, Fluent and Yaru ship as open-source design systems on Maven Central (with Nucleus-backed decorated windows); Jewel is JetBrains\' toolkit; Material 3 is the Nucleus fallback.',
    fr: 'Une UI écrite une fois en Compose, rendue dans le style desktop voulu — macOS 26 Liquid Glass, Windows 11 Fluent, Ubuntu Yaru, IntelliJ Jewel ou Material 3 multiplateforme. macOS, Fluent et Yaru sont des design systems open-source sur Maven Central (avec fenêtres décorées basées sur Nucleus) ; Jewel est le toolkit JetBrains ; Material 3 est le repli Nucleus.',
  } as Bi<string>,
  isNew: { en: 'Available', fr: 'Disponible' } as Bi<string>,
  macOsName: { en: 'macOS Tahoe', fr: 'macOS Tahoe' } as Bi<string>,
  fluentOs: { en: 'Windows 11', fr: 'Windows 11' } as Bi<string>,
  yaruStyle: { en: 'GTK · LibAdwaita', fr: 'GTK · LibAdwaita' } as Bi<string>,
  yaruOs: { en: 'Ubuntu · GNOME', fr: 'Ubuntu · GNOME' } as Bi<string>,
  jewelStyle: { en: 'IntelliJ Platform', fr: 'IntelliJ Platform' } as Bi<string>,
  jewelOs: { en: 'Cross-platform tooling', fr: 'Outils multiplateformes' } as Bi<string>,
  m3Style: { en: 'Material You', fr: 'Material You' } as Bi<string>,
  m3Os: { en: 'Cross-platform', fr: 'Multiplateforme' } as Bi<string>,
  footnote: {
    en: React.createElement(React.Fragment, null,
      'Pick one toolkit per OS, or mix freely — every design system runs on every platform. You can ship a Fluent build on macOS while you prototype the native look. Either way, your ',
      React.createElement('code', null, 'DecoratedWindow'),
      ' stays the same Composable.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Choisissez un toolkit par OS, ou mélangez librement — chaque design system tourne sur chaque plateforme. Vous pouvez livrer un build Fluent sur macOS le temps de prototyper le look natif. Dans tous les cas, le ',
      React.createElement('code', null, 'DecoratedWindow'),
      ' reste le même Composable.',
    ),
  } as Bi,
  // Preview UI strings
  pv_settings: { en: 'Settings', fr: 'Paramètres' } as Bi<string>,
  pv_settingsNucleus: { en: 'Settings — Nucleus Demo', fr: 'Paramètres — Démo Nucleus' } as Bi<string>,
  pv_general: { en: 'General', fr: 'Général' } as Bi<string>,
  pv_appearance: { en: 'Appearance', fr: 'Apparence' } as Bi<string>,
  pv_network: { en: 'Network', fr: 'Réseau' } as Bi<string>,
  pv_darkMode: { en: 'Dark mode', fr: 'Mode sombre' } as Bi<string>,
  pv_dynamic: { en: 'Dynamic color', fr: 'Couleur dynamique' } as Bi<string>,
  pv_continue: { en: 'Continue', fr: 'Continuer' } as Bi<string>,
  pv_system: { en: 'System', fr: 'Système' } as Bi<string>,
  pv_followSystem: { en: 'Follow system', fr: 'Suivre le système' } as Bi<string>,
  pv_accent: { en: 'Accent', fr: 'Accent' } as Bi<string>,
  pv_save: { en: 'Save', fr: 'Enregistrer' } as Bi<string>,
  pv_darkStyle: { en: 'Dark style', fr: 'Style sombre' } as Bi<string>,
  pv_accentColor: { en: 'Accent color', fr: 'Couleur d\'accent' } as Bi<string>,
  pv_apply: { en: 'Apply', fr: 'Appliquer' } as Bi<string>,
  pv_cancel: { en: 'Cancel', fr: 'Annuler' } as Bi<string>,
  pv_editor: { en: 'Editor', fr: 'Éditeur' } as Bi<string>,
  pv_plugins: { en: 'Plugins', fr: 'Plugins' } as Bi<string>,
  pv_theme: { en: 'Theme', fr: 'Thème' } as Bi<string>,
  pv_colors: { en: 'Colors', fr: 'Couleurs' } as Bi<string>,
  pv_keymap: { en: 'Keymap', fr: 'Raccourcis' } as Bi<string>,
};

// =====================================================================
// Perf / RuntimeModeCards
// =====================================================================
export const perfT = {
  eyebrow: { en: 'Two runtimes, one binary', fr: 'Deux runtimes, un seul binaire' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'Pick your tradeoff. ',
      React.createElement('span', { className: 'hero-grad' }, 'Win either way.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Choisis ton compromis. ',
      React.createElement('span', { className: 'hero-grad' }, 'Tu gagnes dans les deux cas.'),
    ),
  } as Bi,
  subtitle: {
    en: "Same Kotlin code, two runtimes: a GraalVM native image for instant cold start and a tiny resident set, or a modern JDK with AOT cache where HotSpot's JIT gets close to C++ and Rust on hot paths. Same source. Same build.",
    fr: "Le même code Kotlin, deux runtimes : une image native GraalVM pour un démarrage à froid instantané et une empreinte minuscule, ou un JDK moderne avec cache AOT où le JIT de HotSpot s'approche du C++ et de Rust sur les chemins chauds. Même source. Même build.",
  } as Bi<string>,
  footnote: {
    en: '* Cold start and RAM measured on Windows 11 with a Hello World build. Binary size is the NSIS installer with maximum compression.',
    fr: '* Démarrage à froid et RAM mesurés sur Windows 11 avec un build Hello World. La taille du binaire correspond à l’installateur NSIS avec compression maximale.',
  } as Bi<string>,
};

export const rmodeT = {
  cpuThroughput: { en: 'CPU throughput', fr: 'Débit CPU' } as Bi<string>,
  cppBaseline: { en: 'C++/Rust baseline', fr: 'Référence C++/Rust' } as Bi<string>,
  bestFor: { en: 'Best for', fr: 'Idéal pour' } as Bi<string>,

  // Native image card
  nativeTag: { en: 'Closed world', fr: 'Closed world' } as Bi<string>,
  nativeName: { en: 'GraalVM Native Image', fr: 'GraalVM Native Image' } as Bi<string>,
  nativeTagline: { en: 'Instant cold start. Tiny footprint.', fr: 'Démarrage à froid instantané. Empreinte minuscule.' } as Bi<string>,
  nativeDesc: {
    en: 'Your whole app is AOT-compiled to a standalone binary. No JVM startup, no class loading — the process is alive in half a second. Smallest resident set on the market.',
    fr: 'L\'app entière est compilée AOT en binaire autonome. Pas de démarrage JVM, pas de chargement de classes — le process est vivant en une demi-seconde. La plus petite empreinte mémoire du marché.',
  } as Bi<string>,
  nativeColdStart: { en: 'Cold start', fr: 'Démarrage à froid' } as Bi<string>,
  nativeRam: { en: 'RAM idle', fr: 'RAM au repos' } as Bi<string>,
  nativeBinary: { en: 'Binary', fr: 'Binaire' } as Bi<string>,
  nativeThruLabel: { en: 'Very good · AOT compiled', fr: 'Très bon · compilé AOT' } as Bi<string>,
  nativeThruNote: { en: 'GraalVM PGO + Compose IR optimizations', fr: 'PGO GraalVM + optimisations IR Compose' } as Bi<string>,
  nativeBest1: { en: 'CLIs & small apps', fr: 'CLIs & petites apps' } as Bi<string>,
  nativeBest2: { en: 'Sandboxed targets', fr: 'Cibles sandboxées' } as Bi<string>,
  nativeBest3: { en: 'App Store / MSIX', fr: 'App Store / MSIX' } as Bi<string>,
  nativeBest4: { en: 'Distribution-first', fr: 'Distribution avant tout' } as Bi<string>,

  // AOT card
  aotTag: { en: 'Open world', fr: 'Open world' } as Bi<string>,
  aotName: { en: 'JDK 25 + AOT Cache', fr: 'JDK 25 + cache AOT' } as Bi<string>,
  aotTagline: { en: 'Peak JIT throughput. Plugins, agents, full reflection.', fr: 'Débit JIT au sommet. Plugins, agents, réflexion totale.' } as Bi<string>,
  aotDesc: {
    en: "HotSpot's C2 JIT is the most mature compiler ever built. JDK 25's AOT cache primes class metadata so you skip the warm-up — and you keep everything closed-world gives up: dynamic class loading, full reflection, JVM agents, scripting engines, live plugins and extensions.",
    fr: "Le JIT C2 de HotSpot est le compilateur le plus mûr jamais construit. Le cache AOT de JDK 25 amorce les métadonnées de classes : le warm-up disparaît — et tout ce que le closed-world abandonne reste accessible : chargement dynamique, réflexion totale, agents JVM, moteurs de scripting, plugins et extensions à chaud.",
  } as Bi<string>,
  aotThruLabel: { en: '≈ C++ / Rust on hot paths', fr: '≈ C++ / Rust sur les chemins chauds' } as Bi<string>,
  aotThruNote: { en: 'HotSpot C2 · escape analysis · vectorization', fr: 'HotSpot C2 · escape analysis · vectorisation' } as Bi<string>,
  aotBest1: { en: 'Plugin & extension hosts', fr: 'Hôtes de plugins / extensions' } as Bi<string>,
  aotBest2: { en: 'IDE-like tools', fr: 'Outils de type IDE' } as Bi<string>,
  aotBest3: { en: 'Long-running apps', fr: 'Apps long-running' } as Bi<string>,
  aotBest4: { en: 'Scripting & DSL runtimes', fr: 'Runtimes scripting / DSL' } as Bi<string>,
};

// =====================================================================
// NativeParadox
// =====================================================================
export const npT = {
  eyebrow: { en: 'The Nucleus paradox', fr: 'Le paradoxe Nucleus' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'Native APIs.', React.createElement('br'),
      React.createElement('span', { className: 'hero-grad' }, 'Easier than native.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'APIs natives.', React.createElement('br'),
      React.createElement('span', { className: 'hero-grad' }, 'Plus simple que le natif.'),
    ),
  } as Bi,
  subtitle: {
    en: 'Win32 ITaskbarList3. NSUserNotifications. freedesktop D-Bus. IOKit. ScreenCaptureKit. Each desktop API is its own tiny ordeal — different language, different threading model, different conventions. Nucleus wraps every one in a Kotlin function that feels obvious. The result: a cross-platform abstraction simpler than the original, on every platform.',
    fr: 'Win32 ITaskbarList3. NSUserNotifications. freedesktop D-Bus. IOKit. ScreenCaptureKit. Chaque API desktop est son propre petit calvaire — langage différent, modèle de threading différent, conventions différentes. Nucleus enveloppe chacune dans une fonction Kotlin qui paraît évidente. Résultat : une abstraction multiplateforme plus simple que l\'originale, sur chaque plateforme.',
  } as Bi<string>,
  exNotification: { en: 'Notification', fr: 'Notification' } as Bi<string>,
  exTray: { en: 'System tray', fr: 'Zone de notification' } as Bi<string>,
  exHotkey: { en: 'Global hotkey', fr: 'Raccourci global' } as Bi<string>,
  exScheduler: { en: 'Background tasks', fr: 'Tâches en arrière-plan' } as Bi<string>,
  exUpdate: { en: 'Auto-update', fr: 'Mise à jour auto' } as Bi<string>,
  exTaskbar: { en: 'Dock / taskbar', fr: 'Dock / barre des tâches' } as Bi<string>,
  nativeApi: { en: 'Native API', fr: 'API native' } as Bi<string>,
  threadingNote: { en: 'Threading model: yours to figure out', fr: 'Modèle de threading : à la charge du développeur' } as Bi<string>,
  fewerLines: {
    en: React.createElement(React.Fragment, null, 'fewer', React.createElement('br'), 'lines'),
    fr: React.createElement(React.Fragment, null, 'lignes', React.createElement('br'), 'en moins'),
  } as Bi,
  oneApi: { en: 'One Kotlin API · all platforms', fr: 'Une seule API Kotlin · toutes plateformes' } as Bi<string>,
  lines: { en: 'lines', fr: 'lignes' } as Bi<string>,
  nucleusFootnote: {
    en: 'Coroutines-friendly · type-safe · zero callbacks lost',
    fr: 'Compatible coroutines · type-safe · zéro callback perdu',
  } as Bi<string>,
  calloutH: { en: 'No abstraction tax', fr: 'Aucune taxe d\'abstraction' } as Bi<string>,
  calloutD: {
    en: React.createElement(React.Fragment, null,
      "Nucleus doesn't lowest-common-denominator — every platform feature is exposed in full. Pressure-sensitive pen events, NSToolbar customization, JumpLists, Unity quicklists, badge colors, focus rings — all reachable. The Kotlin layer is a ",
      React.createElement('em', null, 'better front door'),
      ' to the native, not a wrapper that hides it.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Nucleus ne fait pas du plus petit dénominateur commun — chaque fonctionnalité de plateforme est exposée intégralement. Événements stylet sensibles à la pression, personnalisation NSToolbar, JumpLists, quicklists Unity, couleurs de badge, anneaux de focus — tout est accessible. La couche Kotlin est une ',
      React.createElement('em', null, 'meilleure porte d\'entrée'),
      ' vers le natif, pas un wrapper qui le cache.',
    ),
  } as Bi,
};

// =====================================================================
// Install CTA
// =====================================================================
// =====================================================================
// Ship pipeline (CI/CD)
// =====================================================================
export const shipT = {
  eyebrow: { en: 'From tag to release', fr: 'Du tag à la release' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'Push a tag. Get ',
      React.createElement('span', { className: 'hero-grad' }, 'signed installers.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Pousse un tag. Récupère des ',
      React.createElement('span', { className: 'hero-grad' }, 'installeurs signés.'),
    ),
  } as Bi,
  subtitle: {
    en: 'Nucleus ships reusable GitHub Actions that build, sign, notarize, bundle and publish for every desktop — without a copy-pasted YAML in sight. Six composite actions, one reference workflow, one tag push.',
    fr: 'Nucleus livre des GitHub Actions réutilisables qui compilent, signent, notarisent, empaquettent et publient pour chaque desktop — sans YAML copié-collé. Six actions composites, un workflow de référence, un seul push de tag.',
  } as Bi<string>,
  // Pipeline stages
  stageTrigger: { en: 'Trigger', fr: 'Déclenchement' } as Bi<string>,
  stageTriggerLine: { en: 'git push tag v1.0.0', fr: 'git push tag v1.0.0' } as Bi<string>,
  stageBuild: { en: 'Matrix build', fr: 'Build matriciel' } as Bi<string>,
  stageBuildSub: { en: '6 parallel runners', fr: '6 runners en parallèle' } as Bi<string>,
  stageSign: { en: 'Sign · bundle · notarize', fr: 'Signer · bundler · notariser' } as Bi<string>,
  stageSignSub: { en: 'lipo universal · MSIX · staple', fr: 'lipo universal · MSIX · staple' } as Bi<string>,
  stageRelease: { en: 'GitHub Release', fr: 'GitHub Release' } as Bi<string>,
  stageReleaseSub: { en: 'installers + block maps + update YAML', fr: 'installeurs + block maps + YAML update' } as Bi<string>,
  // Action cards
  actionsLabel: { en: 'Six composite actions', fr: 'Six actions composites' } as Bi<string>,
  a1Name: { en: 'setup-nucleus', fr: 'setup-nucleus' } as Bi<string>,
  a1Desc: {
    en: 'JBR 25 or Liberica NIK, Gradle cache, Node, Linux packaging tools — one step, every runner.',
    fr: 'JBR 25 ou Liberica NIK, cache Gradle, Node, outils de packaging Linux — une étape, tout runner.',
  } as Bi<string>,
  a2Name: { en: 'setup-macos-signing', fr: 'setup-macos-signing' } as Bi<string>,
  a2Desc: {
    en: 'Temporary keychain, .p12 imported from secrets, identities exposed to downstream steps.',
    fr: 'Trousseau temporaire, .p12 importé depuis les secrets, identités exposées aux étapes suivantes.',
  } as Bi<string>,
  a3Name: { en: 'build-macos-universal', fr: 'build-macos-universal' } as Bi<string>,
  a3Desc: {
    en: 'lipo merge arm64 + x64, inside-out re-sign, notarize via notarytool, staple — one DMG out.',
    fr: 'Fusion lipo arm64 + x64, re-sign inside-out, notarisation via notarytool, staple — un DMG en sortie.',
  } as Bi<string>,
  a4Name: { en: 'build-windows-appxbundle', fr: 'build-windows-appxbundle' } as Bi<string>,
  a4Desc: {
    en: 'Merge amd64 + arm64 .appx into a .msixbundle, sign with SignTool — Microsoft Store ready.',
    fr: 'Fusion amd64 + arm64 .appx en .msixbundle, signature SignTool — prêt pour le Microsoft Store.',
  } as Bi<string>,
  a5Name: { en: 'generate-update-yml', fr: 'generate-update-yml' } as Bi<string>,
  a5Desc: {
    en: 'SHA-512 every installer, emit latest-*.yml plus electron-builder block maps so clients download only changed blocks.',
    fr: 'SHA-512 de chaque installeur, génère latest-*.yml et les block maps electron-builder pour ne télécharger que les blocs modifiés.',
  } as Bi<string>,
  a6Name: { en: 'publish-release', fr: 'publish-release' } as Bi<string>,
  a6Desc: {
    en: 'gh release create with the right assets, marks -alpha / -beta / -rc as pre-release automatically.',
    fr: 'gh release create avec les bons assets, marque -alpha / -beta / -rc en pre-release automatiquement.',
  } as Bi<string>,
  // OS chips
  osUbuntu: { en: 'Ubuntu', fr: 'Ubuntu' } as Bi<string>,
  osWindows: { en: 'Windows', fr: 'Windows' } as Bi<string>,
  osMacos: { en: 'macOS', fr: 'macOS' } as Bi<string>,
  // CTA
  ctaDocs: { en: 'Reference release workflow', fr: 'Workflow de release de référence' } as Bi<string>,
};

export const installT = {
  eyebrow: { en: 'Try the demo', fr: 'Essaie la démo' } as Bi<string>,
  title: {
    en: React.createElement(React.Fragment, null,
      'One line. Real desktop app. ',
      React.createElement('span', { className: 'hero-grad' }, 'Now.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Une ligne. Vraie app desktop. ',
      React.createElement('span', { className: 'hero-grad' }, 'Maintenant.'),
    ),
  } as Bi,
  sub: {
    en: 'Decorated window, dark-mode-aware, auto-updating. The demo ships with full source — clone, build, and replace.',
    fr: 'Fenêtre décorée, consciente du mode sombre, mise à jour automatique. La démo est livrée avec le source complet — cloner, builder, remplacer.',
  } as Bi<string>,
  copied: { en: 'Copied', fr: 'Copié' } as Bi<string>,
  copy: { en: 'Copy', fr: 'Copier' } as Bi<string>,
  meta: {
    en: 'Detects your architecture · downloads · installs · launches.',
    fr: 'Détecte l\'architecture · télécharge · installe · lance.',
  } as Bi<string>,
  readGuide: { en: 'Or read the install guide →', fr: 'Ou lire le guide d\'installation →' } as Bi<string>,
};

// =====================================================================
// Footer
// =====================================================================
export const footerT = {
  tagline: {
    en: 'The production desktop layer for Compose Multiplatform. Native OS, same Kotlin.',
    fr: 'La couche desktop de production pour Compose Multiplatform. OS natif, même Kotlin.',
  } as Bi<string>,
  docs: { en: 'Docs', fr: 'Docs' } as Bi<string>,
  gettingStarted: { en: 'Getting started', fr: 'Premiers pas' } as Bi<string>,
  runtimeApis: { en: 'Runtime APIs', fr: 'APIs runtime' } as Bi<string>,
  packaging: { en: 'Packaging', fr: 'Empaquetage' } as Bi<string>,
  cicd: { en: 'CI / CD', fr: 'CI / CD' } as Bi<string>,
  platform: { en: 'Platform', fr: 'Plateforme' } as Bi<string>,
  community: { en: 'Community', fr: 'Communauté' } as Bi<string>,
  github: { en: 'GitHub', fr: 'GitHub' } as Bi<string>,
  releases: { en: 'Releases', fr: 'Versions' } as Bi<string>,
  roadmap: { en: 'Roadmap', fr: 'Roadmap' } as Bi<string>,
  discord: { en: 'Discord', fr: 'Discord' } as Bi<string>,
  legal: { en: 'Legal', fr: 'Mentions légales' } as Bi<string>,
  license: { en: 'License (MIT)', fr: 'Licence (MIT)' } as Bi<string>,
  trademark: { en: 'Trademark', fr: 'Marque' } as Bi<string>,
  security: { en: 'Security', fr: 'Sécurité' } as Bi<string>,
  copyright: {
    en: '© 2026 Nucleus Framework. MIT licensed.',
    fr: '© 2026 Nucleus Framework. Sous licence MIT.',
  } as Bi<string>,
  version: {
    en: `${NUCLEUS_VTAG} · Tao backend`,
    fr: `${NUCLEUS_VTAG} · backend Tao`,
  } as Bi<string>,
};
