import * as React from 'react';

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
  h1: {
    en: React.createElement(React.Fragment, null,
      'The Kotlin framework', React.createElement('br'),
      'for ',
      React.createElement('span', { className: 'hero-grad' }, 'cross-platform native'),
      ' desktop apps.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Le framework Kotlin', React.createElement('br'),
      'pour les apps desktop ',
      React.createElement('span', { className: 'hero-grad' }, 'natives multiplateformes'),
      '.',
    ),
  } as Bi,
  sub: {
    en: React.createElement(React.Fragment, null,
      'Real cross-platform — not just macOS, Windows and Linux, but the same Kotlin codebase as your ',
      React.createElement('span', { className: 'hero-sub-em' }, 'Android'), ', ',
      React.createElement('span', { className: 'hero-sub-em' }, 'iOS'), ' and ',
      React.createElement('span', { className: 'hero-sub-em' }, 'web'),
      ' apps. ',
      React.createElement('span', { className: 'hero-sub-dim' }, 'One language, every screen, every architecture.'),
    ),
    fr: React.createElement(React.Fragment, null,
      'Du vrai multiplateforme — pas seulement macOS, Windows et Linux, mais la même base Kotlin que tes apps ',
      React.createElement('span', { className: 'hero-sub-em' }, 'Android'), ', ',
      React.createElement('span', { className: 'hero-sub-em' }, 'iOS'), ' et ',
      React.createElement('span', { className: 'hero-sub-em' }, 'web'),
      '. ',
      React.createElement('span', { className: 'hero-sub-dim' }, 'Un langage, tous les écrans, toutes les architectures.'),
    ),
  } as Bi,
  ctaPrimary: { en: 'Get started', fr: 'Démarrer' } as Bi<string>,
  ctaSecondary: { en: 'Install the demo', fr: 'Installer la démo' } as Bi<string>,
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
      ', Kotlin and Compose are first-class citizens. On ',
      React.createElement('span', { className: 'pitch-em' }, 'iOS'),
      ', Kotlin/Native reaches every UIKit and Foundation API while Compose renders like a true native app. On the ',
      React.createElement('span', { className: 'pitch-em' }, 'web'),
      ', Kotlin/JS and Wasm draw Compose UIs with the full browser API surface. Desktop had only half of that — you could render a window, but reaching the OS meant ',
      React.createElement('span', { className: 'pitch-em' }, 'juggling pointers, compiling native libraries per platform, wiring JNI or FFM bridges, and learning a different native API for every OS'),
      " — a wall most Kotlin developers couldn't climb. Nucleus closes the gap.",
    ),
    fr: React.createElement(React.Fragment, null,
      'Sur ', React.createElement('span', { className: 'pitch-em' }, 'Android'),
      ', Kotlin et Compose sont citoyens de première classe. Sur ',
      React.createElement('span', { className: 'pitch-em' }, 'iOS'),
      ', Kotlin/Native touche chaque API UIKit et Foundation, et Compose s\'affiche comme une vraie app native. Sur le ',
      React.createElement('span', { className: 'pitch-em' }, 'web'),
      ', Kotlin/JS et Wasm peignent des UI Compose avec toute la surface des APIs du navigateur. Le desktop n\'avait que la moitié de tout ça — tu pouvais dessiner une fenêtre, mais atteindre l\'OS, ça voulait dire ',
      React.createElement('span', { className: 'pitch-em' }, 'jongler avec des pointeurs, compiler des bibliothèques natives par plateforme, brancher des ponts JNI ou FFM, et apprendre une API native différente pour chaque OS'),
      ' — un mur que la plupart des développeurs Kotlin ne pouvaient pas franchir. Nucleus comble l\'écart.',
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
  desktopApis: { en: '30+ Kotlin modules · Native Access via Kotlin/Native', fr: '30+ modules Kotlin · accès natif via Kotlin/Native' } as Bi<string>,
  desktopUi: { en: 'macOS · Fluent · Yaru in Compose + native overlay', fr: 'macOS · Fluent · Yaru en Compose + overlay natif' } as Bi<string>,
  desktopInput: { en: 'Mouse · keyboard · multi-touch · pen · Wayland gestures', fr: 'Souris · clavier · multi-touch · stylet · gestes Wayland' } as Bi<string>,
  desktopOpt: { en: 'GraalVM closed-world · JIT + AOT cache · native-lib stripping', fr: 'GraalVM closed-world · cache JIT + AOT · stripping des libs natives' } as Bi<string>,
  desktopPkg: { en: '16 formats, signed + notarized', fr: '16 formats, signés + notarisés' } as Bi<string>,
  desktopDist: { en: 'MS Store · App Store · Snap · GitHub · auto-update', fr: 'MS Store · App Store · Snap · GitHub · mise à jour auto' } as Bi<string>,
};

// =====================================================================
// OneLanguageBar
// =====================================================================
export const oneLangT = {
  themTag: { en: 'Tauri', fr: 'Tauri' } as Bi<string>,
  themCap: {
    en: 'JS frontend, Rust core, native FFI per platform — every boundary needs an IPC bridge.',
    fr: 'UI JS, cœur Rust, FFI natif par plateforme — chaque frontière passe par un pont IPC.',
  } as Bi<string>,
  usTag: { en: 'Nucleus', fr: 'Nucleus' } as Bi<string>,
  usCap: {
    en: 'UI, business logic, OS calls, packaging — same language, same mindset, same call graph.',
    fr: 'UI, logique métier, appels OS, packaging — même langage, même mentalité, même graphe d\'appel.',
  } as Bi<string>,
};

// =====================================================================
// Toolkits
// =====================================================================
export const toolkitsT = {
  eyebrow: { en: 'Four native looks', fr: 'Quatre looks natifs' } as Bi<string>,
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
    en: 'Write your UI once in Compose, render it in the desktop style of your choice — macOS, Windows 11 Fluent, Ubuntu Yaru, or IntelliJ Jewel. Each toolkit ships with a matching DecoratedWindow. macOS and Yaru are made by Nucleus; Jewel is JetBrains\' official toolkit (the go-to for cross-platform IDE-like apps); Fluent comes from the open-source community.',
    fr: 'Écris ton UI une fois en Compose, affiche-la dans le style desktop de ton choix — macOS, Windows 11 Fluent, Ubuntu Yaru ou IntelliJ Jewel. Chaque toolkit embarque un DecoratedWindow assorti. macOS et Yaru sont faits par Nucleus ; Jewel est le toolkit officiel de JetBrains (le choix naturel pour les apps de type IDE cross-platform) ; Fluent vient de la communauté open-source.',
  } as Bi<string>,
  isNew: { en: 'New · 2.0', fr: 'Nouveau · 2.0' } as Bi<string>,
  macOsName: { en: 'macOS Tahoe', fr: 'macOS Tahoe' } as Bi<string>,
  fluentOs: { en: 'Windows 11', fr: 'Windows 11' } as Bi<string>,
  yaruStyle: { en: 'GTK · LibAdwaita', fr: 'GTK · LibAdwaita' } as Bi<string>,
  yaruOs: { en: 'Ubuntu · GNOME', fr: 'Ubuntu · GNOME' } as Bi<string>,
  jewelStyle: { en: 'IntelliJ Platform', fr: 'IntelliJ Platform' } as Bi<string>,
  jewelOs: { en: 'Cross-platform tooling', fr: 'Outils multiplateformes' } as Bi<string>,
  footnote: {
    en: React.createElement(React.Fragment, null,
      'Pick one per OS. Or mix freely — every toolkit works on every platform, so you can ship a Fluent build on macOS while you prototype its native look. Your ',
      React.createElement('code', null, 'DecoratedWindow'),
      ' stays the same Composable either way.',
    ),
    fr: React.createElement(React.Fragment, null,
      'Choisis-en un par OS. Ou mélange librement — chaque toolkit fonctionne sur chaque plateforme, donc tu peux livrer un build Fluent sur macOS pendant que tu prototypes son look natif. Ton ',
      React.createElement('code', null, 'DecoratedWindow'),
      ' reste le même Composable, dans tous les cas.',
    ),
  } as Bi,
  // Preview UI strings
  pv_settings: { en: 'Settings', fr: 'Paramètres' } as Bi<string>,
  pv_settingsNucleus: { en: 'Settings — Nucleus Demo', fr: 'Paramètres — Démo Nucleus' } as Bi<string>,
  pv_general: { en: 'General', fr: 'Général' } as Bi<string>,
  pv_appearance: { en: 'Appearance', fr: 'Apparence' } as Bi<string>,
  pv_network: { en: 'Network', fr: 'Réseau' } as Bi<string>,
  pv_darkMode: { en: 'Dark mode', fr: 'Mode sombre' } as Bi<string>,
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
    en: "Nucleus is the only desktop framework where the same Kotlin code ships two ways: as a GraalVM native image — for instant cold start and a tiny resident set — or on a modern JDK with AOT cache, where HotSpot's JIT delivers throughput approaching C++ and Rust on hot paths. Same source. Same build. Two runtimes.",
    fr: "Nucleus est le seul framework desktop où le même code Kotlin se livre de deux façons : en image native GraalVM — pour un démarrage à froid instantané et une empreinte minuscule — ou sur un JDK moderne avec cache AOT, où le JIT de HotSpot approche la perf de C++ et Rust sur les chemins chauds. Même source. Même build. Deux runtimes.",
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
    fr: 'Toute ton app est compilée AOT en binaire autonome. Pas de démarrage JVM, pas de chargement de classes — le process est vivant en une demi-seconde. La plus petite empreinte mémoire du marché.',
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
  aotTagline: { en: 'JIT-blazing throughput. Normal start.', fr: 'Débit JIT explosif. Démarrage normal.' } as Bi<string>,
  aotDesc: {
    en: "HotSpot's C2 JIT is the most mature compiler ever built. With JDK 25's AOT cache priming the class metadata, you skip the warm-up — and once your hot paths get profiled, throughput approaches what C++ and Rust deliver.",
    fr: "Le JIT C2 de HotSpot est le compilateur le plus mûr jamais construit. Avec le cache AOT de JDK 25 qui amorce les métadonnées de classes, tu sautes le warm-up — et une fois tes chemins chauds profilés, le débit approche ce que C++ et Rust offrent.",
  } as Bi<string>,
  aotThruLabel: { en: '≈ C++ / Rust on hot paths', fr: '≈ C++ / Rust sur les chemins chauds' } as Bi<string>,
  aotThruNote: { en: 'HotSpot C2 · escape analysis · vectorization', fr: 'HotSpot C2 · escape analysis · vectorisation' } as Bi<string>,
  aotBest1: { en: 'Long-running apps', fr: 'Apps long-running' } as Bi<string>,
  aotBest2: { en: 'Data-heavy workloads', fr: 'Charges de données lourdes' } as Bi<string>,
  aotBest3: { en: 'IDE-like tools', fr: 'Outils de type IDE' } as Bi<string>,
  aotBest4: { en: 'Reflection-heavy code', fr: 'Code à forte réflexion' } as Bi<string>,
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
    en: 'Win32 ITaskbarList3. NSUserNotifications. freedesktop D-Bus. Carbon. ScreenCaptureKit. Every desktop API ever shipped is its own tiny ordeal — different language, different threading model, different conventions. Nucleus wraps every one in a Kotlin function that feels obvious. The result: a cross-platform abstraction simpler than the original, on every platform.',
    fr: 'Win32 ITaskbarList3. NSUserNotifications. freedesktop D-Bus. Carbon. ScreenCaptureKit. Chaque API desktop jamais livrée est son propre petit calvaire — langage différent, modèle de threading différent, conventions différentes. Nucleus enveloppe chacune dans une fonction Kotlin qui paraît évidente. Résultat : une abstraction multiplateforme plus simple que l\'originale, sur chaque plateforme.',
  } as Bi<string>,
  exNotification: { en: 'Notification', fr: 'Notification' } as Bi<string>,
  exTray: { en: 'System tray', fr: 'Zone de notification' } as Bi<string>,
  exHotkey: { en: 'Global hotkey', fr: 'Raccourci global' } as Bi<string>,
  exScheduler: { en: 'Background tasks', fr: 'Tâches en arrière-plan' } as Bi<string>,
  exUpdate: { en: 'Auto-update', fr: 'Mise à jour auto' } as Bi<string>,
  exTaskbar: { en: 'Dock / taskbar', fr: 'Dock / barre des tâches' } as Bi<string>,
  nativeApi: { en: 'Native API', fr: 'API native' } as Bi<string>,
  threadingNote: { en: 'Threading model: yours to figure out', fr: 'Modèle de threading : à toi de te débrouiller' } as Bi<string>,
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
    fr: 'Fenêtre décorée, consciente du mode sombre, mise à jour automatique. La démo est livrée avec le source complet — clone, build, et remplace.',
  } as Bi<string>,
  copied: { en: 'Copied', fr: 'Copié' } as Bi<string>,
  copy: { en: 'Copy', fr: 'Copier' } as Bi<string>,
  meta: {
    en: 'Detects your architecture · downloads · installs · launches.',
    fr: 'Détecte ton architecture · télécharge · installe · lance.',
  } as Bi<string>,
  readGuide: { en: 'Or read the install guide →', fr: 'Ou lis le guide d\'installation →' } as Bi<string>,
};

// =====================================================================
// Footer
// =====================================================================
export const footerT = {
  tagline: {
    en: 'The Kotlin framework for native desktop apps. Built on Compose, GraalVM and Tao.',
    fr: 'Le framework Kotlin pour les apps desktop natives. Bâti sur Compose, GraalVM et Tao.',
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
  version: { en: 'v2.0.0 · Tao backend preview', fr: 'v2.0.0 · backend Tao en preview' } as Bi<string>,
};
