# Toolkits cluster — fact-check report

Source root: `/home/elie-gambache/IdeaProjects/Nucleus`
Docs root: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

## 1. Source modules

All three assigned modules have real Kotlin sources under `src/main/kotlin` and are published.

| Module | Kotlin sources | Artifact coordinate | Package |
|---|---|---|---|
| decorated-window-jewel | yes | `dev.nucleusframework:nucleus.decorated-window-jewel` | `dev.nucleusframework.window.jewel` |
| decorated-window-material2 | yes | `dev.nucleusframework:nucleus.decorated-window-material2` | `dev.nucleusframework.window.material2` |
| decorated-window-material3 | yes | `dev.nucleusframework:nucleus.decorated-window-material3` | **`dev.nucleusframework.window.material`** (note: NOT `.material3`) |

### decorated-window-jewel — public API
- `ApplicationScope.JewelDecoratedWindow(...)` and `NucleusApplicationScope.JewelDecoratedWindow(...)` (two overloads) — `JewelDecoratedWindow.kt`
- `JewelDecoratedDialog(...)` and `NucleusApplicationScope.JewelDecoratedDialog(...)` — `JewelDecoratedDialog.kt`
- `DecoratedWindowScope.JewelTitleBar(...)` — `JewelTitleBar.kt`
- `DecoratedDialogScope.JewelDialogTitleBar(...)` — `JewelDialogTitleBar.kt`
- `@Composable fun rememberJewelWindowStyle(): DecoratedWindowStyle` — `JewelColorMapping.kt:25` (public)
- `@Composable fun rememberJewelTitleBarStyle(): TitleBarStyle` — `JewelColorMapping.kt:49` (public)

### decorated-window-material2 — public API (package `...window.material2`)
- `fun MaterialDecoratedWindow(...)` (no receiver) and `NucleusApplicationScope.MaterialDecoratedWindow(...)` — `MaterialDecoratedWindow.kt:20,70`
- `MaterialDecoratedDialog(...)` — `MaterialDecoratedDialog.kt:15`
- `DecoratedWindowScope.MaterialTitleBar(...)` — `MaterialTitleBar.kt:26`
- `DecoratedDialogScope.MaterialDialogTitleBar(...)` — `MaterialDialogTitleBar.kt:18`
- `internal fun rememberMaterialWindowStyle(colors: Colors): DecoratedWindowStyle` — `MaterialColorMapping.kt:24` — **INTERNAL, takes `Colors`, not public**
- `internal fun rememberMaterialTitleBarStyle(colors: Colors): TitleBarStyle` — `MaterialColorMapping.kt:41` — **INTERNAL**

### decorated-window-material3 — public API (package `...window.material`)
- `ApplicationScope.MaterialDecoratedWindow(...)` and `NucleusApplicationScope.MaterialDecoratedWindow(...)` — `MaterialDecoratedWindow.kt:29,83`
- `ApplicationScope.MaterialDecoratedDialog(...)` and `NucleusApplicationScope.MaterialDecoratedDialog(...)` — `MaterialDecoratedDialog.kt:20,65`
- `DecoratedWindowScope.MaterialTitleBar(...)` — `MaterialTitleBar.kt:31`
- `DecoratedDialogScope.MaterialDialogTitleBar(...)` — `MaterialDialogTitleBar.kt:18`
- `@Composable fun rememberMaterialWindowStyle(colorScheme: ColorScheme): DecoratedWindowStyle` — `MaterialColorMapping.kt:25` (public)
- `@Composable fun rememberMaterialTitleBarStyle(colorScheme: ColorScheme): TitleBarStyle` — `MaterialColorMapping.kt:39` (public)

### Referenced supporting modules (for macOS/Fluent/Yaru pages)
- `decorated-window-tao` → `enum class MacOSStyle { Auto, Classic, Modern }` (`tao/MacOSStyle.kt:12`). Applied only at window construction via the `macOSStyle: MacOSStyle = MacOSStyle.Classic` parameter of the Tao `DecoratedWindow` (`tao/DecoratedWindow.kt:115`). **There is no `setMacOSStyle(...)` method and no `Liquid`/`Default`/`HudWindow` values anywhere in the repo.**
- `decorated-window-core`:
  - `fun Modifier.macOSLargeCornerRadius(enabled: Boolean = true)` — `TitleBarModifiers.kt:78` ✓
  - `fun Modifier.newFullscreenControls(newControls: Boolean = true)` — `TitleBarModifiers.kt:23` ✓
  - `fun windowsTitleBarIcons(isDark: Boolean = LocalIsDarkTheme.current): WindowsTitleBarIconSet` — `utils/windows/WindowsTitleBarIconSet.kt:45` ✓
  - `object WindowsControlButtonIcons` with `ImageVector` extension vals `.Close`, `.Maximize`, `.Minimize`, `.Restore` (plus Dark/Hover/Inactive variants) ✓ — note these are `ImageVector`, not `Painter`.
  - `enum class LinuxTitleBarButton { CLOSE, MINIMIZE, MAXIMIZE }` — `utils/linux/LinuxButtonLayout.kt:20` (UPPERCASE)
  - `data class LinuxButtonLayout(...)`; `fun rememberLinuxButtonLayout(): LinuxButtonLayout` — `LinuxButtonLayout.kt:32,150` ✓
  - `fun linuxTitleBarIcons(...): LinuxTitleBarIconSet` — `utils/linux/LinuxTitleBarIconSet.kt:36` ✓
  - `object GnomeControlButtonsIcons` — `icons/linux/gnome/GnomeControlButtonsIcons.kt:3` ✓
  - `enum class ControlButtonsDirection { Auto, ... }` — `ControlButtonsDirection.kt:18` ✓
- `decorated-window-awt` → `fun Modifier.windowDragHandler(window: Window): Modifier` — `AwtTitleBar.kt:49` ✓ (exists; lives in the AWT module, not core)
- `nucleus-application` → `NucleusWindow.unsafe: NucleusWindowUnsafe` and `unsafe.taoWindow` accessor exist (`NucleusWindow.kt:74`, used in `TaoDecoratedWindowAdapter.kt:72`). So `nucleusWindow.unsafe.taoWindow` is valid.

**No `decorated-window-macos` / `decorated-window-macos26` / `decorated-window-fluent` / `decorated-window-yaru` module exists in the source tree** — only jewel, material2, material3 plus the backend modules (awt/jbr/jni/tao/core). The macOS/Fluent/Yaru pages document toolkits that are not yet shipped (the pages themselves flag this as "announced for Nucleus 2.0").

## 2. Per-page findings

### toolkit-jewel.mdx — OK
Every referenced symbol matches source: `JewelDecoratedWindow`, `JewelDecoratedDialog`, `JewelTitleBar`/`JewelDialogTitleBar`, `rememberJewelWindowStyle(): DecoratedWindowStyle`, `rememberJewelTitleBarStyle(): TitleBarStyle`. Package (`dev.nucleusframework.window.jewel`) and artifact (`nucleus.decorated-window-jewel`) correct.

### toolkit-material.mdx — MINOR-FIX
- **Line 55**: import `dev.nucleusframework.window.material3.*` is WRONG. The Material 3 module's package is `dev.nucleusframework.window.material` (see `MaterialDecoratedWindow.kt:1`). Should be `import dev.nucleusframework.window.material.*`. This code sample will not compile as written.
- **Lines 93-98 ("How it works")**: claims "both modules expose `remember*Style` helpers." Only Material 3 exposes them publicly. In Material 2 both `rememberMaterialWindowStyle`/`rememberMaterialTitleBarStyle` are declared `internal` (`material2/MaterialColorMapping.kt:24,41`) and take `Colors`, not `ColorScheme`. The M2 Reference section (lines 119-122) correctly omits them; the prose over-claims.
- Line 77 import `dev.nucleusframework.window.material2.*` is correct. Artifact coordinates correct. M3 reference signatures (lines 116-117) match source.

### toolkit-macos.mdx — NEEDS-REWRITE-FACTS
- **Lines 27, 69-76, 80, 86-88, 92-93**: `MacOSStyle.Liquid`, `MacOSStyle.Default`, `MacOSStyle.HudWindow` are all invented. Actual enum: `MacOSStyle { Auto, Classic, Modern }` (`tao/MacOSStyle.kt:12`). The modern/Tahoe treatment is `MacOSStyle.Modern` (or `MacOSStyle.Auto` for OS-conditional).
- **Lines 72-76**: `taoWindow.setMacOSStyle(MacOSStyle.Liquid)` — no such method exists. The style is a construction-time parameter (`macOSStyle`) of the Tao `DecoratedWindow`, not a runtime setter.
- Line 23: `decorated-window-macos26` artifact does not exist (page already flags this with `[FACT-CHECK]`).
- Correct: `Modifier.macOSLargeCornerRadius(enabled: Boolean = true)`, `Modifier.newFullscreenControls()`, `NucleusDecoratedWindowTheme`, `TitleBarStyle`/`TitleBarColors`/`TitleBarMetrics`.

### toolkit-fluent.mdx — MINOR-FIX
- **Lines 70**: `WindowsControlButtonIcons` extensions `.Maximize`, `.Restore`, `.Minimize`, `.Close` are described as "painters" but are `ImageVector` extension vals (`icons/windows/*.kt`). Minor wording.
- `windowsTitleBarIcons(isDark): WindowsTitleBarIconSet` ✓, `Modifier.windowDragHandler(window)` ✓ (exists in `decorated-window-awt`, not core).
- Line 22: `decorated-window-fluent` artifact does not exist (page already flags this).

### toolkit-yaru.mdx — MINOR-FIX
- **Line 76**: `LinuxTitleBarButton.{Close, Minimize, Maximize}` — wrong casing. Actual values are UPPERCASE: `LinuxTitleBarButton.{CLOSE, MINIMIZE, MAXIMIZE}` (`utils/linux/LinuxButtonLayout.kt:20`).
- `rememberLinuxButtonLayout(): LinuxButtonLayout` ✓, `linuxTitleBarIcons(...): LinuxTitleBarIconSet` ✓, `GnomeControlButtonsIcons` ✓.
- Line 22: `decorated-window-yaru` artifact does not exist (page already flags this).

## 3. Undocumented modules in this cluster
None. The three toolkit source modules (jewel, material2, material3) are all documented (toolkit-jewel, toolkit-material). The listed "suspects" already have documentation elsewhere in the docs tree:
- fs-watcher → 1 page, sf-symbols → 3 pages, scheduler-testing → 1 page, taskbar-progress-tao → 2 pages, native-http-okhttp → 3 pages, native-http-ktor → 3 pages.

These are not part of the toolkits cluster and are already covered, so no new page is proposed here.

## 4. Stale references
The macOS/Fluent/Yaru toolkit pages document dedicated style packs (`decorated-window-macos26`, `decorated-window-fluent`, `decorated-window-yaru`) that have no backing source module. The pages explicitly mark these artifacts as "announced for Nucleus 2.0" and provide `[FACT-CHECK]` markers, so they are aspirational rather than accidentally stale — not recommending removal, but the concrete code samples must be corrected (see macOS `MacOSStyle` findings above).
