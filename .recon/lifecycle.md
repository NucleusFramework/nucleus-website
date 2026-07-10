# Lifecycle cluster — fact-check report

Source root: `/home/elie-gambache/IdeaProjects/Nucleus`
Docs root: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

All 11 source modules have Kotlin sources under `src/main/kotlin` and publish a
`dev.nucleusframework:nucleus.<name>` coordinate (verified via `coordinates(...)` in each
`build.gradle.kts`). Package root is `dev.nucleusframework.*` in every module.

## Module inventory

| Module | Artifact | Key public types |
|---|---|---|
| autolaunch | `dev.nucleusframework:nucleus.autolaunch` | `AutoLaunch` (object), `AutoLaunchState`, `AutoLaunchResult`, `AutoLaunchConfig` |
| scheduler | `dev.nucleusframework:nucleus.scheduler` | `DesktopTaskScheduler`, `DesktopTask`, `TaskRequest`, `TaskRegistry`, `TaskId`, `TaskContext`, `TaskResult`, `TaskInfo`, `CronExpression`, `RetryPolicy`, `Constraints`, `NetworkType`, `ExistingTaskPolicy`, `DesktopBootReceiver`, `LastTaskResult` |
| scheduler-testing | `dev.nucleusframework:nucleus.scheduler-testing` | `TestTaskRunner`, `TestDesktopTaskScheduler`, `TestConstraintChecker` |
| service-management-macos | `dev.nucleusframework:nucleus.service-management-macos` | `AppServiceManager`, `AppService` (`MainApp`/`LoginItem`/`Agent`/`Daemon`), `AppServiceStatus`, `AppServiceException` |
| energy-manager | `dev.nucleusframework:nucleus.energy-manager` | `EnergyManager` (object) + nested `EnergyManager.Result` |
| taskbar-progress | `dev.nucleusframework:nucleus.taskbar-progress` | `TaskbarProgress` (object) + `State`, `AttentionType` |
| taskbar-progress-tao | `dev.nucleusframework:nucleus.taskbar-progress-tao` | `TaoTaskbarProgress`, `NucleusTaskbarProgress`, `NucleusWindow.*` extensions, `rememberTaoTaskbarProgress`, `TaoTaskbarProgressScope` |
| launcher-macos | `dev.nucleusframework:nucleus.launcher-macos` | `MacOsDockMenu`, `DockMenuItem`, `DockMenuListener` |
| launcher-windows | `dev.nucleusframework:nucleus.launcher-windows` | `WindowsOverlayIcon`, `WindowsJumpListManager`, `WindowsThumbnailToolbar`, `WindowsBadgeManager`, `StockIcon`, `BadgeGlyph`, `JumpListItem`, `JumpListCategory`, `KnownCategory`, `TaskbarIconSource`, `ThumbnailToolbarButton`, `ThumbBarClickListener` |
| launcher-linux | `dev.nucleusframework:nucleus.launcher-linux` | `LinuxLauncherEntry`, `LinuxQuicklist`, `LauncherProperties`, `DbusmenuItem` |
| fs-watcher | `dev.nucleusframework:nucleus.fs-watcher` | `FsWatchers`, `FsWatcher`, `FsWatcherConfig`, `FsWatchEvent`, `FsWatchRegistration`, `FsWatchBackendStrategy`, `FsWatchDeliveryMode`, `FsWatchError`, `FsWatchException`, `FsWatchSource` |

---

## Per-page findings

### index.mdx — OK
High-level overview; module/link references consistent with existing pages. No API-level claims to falsify.

### auto-launch.mdx — minor-fix
- Enum values are EXACT matches. `AutoLaunchState`: `ENABLED`, `DISABLED`, `DISABLED_BY_USER`, `DISABLED_BY_POLICY`, `ENABLED_BY_POLICY`, `UNSUPPORTED` (see `AutoLaunchState.kt`). `AutoLaunchResult`: `OK`, `UNCHANGED`, `BLOCKED_BY_USER`, `BLOCKED_BY_POLICY`, `UNSUPPORTED`, `ERROR`. Both correct.
- `AutoLaunch` methods all exist: `state()`, `enable()`, `disable()`, `openSystemSettings()`, `wasStartedAtLogin(args)`, `diagnostic()`, `preload()` (`AutoLaunch.kt`). (Source also has undocumented `isEnabled()` and `isUserLocked()` — harmless.)
- `AutoLaunchConfig` props match: `taskId`, `executablePath`, `autostartArgument`, `registryValueName`, `backgroundReason`.
- ISSUE (count): TL;DR line 52 says "Five states:" then lists SIX values. Should say "Six states".

### scheduler.mdx — minor-fix
- `DesktopTaskScheduler` methods verified: `isAvailable()`, `enqueue()`, `cancel()`, `cancelAll()`, `isScheduled()`, `getTaskInfo()`, `getAllTasks()`, `getInstance()`. Correct.
- `TaskRequest` factories `periodic/calendar/onBoot` + builder (`inputData`, `retryPolicy`, `runImmediately`, `constraints`, `existingTaskPolicy`) — correct. 15-min minimum enforced in `periodic()`. Correct.
- `CronExpression`: `everyDayAt`, `everyWeekdayAt(time)`, `everyWeekdayAt(day, time)`, `everyHour()` — all present. Correct.
- `TaskResult`: `Success`, `Failure(message)`, `Retry(message)` — correct.
- `ExistingTaskPolicy`: `KEEP` (default), `UPDATE_DATA`, `REPLACE` — correct.
- `NetworkType`: `NOT_REQUIRED`, `CONNECTED`, `UNMETERED` — correct.
- `RetryPolicy.ExponentialBackoff(initialDelay, maxAttempts)` / `Linear(delay, maxAttempts)` — example is correct.
- ISSUE (wording): reference table row "retryPolicy(...)" says "`Linear` or `Exponential`". The type is `ExponentialBackoff`, not `Exponential`.

### service-management.mdx — needs-rewrite-facts
- `AppServiceStatus` enum values are WRONG CASE. Doc uses `NotRegistered`, `Enabled`, `RequiresApproval`, `NotFound` (TL;DR, quickstart lines ~348-349, reference). Source (`AppServiceStatus.kt`) is `NOT_REGISTERED`, `ENABLED`, `REQUIRES_APPROVAL`, `NOT_FOUND`. Quickstart `AppServiceStatus.Enabled` / `.RequiresApproval` will not compile.
- Method name WRONG: doc uses `AppServiceManager.openSystemSettings()` (quickstart + reference table). Source method is `openSystemSettingsLoginItems()` (`AppServiceManager.kt:108`). No `openSystemSettings()` exists.
- Minor: `unregister(service)` actually has second param `callback: (error: String?) -> Unit = {}` and returns `Unit` (async). Doc reference says returns `Unit` / "Deactivates" — omits the callback but not wrong.
- `AppService.MainApp/LoginItem(bundleId)/Agent(label)/Daemon(label)` and `register(): Result<Unit>`, `status(): AppServiceStatus`, `isAvailable: Boolean` — all correct.

### energy-manager.mdx — OK
- All `EnergyManager` methods verified in `EnergyManager.kt`: `isAvailable()`, `enable/disableEfficiencyMode()`, `enable/disableLightEfficiencyMode()`, `enable/disableThreadEfficiencyMode()`, `keepScreenAwake()`, `releaseScreenAwake()`, `isScreenAwakeActive()`, `withEfficiencyMode { }` (suspend), `withLightEfficiencyMode { }` (suspend).
- `EnergyManager.Result(success: Boolean, errorCode: Int, message: String)` — matches doc exactly.
- macOS/Linux screen-awake claims: BACKED by native bridges (`MacOsEnergyManager.keepScreenAwake()` → `nativeKeepScreenAwake()`, `LinuxEnergyManager.keepScreenAwake()` → `nativeKeepScreenAwake()`). Note the class-level KDoc comment in `EnergyManager.kt` says "macOS/Linux: not yet implemented" for screen awake, but the platform impls DO delegate to native — the KDoc is stale, the doc page is consistent with the actual implementation.

### taskbar-progress.mdx — needs-rewrite-facts
- Method name WRONG: doc uses `TaskbarProgress.hide(window)` in quickstart (3x) and reference table. Source method is `hideProgress(window)` (`TaskbarProgress.kt:170`). No `hide()` exists.
- `TaskbarProgress.State` enum values WRONG CASE throughout (TL;DR + reference table): doc `NoProgress`, `Indeterminate`, `Normal`, `Error`, `Paused`. Source is `NO_PROGRESS`, `INDETERMINATE`, `NORMAL`, `ERROR`, `PAUSED`.
- Verified-correct methods: `isAvailable()`, `setProgress(window, value)`, `setState(window, state)`, `showProgress`, `showError(window, value=1.0)`, `showIndeterminate`, `showPaused(window, value=1.0)`, `requestAttention(window, type=AttentionType.INFORMATIONAL)`, `stopAttention(window)`. Correct.
- Undocumented: `TaskbarProgress.AttentionType` enum (`INFORMATIONAL`, `CRITICAL`) and the `type` param on `requestAttention` are not shown. Also AWT-free `*ForHwnd` variants exist and are undocumented (probably intentionally internal-ish).
- Tao extensions all verified in `NucleusTaskbarProgress.kt`: `setTaskbarProgress`, `setTaskbarState`, `showTaskbarProgress`, `showTaskbarError`, `showTaskbarIndeterminate`, `showTaskbarPaused`, `hideTaskbarProgress`, `requestTaskbarAttention`, `stopTaskbarAttention`; plus `rememberTaoTaskbarProgress(): TaoTaskbarProgressScope?`. Correct.
- `linuxDesktopFilename` override property exists. Correct.

### launcher-macos.mdx — needs-rewrite-facts
- Method names WRONG: doc uses `MacOsDockMenu.setItems(...)` and `clear()` (TL;DR, quickstart, reference). Source methods are `setDockMenu(items: List<DockMenuItem>)` and `clearDockMenu()` (`MacOsDockMenu.kt:30,68`). No `setItems`/`clear` exist — quickstart will not compile.
- Correct: `isAvailable: Boolean`, `listener: DockMenuListener?`, `DockMenuItem(id, title, enabled, children)`, `DockMenuItem.separator(id)`. `DockMenuListener` is a `fun interface`. All match `DockMenuItem.kt`.

### launcher-windows.mdx — needs-rewrite-facts
- INVENTED stock icons: doc examples use `StockIcon.MEDIA_PLAY`, `StockIcon.MEDIA_REWIND`, `StockIcon.MEDIA_FORWARD` (thumbnail-toolbar quickstart). `StockIcon.kt` has NO media-transport icons — the `MEDIA_*` entries are physical-media/disc icons (`MEDIA_CD_AUDIO`, `MEDIA_DVD`, `MEDIA_BLURAY`, ...). `MEDIA_PLAY/REWIND/FORWARD` do not exist; the example will not compile.
- Count wrong: doc says "94 Windows Shell stock icons". Actual enum has 91 entries.
- `KnownCategory` WRONG CASE: doc uses `KnownCategory.Recent` / `Frequent`. Source is `FREQUENT(1)`, `RECENT(2)` (`KnownCategory.kt`).
- Correct: `WindowsOverlayIcon.set/clear`, `WindowsJumpListManager.setCategories`, `WindowsThumbnailToolbar.setButtons`, `WindowsBadgeManager.setBadge/clear`. `TaskbarIconSource.FromStock/FromFile/FromResource` (sealed) — correct. `JumpListItem(title, arguments, description, icon, isSeparator)` + `JumpListItem.SEPARATOR` — correct (doc's param order `title, arguments, icon?, description?` differs from source `title, arguments, description, icon`, but examples use named args so OK). `BadgeGlyph` values (`NEW_MESSAGE`, `ALERT`, `BUSY`, `AWAY`, `AVAILABLE`, `ERROR`, ...) all exist. `ThumbnailToolbarButton(id, tooltip, icon, enabled, hidden, ...)` exists.

### launcher-linux.mdx — OK
- `LinuxLauncherEntry`: `isAvailable`, `appUri(desktopFileId)`, `update(appUri, LauncherProperties)`, `setCount`, `clearCount`, `setProgress`, `clearProgress`, `setUrgent`, `setUpdating` — all verified.
- `LauncherProperties(count, countVisible, progress, progressVisible, urgent, quicklist, updating)` — all nullable — exact match.
- `LinuxQuicklist(objectPath)`, `objectPath: String`, `listener: Listener?` (`fun interface Listener { onItemClicked(itemId) }`), `setMenu(items)`, `dispose()` — verified.
- `DbusmenuItem(id, label, icon, enabled, visible, type, toggleType, toggleState, shortcut, disposition, children)` + `separator(id)`; enums `ItemType(STANDARD/SEPARATOR)`, `ToggleType(NONE/CHECKBOX/RADIO)`, `Disposition(NORMAL/INFORMATIONAL/WARNING/ALERT)` — all verified. Quickstart's `Disposition.ALERT` is valid.

### single-instance.mdx — OK (not in this cluster's source set)
`SingleInstanceManager` and `Configuration` live in `core-runtime`, which is NOT one of the 11 modules assigned to this recon. Could not verify against the provided source modules. No lifecycle-cluster API is misused on the page. Fact-check of this page belongs to the core-runtime recon.

---

## Undocumented modules / features

1. **fs-watcher** — has a full public API (`FsWatchers.create()/isSupported()`, `FsWatcher` with `events: Flow<FsWatchEvent>` / `errors: Flow<FsWatchError>` / `watch(...)`, `FsWatcherConfig`, `FsWatchBackendStrategy` (`Auto`/polling), `FsWatchDeliveryMode` (`Debounced`), `FsWatchRegistration : AutoCloseable`, `FsWatchEvent` sealed, `FsWatchSource`, `FsWatchError`, `FsWatchException`) — but NO doc page anywhere under `content/docs`. Fully undocumented.
   - Suggested page: `lifecycle/fs-watcher`.

2. **scheduler-testing** — public test API (`TestTaskRunner`, `TestDesktopTaskScheduler` with virtual time / `getExecutionHistory` / `getEnqueuedRequest`, `TestConstraintChecker`) is only name-dropped in the `scheduler.mdx` Notes section; no dedicated page and no API reference.
   - Suggested page: `lifecycle/scheduler-testing` (or a "Testing" section on `lifecycle/scheduler`).

3. **taskbar-progress-tao** — documented inline within `taskbar-progress.mdx` (Tao section). Considered covered; not listed as undocumented.

## Stale (feature with no backing source)
None found. Every documented API maps to real source; the defects above are wrong names/casing/counts, not phantom features.
