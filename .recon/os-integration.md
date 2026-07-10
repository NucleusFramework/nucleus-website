# Fact-check report: os-integration cluster

Source root: `/home/elie-gambache/IdeaProjects/Nucleus`
Docs root: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

All modules publish under group `dev.nucleusframework` with artifact `nucleus.<name>` (verified via `coordinates(...)` in each `build.gradle.kts`). All install snippets in the docs use the correct coordinates.

---

## Module inventory

| Module | Kotlin sources | Artifact | Public entry points |
| --- | --- | --- | --- |
| global-hotkey | yes | `dev.nucleusframework:nucleus.global-hotkey` | `object GlobalHotKeyManager`, `enum HotKeyModifier`, `enum MediaKey`, `fun interface HotKeyListener` |
| media-control | yes | `dev.nucleusframework:nucleus.media-control` | `object MediaControlService`, `data class MediaMetadata`, `data class MediaPlaybackState`, `enum MediaPlaybackStatus`, `sealed class MediaControlEvent` |
| darkmode-detector | yes | `dev.nucleusframework:nucleus.darkmode-detector` | `interface IDarkModeDetector`, `object NoopDarkModeDetector`, `fun getPlatformDarkModeDetector()`, `@Composable fun isSystemInDarkMode()` |
| system-color | yes | `dev.nucleusframework:nucleus.system-color` | `fun isSystemAccentColorSupported()`, `@Composable fun systemAccentColor()`, `@Composable fun isSystemInHighContrast()` |
| system-info | yes | `dev.nucleusframework:nucleus.system-info` | `object SystemInfo` + `model/*` data classes |
| menu-macos | yes | `dev.nucleusframework:nucleus.menu-macos` | `@Composable fun NativeMenuBar`, `NativeMenuBarScope`, `NativeMenuScope`, `enum MenuRole`, `enum NsMenuItemState`, `sealed NsMenuItemImage`, `sealed NsMenuItemBadge`, `data class NativeKeyShortcut`, `object NativeKey` |
| freedesktop-icons | yes | `dev.nucleusframework:nucleus.freedesktop-icons` | `sealed interface FreedesktopIcon` (+ `Custom` value class, `flag()`, enums Action/Application/Animation/Category/Device/Emblem/Emote/MimeType/Place/Status) |
| sf-symbols | yes | `dev.nucleusframework:nucleus.sf-symbols` | `sealed interface SFSymbol` (+ `Custom` value class) and 22 category enums (`SFSymbolGeneral`, `SFSymbolArrows`, `SFSymbolObjectsAndTools`, …) |

---

## Per-page findings

### global-hotkey.mdx — NEEDS REWRITE (facts)

File: `global-hotkey/src/main/kotlin/dev/nucleusframework/globalhotkey/*`

1. **`HotKeyModifier.CTRL` does not exist.** Enum values are `ALT, CONTROL, SHIFT, META` (`HotKeyModifier.kt`). Doc uses `HotKeyModifier.CTRL` in Quickstart and Reference. Correct: `CONTROL`.
2. **`modifiers` is an `Int` bitmask, not a `Set`.** `register(keyCode: Int, modifiers: Int = 0, description: String? = null, listener: HotKeyListener)` (`GlobalHotKeyManager.kt:105`). Doc passes `modifiers = setOf(HotKeyModifier.CTRL, HotKeyModifier.SHIFT)`. Correct form: `modifiers = HotKeyModifier.CONTROL + HotKeyModifier.SHIFT` (the enum defines `operator fun plus` → `Int`).
3. **The listener takes two `Int` params, not one.** `HotKeyListener.onHotKey(keyCode: Int, modifiers: Int)` (`HotKeyListener.kt`). Doc lambda `{ _ -> println(...) }` and `{ showQuickSwitcher() }` imply 0/1 params. Real SAM signature is `(keyCode, modifiers) -> Unit`.
4. **Failure return value is `-1`, not `0L`.** `register` returns `-1` "on failure" (KDoc + `ensureReady()` returns `-1`, `GlobalHotKeyManager.kt:103,111`). The doc's "Conflict detection" section claims `register(...)` returns `0L`. Wrong sentinel.
5. **`MediaKey` names are all wrong and the set is invented.** Actual values: `PLAY_PAUSE(0xB3), STOP(0xB2), NEXT_TRACK(0xB0), PREV_TRACK(0xB1)` (`MediaKey.kt`). Doc uses `MediaKey.Play`, `MediaKey.Next`, and claims coverage of "Play, Pause, Next, Prev, VolumeUp, VolumeDown, Mute". There is no Volume/Mute/Pause/Toggle key. Correct references: `MediaKey.PLAY_PAUSE`, `MediaKey.NEXT_TRACK`, etc.
6. **Media keys are not supported on macOS.** `register(mediaKey, listener)` returns `-1` with `lastError = "Media keys are not supported on macOS"` on macOS (`GlobalHotKeyManager.kt:136`). Doc implies media keys work everywhere.

Correct and unchanged: `initialize(): Boolean`, `shutdown()`, `unregister(handle): Boolean`, `val isAvailable: Boolean`, `object GlobalHotKeyManager`.

### media-control.mdx — NEEDS REWRITE (facts)

File: `media-control/src/main/kotlin/dev/nucleusframework/media/control/*`

1. **`MediaMetadata` field names wrong.** Actual: `MediaMetadata(title, artist, album, coverUrl, duration)` all nullable (`MediaMetadata.kt`). Doc uses `artUri` (→ `coverUrl`) and `durationUs` (→ `duration`).
2. **Duration units are milliseconds, not microseconds.** KDoc: "duration in milliseconds"; `setMetadata` passes `durationMs = metadata.duration` (`MediaControlService.kt:67`). Doc uses `durationUs = 10 * 60 * 1_000_000L` (microseconds). Same for the `Us` naming throughout.
3. **`MediaPlaybackState` shape wrong.** Actual: `MediaPlaybackState(status: MediaPlaybackStatus, positionMs: Long? = null)` (`MediaPlaybackStatus.kt`). Doc uses `MediaPlaybackState(status = …, positionUs = …, rate = 1.0)`. There is no `rate` field and no `positionUs` (it is `positionMs`).
4. **`MediaPlaybackStatus.Playing` casing wrong.** Enum values: `STOPPED, PAUSED, PLAYING`. Correct: `MediaPlaybackStatus.PLAYING`.
5. **`MediaControlEvent.Seek` / `event.toUs` are invented.** `sealed class MediaControlEvent` variants: `Play, Pause, Toggle, Next, Previous, Stop, SeekBy(offsetMs), SetPosition(positionMs), SetVolume(volume), OpenUri(uri), Raise, Quit` (`MediaControlEvent.kt`). No `Seek` and no `toUs`. Correct: `is MediaControlEvent.SetPosition -> player.seekTo(event.positionMs)` or `is MediaControlEvent.SeekBy -> ...`.
6. **Threading claim is wrong.** Doc: "Incoming events arrive on the bridge thread — bounce to your audio thread or main loop yourself." Actual: `attach` dispatches on the Swing EDT via `SwingUtilities.invokeLater` and the KDoc says "safe to mutate Compose/Swing state directly" (`MediaControlService.kt:96,107`).

Correct and unchanged: `object MediaControlService`, `isAvailable()`, `configure()` (defaulted `dbusName`/`displayName`), `setMetadata`, `setPlaybackState`, `setVolume`, `attach`, `detach`. The per-platform event capability callout roughly matches the source KDoc at `MediaControlService.kt:99-102`.

### dark-mode.mdx — NEEDS REWRITE (facts)

File: `darkmode-detector/src/main/kotlin/dev/nucleusframework/darkmodedetector/*`

1. **`IDarkModeDetector.isDark: StateFlow<Boolean>` does not exist.** The interface (`DarkModeDetector.kt`) is:
   ```kotlin
   interface IDarkModeDetector {
       fun isDark(): Boolean
       fun registerListener(listener: Consumer<Boolean>)
       fun removeListener(listener: Consumer<Boolean>)
   }
   ```
   There is no `StateFlow`, no coroutines API. Doc's TL;DR (`isDark: StateFlow<Boolean>`) and "No … JNA" plus StateFlow framing are false.
2. **Imperative example is entirely invented.** Doc uses `detector.start()`, `detector.isDark.collect { … }`, `detector.stop()`. None exist. Real usage: `isDark()` for a one-shot read and `registerListener(Consumer)` / `removeListener(Consumer)` for change notifications.

Correct and unchanged: `object NoopDarkModeDetector`, `fun getPlatformDarkModeDetector(): IDarkModeDetector`, `@Composable fun isSystemInDarkMode(): Boolean`.

### system-color.mdx — OK

File: `system-color/src/main/kotlin/dev/nucleusframework/systemcolor/SystemColor.kt`
All three referenced signatures match exactly: `fun isSystemAccentColorSupported(): Boolean`, `@Composable fun systemAccentColor(): Color?`, `@Composable fun isSystemInHighContrast(): Boolean`.

### system-info.mdx — MINOR FIX

File: `system-info/src/main/kotlin/dev/nucleusframework/systeminfo/*`
Every `SystemInfo` method referenced exists with matching return type: `osInfo()`, `memoryInfo()`, `cpuInfo(): CpuGlobalInfo?`, `disks()`, `gpus()`, `batteryInfo()`, `networks()`, `connectivityInfo()`, `processes()`, `process(pid: Long)`, `users()`, `idleTime(): Long`, `isAvailable()`. Field references verified: `OsInfo.longOsVersion/cpuArch/kernelVersion`, `CpuInfo.brand/frequency/cpuUsage`, `GpuInfo.name/dedicatedVideoMemory`, `BatteryInfo.stateOfCharge/state`, `BatteryState.Discharging`.

1. Minor: the OS reference comment lists `hostname`; the actual field is `hostName` (`model/OsInfo.kt:9`).

### menu-macos.mdx — NEEDS REWRITE (facts)

File: `menu-macos/src/main/kotlin/dev/nucleusframework/menu/macos/NativeMenuBar.kt`, `NsMenuTypes.kt`, `NsMenuItemBadge.kt`

The DSL builder functions are **PascalCase**, but the doc uses camelCase throughout:

1. **`menu("File") { }` → `Menu("File") { }`** (`NativeMenuBarScope.Menu`, line 94).
2. **`item(...) { }` → `Item(...) { }`** (`NativeMenuScope.Item`, line 181).
3. **`separator()` → `Separator()`** (line 317).
4. **`submenu("Find") { }` → `Menu("Find") { }`** — nested submenus reuse the `Menu` builder inside `NativeMenuScope` (line 339). There is no `submenu` function.
5. **`menu("Help", role = MenuRole.Help)` — no `role` parameter exists.** Well-known menus use dedicated builders `MenuWindow(...)` (line 119) and `MenuHelp(...)` (line 138). `Menu` has no `role` param.
6. **`NsMenuItemState.On` / `.Off` → `.ON` / `.OFF`.** Enum values are `OFF, ON, MIXED` (`NsMenuTypes.kt`).
7. **`NsMenuItemBadge.Counter(unreadCount)` → `NsMenuItemBadge.Count(unreadCount)`.** Variants: `Count, Text, Alerts, NewItems, Updates` (`NsMenuItemBadge.kt`). No `Counter`.

Correct and unchanged: `@Composable fun NativeMenuBar { }`; `NsMenuItemImage.SystemSymbol(...)`; SF Symbol constants used (`SFSymbolObjectsAndTools.DOCUMENT_BADGE_PLUS`, `.FOLDER`, `SFSymbolGeneral.GEAR`) all exist; `NativeKeyShortcut(key, command=true, shift=false, option=false, control=false, function=false)`; `enum MenuRole { None, Window, Help }`. Note the doc's checkable example `item("Dark mode", state = …)` — `Item` does accept a `state` param so the parameter is valid, but the function name casing (`item`) is still wrong and idiomatic API is `CheckboxItem(...)`.

### freedesktop-icons.mdx — OK

File: `freedesktop-icons/src/main/kotlin/dev/nucleusframework/freedesktop/icons/FreedesktopIcon.kt`
`sealed interface FreedesktopIcon`, `value class Custom`, `fun flag(countryCode)` → `"flag-<lowercased>"`, and the categories in the doc table (`Action`, `Status`, `Device`, `Application`, `MimeType`, `Place`, `Emblem`, `Custom`) all exist. Spot-checked constants exist: `Status.DIALOG_INFORMATION`, `Action.DOCUMENT_OPEN`, `Device.PRINTER`.
- Minor (not an error): source also defines three additional category enums not mentioned in the doc — `Animation`, `Category`, `Emote`.

### system-tray.mdx / tray-menu-dsl.mdx / tray-app.mdx — CANNOT VERIFY FROM THIS SOURCE ROOT

There is **no tray / composenativetray module** in the Nucleus source tree (checked full module list; only `taskbar-progress` and `taskbar-progress-tao` are tray-adjacent). All three pages explicitly state the code ships from the separate repo `NucleusFramework/ComposeNativeTray`, artifact `dev.nucleusframework:composenativetray`. The APIs they document (`Tray()`, `Item`, `CheckableItem`, `SubMenu`, `Divider`, `TrayApp`, `TrayAppState`, `rememberTrayAppState`, `ExperimentalTrayAppApi`, `TrayWindowDismissMode`) cannot be checked against this repository. These are **not stale-remove** — they are intentionally external — but they are outside the fact-check surface for this source root and need verification against the ComposeNativeTray repo separately.

Note: `tray-app.mdx` references the Nucleus Gradle DSL `nucleus { application { nativeDistributions { macOS { infoPlist { extraKeysRawXml = … } } } } }` for `LSUIElement`. This belongs to the gradle-plugin cluster and was not verified here.

---

## Undocumented modules in this cluster

### sf-symbols — no doc page

Real sources exist (`sf-symbols/src/main/kotlin/dev/nucleusframework/sfsymbols/*`, artifact `dev.nucleusframework:nucleus.sf-symbols`): `sealed interface SFSymbol` with `val symbolName`, a `value class Custom`, and 22 category enums (`SFSymbolGeneral`, `SFSymbolArrows`, `SFSymbolObjectsAndTools`, `SFSymbolMedia`, `SFSymbolPower`, `SFSymbolHealth`, `SFSymbolStatus`, `SFSymbolDevices`, `SFSymbolWeather`, etc.). It is only referenced transitively from `menu-macos.mdx` but has no page of its own.
Suggested page: `os/sf-symbols`.

(Other repo-wide suspects — fs-watcher, scheduler-testing, taskbar-progress-tao, native-http-okhttp/ktor — fall outside the 8 modules assigned to this cluster and are not analysed here.)
