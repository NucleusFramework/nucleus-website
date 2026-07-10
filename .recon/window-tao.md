# Recon report — cluster **window-tao**

Fact-check of Nucleus docs against the real Kotlin source.
Source root: `/home/elie-gambache/IdeaProjects/Nucleus`
Docs root: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

---

## 1. Source modules

All six assigned modules have Kotlin sources under `src/main/kotlin` and publish under group `dev.nucleusframework`.

| Module | exists | Artifact | Notes |
|---|---|---|---|
| decorated-window-core | yes | `nucleus.decorated-window-core` | Shared types/styling. Package **`dev.nucleusframework.window`** (+ `.styling`, `.utils.*`). |
| decorated-window-awt | yes | `nucleus.decorated-window-awt` | AWT/Compose Desktop integration. |
| decorated-window-jbr | yes | `nucleus.decorated-window-jbr` | JBR AWT backend. |
| decorated-window-jni | yes | `nucleus.decorated-window-jni` | JBR-free AWT backend (JNI). |
| decorated-window-tao | yes | `nucleus.decorated-window-tao` | No-AWT Tao backend. Package `dev.nucleusframework.window.tao` (+ shared `dev.nucleusframework.window`). |
| nucleus-application | yes | `nucleus.nucleus-application` | Unified entry point. Package `dev.nucleusframework.application`. |

### Key public API surface (verified)

**decorated-window-core** (`dev.nucleusframework.window`):
- `NucleusDecoratedWindowTheme(...)`, `object DecoratedWindowDefaults`, `val LocalIsDarkTheme`, `LocalContentColor`.
- styling (`dev.nucleusframework.window.styling`): `data class TitleBarStyle`, `TitleBarColors`, `TitleBarMetrics`, `LocalTitleBarStyle`; `DecoratedWindowStyle`, `DecoratedWindowColors`, `DecoratedWindowMetrics`, `LocalDecoratedWindowStyle`.
- `interface DecoratedWindowScope`, `interface DecoratedDialogScope`, `interface TitleBarScope`.
- Modifiers: `Modifier.newFullscreenControls(newControls: Boolean = true)`, `Modifier.macOSLargeCornerRadius(enabled: Boolean = true)`.
- Enums: `WindowControlsSide`, `ControlButtonsDirection`, `LinuxTitleBarButton`.
- No `dev.nucleusframework.window.core` package exists anywhere.

**decorated-window-awt** (`dev.nucleusframework.window`):
- `fun Modifier.windowDragHandler(window: java.awt.Window): Modifier` — **the only real `windowDragHandler`, and it takes an AWT `Window`.**

**decorated-window-tao** (`dev.nucleusframework.window.tao` unless noted):
- Entry points: `fun taoApplication(content: @Composable ApplicationScope.() -> Unit)`, `interface ApplicationScope`, `object TaoApplication`.
- `fun ApplicationScope.DecoratedWindow(...)` (DecoratedWindowComposable.kt) params: `onCloseRequest, state, title, icon, minimumSize, visible, resizable, enabled, focusable, alwaysOnTop, isDialog, undecorated, popupFor, onPreviewKeyEvent, onKeyEvent, macOSStyle, compositionLocalContext, content`. **No `useNativeTitleBar` parameter.**
- `fun ApplicationScope.DecoratedDialog(...)`.
- `class TaoWindow internal constructor(...)` — imperative handle. Public listener registration is `onTrackpadGesture(listener: TrackpadGestureListener)` where `TrackpadGestureListener.onGesture(kind: Int, phase: Int, xFixed: Int, yFixed: Int, valueFixed: Int)`. Also `onTouchInput`, `onKeyEvent`, `onResized`, `onFocusChanged`, etc. **No `addTrackpadListener`.**
- `val LocalTaoWindow = staticCompositionLocalOf<TaoWindow?> { null }` (in DecoratedWindow.kt).
- `enum class MacOSStyle { Auto, Classic, Modern }` — **no `Liquid` value.** (Tao default is `Classic`.)
- `object TaoDeepLinkBridge { fun setSink(onUri: (URI) -> Unit) }`.
- `fun NativeView(...)` composable; `sealed interface NucleusPlatformView`.
- `class TaoDragAndDropPayload internal constructor(...)`; `object TaoDnDDiagnostics`.
- Accessibility: `data class TaoA11yNode`, `enum class TaoA11yRole`, `object TaoA11yFlag`, `TaoA11yExtraFlag`, `TaoA11yAction`.
- Constant objects in `NativeTaoBridge.kt`:
  - `object TaoCursorIcon { DEFAULT, TEXT, HAND, ... }`
  - `object TaoEventCode { LAUNCHED, RESIZED, ... }`
  - `object TaoTrackpadGesture { MAGNIFY=0, ROTATE=1, SMART_MAGNIFY=2 }`
  - `object TaoTrackpadPhase { BEGAN=0, CHANGED=1, ENDED=2, CANCELLED=3 }`
  - `object TaoMouseButton { LEFT, RIGHT, MIDDLE, OTHER }`
  - (also `TaoModifierMask`, `TaoKeyLocation`)

**nucleus-application** (`dev.nucleusframework.application`):
- `fun nucleusApplication(args, backend = NucleusBackend.Auto, enableSingleInstance = true, defaultLocale = null, content)`.
- `enum class NucleusBackend { Auto, Awt, Tao }`; `val LocalNucleusBackend`.
- `sealed interface NucleusApplicationScope { fun exitApplication(); val backend; aotMode; isAotTraining; isAotRuntime; fun onDeepLink(block: (URI) -> Unit) }`.
- `fun NucleusApplicationScope.DecoratedWindow(...)` and `.DecoratedDialog(...)`.
- `interface NucleusWindow { isFocused, isMinimized, isMaximized, isFullscreen; boundsOnScreen(); show(); hide(); toFront(); requestFocus(); setMinimized(minimized); setMaximized(maximized); setFullscreen(fullscreen); setAlwaysOnTop(alwaysOnTop); setMinimumSize(size); setIcon(painter); close(); focusFlow; minimizedFlow; maximizedFlow; fullscreenFlow; unsafe }`.
- `interface NucleusWindowUnsafe { awtWindow; awtDialog; taoWindow; taoHandle }`.
- `interface NucleusDecoratedWindowScope : DecoratedWindowScope { val nucleusWindow }`; `NucleusDecoratedDialogScope`.
- `val LocalNucleusWindow`.
- `fun NucleusApplicationScope.aotTraining(...)`.

**core-runtime** (referenced by docs):
- `enum class Platform { Linux, Windows, MacOS, Unknown }`; companion `Platform.Current`, `Platform.isWayland`.
- `enum class LinuxDesktopEnvironment { Gnome, KDE, XFCE, Cinnamon, Mate, Unknown }`; companion `Current`.
- `object LinuxDesktopFileDetector` — public member is `val desktopFilename: String?`; **`detect()` is `private`.**

---

## 2. Per-page findings

### tao/index.mdx — needs fixes
- **WRONG (line 83):** `MacOSStyle.Liquid` does not exist. Enum values are `Auto`, `Classic`, `Modern` (`decorated-window-tao/.../tao/MacOSStyle.kt`). "Liquid Glass" is opt-in via `macOSLargeCornerRadius()` / `MacOSStyle.Auto` + the Gradle plugin's `macOsSdkVersion`, not an enum constant.
- **WRONG (line 38):** `import dev.nucleusframework.window.core.*` — no such package. Core is `dev.nucleusframework.window` (styling types live in `dev.nucleusframework.window.styling`).
- OK: `nucleusWindow.unsafe.taoWindow`, `TaoDeepLinkBridge.setSink { uri -> }`, `LocalTaoWindow`, `TaoWindow`, `NativeView`, `taoApplication { }`, and the input-constant objects `TaoCursorIcon`/`TaoTrackpadGesture`/`TaoTrackpadPhase`/`TaoMouseButton`/`TaoEventCode` all exist.

### tao/decorated-window.mdx — needs rewrite (facts)
- **INVENTED API (TL;DR lines 12-13; Notes line 132):** `useNativeTitleBar = false/true`. No such parameter on `DecoratedWindow` (neither `nucleus-application` nor `decorated-window-tao`). Grep for `useNativeTitleBar|NativeTitleBar` across all three window modules returns nothing.
- **WRONG (line 42):** `import dev.nucleusframework.window.core.*` — wrong package (see above).
- **WRONG / misleading (TL;DR line 14 & Useful-modifiers line 123):** `Modifier.windowDragHandler(window)`. The only real `windowDragHandler` is in `decorated-window-awt` and takes an AWT `java.awt.Window`; it is not part of the Tao public surface. On Tao, drag hit-testing is internal (`Modifier.titleBarHitTestHandler(window: TaoWindow)` in `TitleBar.kt`) and handled by the `TitleBar` automatically.
- MINOR (lines 107-116): the `NucleusWindow` snippet uses param name `value` (actual `maximized`/`fullscreen`) and is an abbreviated subset — acceptable as illustration; `.taoWindow` / `.taoHandle` are correct.
- OK: `macOSLargeCornerRadius()`, `newFullscreenControls()` exist; `TitleBarStyle`/`TitleBarColors`/`TitleBarMetrics`/`NucleusDecoratedWindowTheme` in core; `NucleusDecoratedWindowScope.nucleusWindow` correct; the delegation to `dev.nucleusframework.window.tao.ApplicationScope.DecoratedWindow` matches (via `TaoDecoratedWindowAdapter`).

### tao/multi-touch.mdx — needs rewrite (facts)
- **WRONG casing (lines 80-92):** `TaoTrackpadGesture.Magnify/Rotate/SmartMagnify` → actual `MAGNIFY`, `ROTATE`, `SMART_MAGNIFY`. `TaoTrackpadPhase.Began/Changed/Ended/Cancelled` → actual `BEGAN`, `CHANGED`, `ENDED`, `CANCELLED`. (All are `const val ...: Int` in `NativeTaoBridge.kt`.) The `// …` implying extra `Magnify`-family constants is misleading — there are exactly three gesture kinds.
- **WRONG method (line 64):** `LocalTaoWindow.current?.addTrackpadListener { gesture, phase, delta -> }`. No `addTrackpadListener`. Correct API is `TaoWindow.onTrackpadGesture { kind, phase, xFixed, yFixed, valueFixed -> }` (via `fun interface TrackpadGestureListener.onGesture`, 5 Int args — not `gesture, phase, delta`).
- OK: Compose `PointerInputChange` / `PointerType` references are standard Compose APIs.

### tao/pen-stylus.mdx — ok (no false Nucleus API refs)
- Uses only Compose APIs (`PointerType.Stylus/Eraser`, `PointerInputChange.pressure/orientation`). No fabricated Nucleus symbols.
- Behavioral claims (tilt via `orientation`, Sidecar Apple Pencil, `wp_tablet_v2`) are not directly falsifiable from Kotlin (they live in the Rust JNI bridge). Note: Tao's touch listener (`TouchInputListener`) is documented in source as Windows-only, with Linux via a separate bridge — so "same event stream on every OS" is a simplification, but not a wrong API reference.

### tao/wayland.mdx — one wrong API
- **WRONG (line 27):** `LinuxDesktopFileDetector.detect()` — `detect()` is `private`. Public member is `LinuxDesktopFileDetector.desktopFilename: String?`, and it returns a `.desktop` filename, not a desktop-environment discriminator. Desktop-environment detection is `LinuxDesktopEnvironment.Current` (values `Gnome, KDE, XFCE, Cinnamon, Mate, Unknown`).
- MINOR (line 59): describing `LinuxDesktopFileDetector` as distinguishing "GNOME, KDE, Sway" conflates it with `LinuxDesktopEnvironment` (which also has no `Sway` value).
- OK: `Platform.isWayland`, `Platform.Current`, and value list `Linux | Windows | MacOS | Unknown` (line 58) all match.

### tao/hidpi.mdx — ok
- References the real `linux-hidpi` module and only standard Compose APIs (`LocalDensity`, `WindowState`) + `Platform.isWayland`. No false symbols. (Doc link path `/docs/performance/linux-hidpi` is a site-routing concern, not a source fact.)

### window/index.mdx — ok (minor)
- `NucleusWindow` snippet (lines 115-139) matches source closely; only param names differ (`value` vs `maximized`/`minimized`/`fullscreen`/`alwaysOnTop`).
- `DecoratedWindow` signature (lines 95-109) matches the real `NucleusApplicationScope.DecoratedWindow`; it omits `undecorated` and `popupFor` (acceptable abbreviation, not wrong).
- `NucleusWindowUnsafe`, `LocalNucleusWindow`, `LocalNucleusBackend` all correct.

### window/toolkits.mdx — ok (self-flagged)
- `decorated-window-jewel` / `-material2` / `-material3` coordinates verified: `nucleus.decorated-window-{jewel,material2,material3}`. Functions `JewelDecoratedWindow`, `JewelTitleBar`, `MaterialDecoratedWindow`, `MaterialTitleBar` exist.
- `decorated-window-macos26` / `-fluent` / `-yaru` have **no source modules** in the repo, but the page already flags them with `[FACT-CHECK: artifact id]` and marks them "announced for 2.0". Not a live false claim.

### start/quickstart.mdx — needs fix (wrong package)
- **WRONG (lines 56-58):** imports `dev.nucleusframework.nucleusapplication.DecoratedWindow` / `.NucleusBackend` / `.nucleusApplication`. Actual package is **`dev.nucleusframework.application`**. `dev.nucleusframework.nucleusapplication` does not exist.
- Rest (plugin id, `nucleus.application { }` DSL, tasks) is Gradle-plugin surface (cluster `gradle-dsl`), not verified here.

### start/install.mdx — ok
- No window/Tao API. Prerequisite/JDK content only.

### start/project-setup.mdx — ok
- Runtime coordinates verified: `nucleus.nucleus-application`, `nucleus.decorated-window-tao`, `nucleus.notification-common`, `nucleus.global-hotkey` all exist. Remainder is Gradle-plugin/toolchain guidance.

### start/configuration.mdx — out of scope (plugin-build)
- Entirely `nucleus { }` Gradle-plugin DSL (module `plugin-build`, cluster `gradle-dsl`). Not fact-checked against the window-tao source modules.

---

## 3. Modules with real sources but NO doc page (undocumented)

Within the assigned cluster and the known suspects (all confirmed to have `src/main/kotlin` + published coordinates):

| Module | Coordinate | What it does | Suggested doc path |
|---|---|---|---|
| taskbar-progress-tao | `nucleus.taskbar-progress-tao` | Taskbar/dock progress for the Tao backend (`TaoTaskbarProgress`, `NucleusTaskbarProgress`). | `tao/taskbar-progress` |
| decorated-window-tao (DnD) | `nucleus.decorated-window-tao` | Drag & drop on Tao: `TaoDragAndDropPayload`, `TaoDragAndDropManager`, `TaoDnDDiagnostics`. Referenced in migration doc but has no page. | `tao/drag-and-drop` |
| decorated-window-tao (a11y) | `nucleus.decorated-window-tao` | Accessibility tree bridge: `TaoA11yNode`, `TaoA11yRole`, `TaoA11yFlag`, `TaoA11yAction`. | `tao/accessibility` |
| decorated-window-tao (NativeView) | `nucleus.decorated-window-tao` | `NativeView` embedding (SwiftUI/WebView2/GTK) + `NucleusPlatformView` — only mentioned in passing. | `tao/native-views` |
| fs-watcher | `nucleus.fs-watcher` | Native filesystem watcher (`FsWatcher`, `FsWatchEvent`). | `lifecycle/fs-watcher` |
| sf-symbols | `nucleus.sf-symbols` | SF Symbols catalog for macOS. | `platform/sf-symbols` |
| scheduler-testing | `nucleus.scheduler-testing` | Test doubles for the scheduler (`TestDesktopTaskScheduler`, `TestTaskRunner`, `TestConstraintChecker`). | `scheduler/testing` |
| native-http-okhttp | `nucleus.native-http-okhttp` | OkHttp adapter over native SSL (`NativeOkHttpClient`). | `performance/native-http-okhttp` |
| native-http-ktor | `nucleus.native-http-ktor` | Ktor adapter over native SSL (`NativeSslKtorExtension`). | `performance/native-http-ktor` |

Note: `decorated-window-jbr` and `decorated-window-jni` (AWT backends) also lack dedicated pages; they are only referenced obliquely from the Tao docs.

---

## 4. Stale pages (feature with no backing source)

None of the fact-checked pages are wholesale stale. The closest is `window/toolkits.mdx` referencing `decorated-window-macos26` / `-fluent` / `-yaru`, which have no source yet — but the page explicitly marks them as unreleased/`[FACT-CHECK]`, so it is forward-looking rather than stale.
