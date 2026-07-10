# Recon: os-notifications cluster

Fact-check of Nucleus notification docs against real Kotlin source.

- SOURCE ROOT: `/home/elie-gambache/IdeaProjects/Nucleus`
- DOCS ROOT: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

## Modules

| Module | Kotlin src | Artifact coordinate |
| --- | --- | --- |
| notification-common | yes | `dev.nucleusframework:nucleus.notification-common` |
| notification-macos | yes | `dev.nucleusframework:nucleus.notification-macos` |
| notification-windows | yes | `dev.nucleusframework:nucleus.notification-windows` |
| notification-linux | yes | `dev.nucleusframework:nucleus.notification-linux` |

All four have `src/main/kotlin`. Coordinates verified in each `build.gradle.kts` `coordinates("dev.nucleusframework", "nucleus.<name>", …)`. All doc `Install` blocks quote the correct coordinates.

Note: package layout is inconsistent across modules — macOS public types live in `dev.nucleusframework.notification` (NOT `.macos`); Windows in `dev.nucleusframework.notification.windows`; Linux in `dev.nucleusframework.notification.linux`; common in `dev.nucleusframework.notification.common`.

---

## Public API surface (as actually exists)

### notification-common (`dev.nucleusframework.notification.common`)
- `object NotificationManager`: `fun isAvailable(): Boolean`, `fun initialize()`, `fun send(Notification): NotificationResult`
- `class Notification` (internal ctor) props: `title, message, largeImage, smallIcon, buttons, onActivated, onDismissed, onFailed`; `fun send(): NotificationResult`
- Top-level DSL: `fun notification(title, message="", largeImage=null, smallIcon=null, onActivated=null, onDismissed=null, onFailed=null, buttons: (NotificationButtonBuilder.()->Unit)?=null): Notification` — **title/message/callbacks are function parameters, NOT lambda-block properties**. The lambda block only exposes `button(title, onClick)`.
- `class NotificationButtonBuilder`: `fun button(title, onClick)` (max 5)
- `sealed class NotificationResult`: `data class Success(handle: NotificationHandle)`, `data class Failure(reason: String)`
- `class NotificationHandle`: `fun dismiss()`
- `enum class DismissReason`: `USER_DISMISSED, TIMED_OUT, APPLICATION, UNKNOWN`

### notification-macos (`dev.nucleusframework.notification`)
- `object NotificationCenter`: `val isAvailable: Boolean` (property); `requestAuthorization(options, callback)`, `getNotificationSettings(cb)`, **`add(request, callback?)`** (there is NO `send`), `removePendingNotifications(list)`, `removeAllPendingNotifications()`, `getPendingNotifications(cb)`, `removeDeliveredNotifications(list)`, `removeAllDeliveredNotifications()`, `getDeliveredNotifications(cb)`, `setNotificationCategories(set)`, `getNotificationCategories(cb)`, `setBadgeCount(count, cb?)`, `getBadgeCount(cb)`, `setDelegate(delegate?)`
- `interface NotificationCenterDelegate`: `willPresent(DeliveredNotification): Set<PresentationOption>`, `didReceive(NotificationResponse)`, `openSettings(DeliveredNotification?)`
- enums (values are UPPER_SNAKE_CASE): `AuthorizationStatus`, `NotificationSetting`, `AlertStyle`, `ShowPreviewsSetting`, `InterruptionLevel {PASSIVE, ACTIVE, TIME_SENSITIVE, CRITICAL}`, `AuthorizationOption {BADGE, SOUND, ALERT, CRITICAL_ALERT, PROVIDES_APP_NOTIFICATION_SETTINGS, PROVISIONAL, TIME_SENSITIVE}`, `PresentationOption {BADGE, SOUND, ALERT(dep), LIST, BANNER}`, `ActionOption`, `CategoryOption {CUSTOM_DISMISS_ACTION, …}`
- models: `DateComponents`, `sealed NotificationSound {Default, Named, DefaultCritical, CriticalNamed, DefaultCriticalWithVolume}`, `NotificationAttachment(identifier, url: String)`, `NotificationContent(...)`, `sealed NotificationTrigger {TimeInterval(interval, repeats), Calendar(dateComponents, repeats)}` — **NO `Immediate`; immediate = pass `trigger = null`**, `NotificationAction`, `TextInputNotificationAction`, `NotificationCategory`, `NotificationRequest(identifier, content, trigger?)`, `NotificationSettings`, `DeliveredNotification`, `NotificationResponse`, `PendingNotificationInfo`, `RegisteredCategoryInfo`, `RegisteredActionInfo`

### notification-windows (`dev.nucleusframework.notification.windows`)
- `object WindowsNotificationCenter`: `val isAvailable: Boolean`; `initialize(aumid?=null, appName?=null, shortcutPolicy=…): Boolean`, **`show(content, tag, group, …, callback?)`** (there is NO `send`), `showFromXml(...)`, `showSimple(...)`, `update(tag, group="", data, callback?)`, `remove(tag, group)`, `removeGroup(group)`, `clearAll()`, **`getHistory(callback: (List<HistoryEntry>, String?) -> Unit)`** (there is NO `history()` returning a list), `addListener(listener)` / `removeListener(listener)` (NO `setListener`), `uninitialize()`
- `enum class ShortcutPolicy {IGNORE, REQUIRE_NO_CREATE, REQUIRE_CREATE}`
- `interface ToastNotificationListener`: `onActivated(tag, group, arguments, userInputs)`, `onDismissed(tag, group, reason: DismissalReason)`, `onFailed(tag, group, errorCode: Int)` — **flat params, NOT event-args objects**
- DSL: `fun toast(block): ToastContent`; builders expose `visual { text/image/appLogo/heroImage/attribution/progressBar/group }`, `actions { textBox/selectionBox/button/contextMenuItem }`, `audio()`, `silentAudio()`, `header()`. **NO `snoozeButton()` / `dismissButton()` DSL functions** (only the data classes `ToastButtonSnooze`/`ToastButtonDismiss` exist, not wired into `ToastActionsBuilder`).
- `data class HistoryEntry(tag: String, group: String)` — **no `dateTime` field**
- `data class ToastNotificationData(sequenceNumber: Int = 0, values: Map<String,String> = emptyMap())` — **first positional param is `sequenceNumber`, not the map**
- enums: `ActivationType`, `AfterActivationBehavior`, `ToastScenario {DEFAULT, REMINDER, ALARM, INCOMING_CALL}`, `DismissalReason`, `AdaptiveTextStyle`, `AdaptiveTextAlign`, `AdaptiveImageCrop {DEFAULT, NONE, CIRCLE}`, `AdaptiveImageAlign`, `ImagePlacement`, `AdaptiveSubgroupTextStacking`, `ToastAudioSource`
- models: `ToastContent`, `ToastVisual`, `ToastBindingGeneric`, `AdaptiveText`, `AdaptiveImage`, `ToastGenericAppLogo/HeroImage/AttributionText`, `AdaptiveGroup`, `AdaptiveSubgroup`, `AdaptiveProgressBar`, `ToastActions`, `ToastTextBox`, `ToastSelectionBox(+Item)`, `ToastButton`, `ToastButtonSnooze`, `ToastButtonDismiss`, `ToastContextMenuItem`, `ToastAudio`, `ToastHeader`, `ToastActivatedEventArgs`, `ToastDismissedEventArgs`, `ToastFailedEventArgs`

### notification-linux (`dev.nucleusframework.notification.linux`)
- `object LinuxNotificationCenter`: `val isAvailable: Boolean`; **`notify(notification): Int`** (there is NO `send`), **`closeNotification(id: Int)`** (there is NO `close`), `getCapabilities(): List<String>`, `getServerInformation(): ServerInformation?`, `addListener(listener)` / `removeListener(listener)` (NO `setListener`)
- `interface LinuxNotificationListener`: `onClosed(notificationId: Int, reason: CloseReason)`, **`onActionInvoked(notificationId: Int, actionKey: String)`** (NOT `onAction`), `onActivationToken(notificationId: Int, token: String)` — **all IDs are `Int`, not `Long`**
- `enum class Urgency {LOW, NORMAL, CRITICAL}`, `enum class CloseReason {EXPIRED, DISMISSED, CLOSED, UNDEFINED}`
- models: `data class ImageData(width, height, rowstride, hasAlpha, bitsPerSample=8, channels, data: ByteArray)` — **plain data-class ctor, NO `fromArgb` factory / no companion**; `ServerInformation`, `NotificationAction(key, label){DEFAULT_KEY}`, `NotificationHints(urgency?, category?, desktopEntry?, imageData?, imagePath?, actionIcons?, soundFile?, soundName?, suppressSound?, resident?, transient?, x?, y?)`, `Notification(appName="", replacesId=0, appIcon?, summary, body="", actions, hints, expireTimeout=-1)`
- `sealed interface NotificationSound {Custom; enum Alert; enum Notification; enum Action; enum InputFeedback; enum Game}` — `NotificationSound.Notification.DIALOG_INFORMATION` exists.

---

## Findings per page

### /docs/os/index.mdx — status: minor-fix
- Coverage matrix row "System tray" cites module `composenativetray` (line 20) and TL;DR mentions `NSUserNotificationCenter` (line 10). macOS module actually uses `UNUserNotificationCenter`/UserNotifications (see `NotificationCenter` KDoc). `NSUserNotificationCenter` is the deprecated legacy API name — outdated. Notification rows (18-19) and coordinates are correct.

### /docs/os/notifications.mdx — status: needs-rewrite-facts
The whole quickstart/reference uses an API shape that does not exist.
- L34-42 & L73-80: `notification { title = …; message = …; button(…){} }` — `notification` is `fun notification(title, message, …, buttons: builder)`. `title`/`message` are function args, not settable properties inside the block; the block only offers `button()`. Correct: `notification(title = "…", message = "…") { button("Open") { … } }`.
- L78-79: `onShown { id -> }` and `onDismissed { reason -> }` used as DSL-block builders — no such builder methods. Callbacks are constructor params `onActivated`, `onDismissed`, `onFailed`. There is **no `onShown` and no `onAction`** (L46 also invents `onAction`). Body-click callback is `onActivated`.
- L87-89: `NotificationResult.Shown` / `NotificationResult.Failed` — actual subclasses are `NotificationResult.Success(handle)` and `NotificationResult.Failure(reason)`.
- L48: references macOS `NotificationCenter` — exists (see below), fine.
- Correct: `NotificationManager.initialize()` (L32), `NotificationManager.isAvailable()` (L95), `n.send()` (L41), package import (L30).

### /docs/os/notification-macos.mdx — status: needs-rewrite-facts
- L38-49: `NotificationCenter.send(NotificationRequest(...))` — **no `send` method**; correct is `NotificationCenter.add(request, callback?)`.
- L45 & L127: `InterruptionLevel.TimeSensitive` / `InterruptionLevel.Critical` — enum values are UPPER_SNAKE: `TIME_SENSITIVE`, `CRITICAL`. L14 TL;DR lists "passive, active, timeSensitive, critical" (casing).
- L97 & L104: `NotificationTrigger.Immediate` — **does not exist**. Only `TimeInterval` and `Calendar`; immediate delivery = `trigger = null` (default). Triggers table (L105-107) otherwise matches `TimeInterval(interval, repeats)` and `Calendar(dateComponents, repeats)`.
- L95: `NotificationAttachment(identifier = "img", url = file.toURI())` — `url` is a `String`, not a `URI`. Passing `file.toURI()` (java.net.URI) is a type mismatch; should be a string.
- L123: prose names `removeDelivered` / `removePending` — actual methods are `removeDeliveredNotifications`/`removeAllDeliveredNotifications` and `removePendingNotifications`/`removeAllPendingNotifications`.
- Correct: `requestAuthorization(setOf(AuthorizationOption.ALERT, SOUND, BADGE)) { granted, error -> }`; `NotificationCategory(identifier, actions, options)`; `TextInputNotificationAction(identifier, title, textInputButtonTitle, textInputPlaceholder)`; `CategoryOption.CUSTOM_DISMISS_ACTION`; `setNotificationCategories(setOf(...))`; delegate `willPresent`/`didReceive` and `PresentationOption.BANNER`/`SOUND`; `setDelegate(...)`; `NotificationSound.Default`.

### /docs/os/notification-windows.mdx — status: needs-rewrite-facts
- L31: `WindowsNotificationCenter.send(toast { … })` — **no `send`**; correct is `show(content, …)`.
- L65: `AdaptiveImageCrop.Circle` → `CIRCLE`. L79: `ToastScenario.Reminder` → `REMINDER` (enum values UPPER_SNAKE).
- L76-77: `snoozeButton()` / `dismissButton()` inside `actions { }` — **these DSL functions do not exist**. `ToastActionsBuilder` only exposes `textBox`, `selectionBox`, `button`, `contextMenuItem`. (`ToastButtonSnooze`/`ToastButtonDismiss` data classes exist but are not wired into the DSL.)
- L86-90: `setListener(object : ToastNotificationListener { onActivated(args: ToastActivatedEventArgs); onDismissed(args: ToastDismissedEventArgs); onFailed(args: ToastFailedEventArgs) })` — **two problems**: (1) method is `addListener` (no `setListener`); (2) listener callbacks take flat params `onActivated(tag, group, arguments, userInputs)`, `onDismissed(tag, group, reason)`, `onFailed(tag, group, errorCode)` — NOT single event-args objects.
- L96-100: `ToastNotificationData(mapOf("progressValue" to "0.8"))` — first positional param is `sequenceNumber: Int`; passing a map positionally is a type error. Correct: `ToastNotificationData(values = mapOf(...))`. (`update(tag, group, data, cb?)` signature itself is fine.)
- L106-108: `WindowsNotificationCenter.history().forEach { entry -> … entry.dateTime }` — **no `history()` method** (it is `getHistory(callback)`), and `HistoryEntry` has only `tag` + `group`, **no `dateTime`**.
- Correct: `initialize()` / `initialize(aumid = "Vendor.App")`; `toast { visual { text/heroImage/appLogo/progressBar } actions { button(...) } }`; `progressBar(title, valueStringOverride, value, status)` (named); `AdaptiveImageCrop.Circle`→CIRCLE aside.

### /docs/os/notification-linux.mdx — status: needs-rewrite-facts
- L32: `LinuxNotificationCenter.send(Notification(...))` — **no `send`**; correct is `notify(notification): Int`.
- L81: `LinuxNotificationCenter.setListener(...)` — **no `setListener`**; correct is `addListener` / `removeListener`.
- L82: `onAction(id: Long, actionKey: String)` — method is `onActionInvoked(notificationId: Int, actionKey: String)`. Wrong name and wrong type (`Int`, not `Long`).
- L83: `onClosed(id: Long, reason: CloseReason)` — correct name, but param is `Int` not `Long`.
- L91: `ImageData.fromArgb(width, height, bytes)` — **no such factory / no companion**. `ImageData` is a plain data class: `ImageData(width, height, rowstride, hasAlpha, bitsPerSample=8, channels, data)`.
- L108: `LinuxNotificationCenter.close(id)` — **no `close`**; correct is `closeNotification(id: Int)`.
- Correct: `Notification(appName, summary, body, appIcon, hints, actions)`; `NotificationHints(urgency = Urgency.NORMAL)`; `Urgency.{LOW,NORMAL,CRITICAL}`; `NotificationAction("open","Open")`; `getServerInformation()`; `soundName = NotificationSound.Notification.DIALOG_INFORMATION`; `FreedesktopIcon.Status.DIALOG_INFORMATION` (verified in freedesktop-icons); freedesktop-icons pulled transitively via `api(project(":freedesktop-icons"))`.

---

## Stale pages
None. All five pages back onto real modules; the errors are API-drift, not phantom features.

## Undocumented modules in this cluster
None. All four notification modules plus `freedesktop-icons` have doc pages (`content/docs/os/freedesktop-icons.mdx`).

Out-of-cluster note (from the task's "known suspects" — all have `src/main/kotlin`, none belong to the notification cluster; ownership sits with other recon clusters): `fs-watcher`, `sf-symbols`, `scheduler-testing`, `taskbar-progress-tao`, `native-http-okhttp`, `native-http-ktor`.
