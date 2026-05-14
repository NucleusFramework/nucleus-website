'use client';

import * as React from 'react';
import { useState } from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { escapeHtml, highlightKotlin, highlightBash } from '@/components/landing/CodeBlock';
import { type Lang, npT, pick } from '@/lib/landing-i18n';

interface NativeImpl {
  os: string;
  lang: string;
  bytes: string;
  code: string;
}

interface NativeExample {
  id: string;
  nameKey: 'exNotification' | 'exTray' | 'exHotkey' | 'exScheduler' | 'exUpdate' | 'exTaskbar';
  iconPath: string;
  nucleus: string;
  natives: NativeImpl[];
}

const NATIVE_EXAMPLES: NativeExample[] = [
  {
    id: 'notify',
    nameKey: 'exNotification',
    iconPath: 'M6 9a6 6 0 1112 0v3l1.5 3h-15L6 12V9zM10 18a2 2 0 004 0',
    nucleus: `import dev.nucleusframework.notification.notify
import dev.nucleusframework.notification.NotificationAction

notify(
    title = "Build complete",
    body  = "Installer ready. What now?",
    icon  = Icon.AppIcon,
    actions = listOf(
        NotificationAction("reveal", "Reveal in Finder") {
            Desktop.open(file.parent)
        },
        NotificationAction("copy",   "Copy path") {
            Clipboard.put(file.absolutePath)
        },
        NotificationAction("share",  "Share…")     { shareSheet(file) },
    ),
    onDismiss = { telemetry.log("notif_dismissed") },
)`,
    natives: [
      {
        os: 'macOS · SwiftUI',
        lang: 'swift',
        bytes: '~74 lines',
        code: `// SwiftUI app (2025) — still goes through UserNotifications + UNNotificationCenter
import SwiftUI
import UserNotifications

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(NotifDelegate.self) var delegate
    var body: some Scene { WindowGroup { ContentView() } }
}

func postBuildNotif() async {
    let center = UNUserNotificationCenter.current()

    // 1. Authorization
    let ok = try? await center.requestAuthorization(options: [.alert, .sound])
    guard ok == true else { return }

    // 2. Declare the actions and register the category up-front
    let reveal = UNNotificationAction(identifier: "REVEAL",
        title: "Reveal in Finder", options: [.foreground])
    let copy   = UNNotificationAction(identifier: "COPY",
        title: "Copy path",         options: [])
    let share  = UNNotificationAction(identifier: "SHARE",
        title: "Share…",            options: [.foreground])

    let cat = UNNotificationCategory(identifier: "BUILD_DONE",
        actions: [reveal, copy, share], intentIdentifiers: [],
        options: .customDismissAction)
    center.setNotificationCategories([cat])

    // 3. Build content
    let content = UNMutableNotificationContent()
    content.title = "Build complete"
    content.body  = "Installer ready. What now?"
    content.categoryIdentifier = "BUILD_DONE"
    content.sound = .default

    let req = UNNotificationRequest(identifier: UUID().uuidString,
        content: content, trigger: nil)
    try? await center.add(req)
}

// 4. Delegate to receive callbacks (must be retained, AppDelegate is easiest)
class NotifDelegate: NSObject, UIApplicationDelegate,
                    UNUserNotificationCenterDelegate {
    func application(_ a: UIApplication, didFinishLaunchingWithOptions o:
        [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    func userNotificationCenter(_ c: UNUserNotificationCenter,
        didReceive r: UNNotificationResponse,
        withCompletionHandler done: @escaping () -> Void) {
        switch r.actionIdentifier {
        case "REVEAL":  revealInFinder(file)
        case "COPY":    copyPath(file)
        case "SHARE":   shareSheet(file)
        case UNNotificationDismissActionIdentifier:
            telemetry.log("notif_dismissed")
        default: break
        }
        done()
    }
}
// + Info.plist NSUserNotificationsUsageDescription
// + handle authorization revoked mid-app-lifecycle`,
      },
      {
        os: 'Windows · WinUI 3',
        lang: 'cpp',
        bytes: '~92 lines',
        code: `// Windows App SDK 1.5 — AppNotificationManager (modern WinUI 3 stack)
#include <winrt/Microsoft.Windows.AppNotifications.h>
#include <winrt/Microsoft.Windows.AppNotifications.Builder.h>

using namespace winrt::Microsoft::Windows::AppNotifications;
using namespace winrt::Microsoft::Windows::AppNotifications::Builder;

// 1. Register the activation callback BEFORE any toast is shown
auto mgr = AppNotificationManager::Default();
mgr.NotificationInvoked([](auto&&, AppNotificationActivatedEventArgs const& e) {
    auto args = e.Arguments();
    if      (args.TryLookup(L"action") == L"reveal") revealInExplorer(file);
    else if (args.TryLookup(L"action") == L"copy")   copyPath(file);
    else if (args.TryLookup(L"action") == L"share")  shareSheet(file);
    // dismissal is reported as a separate args.TryLookup(L"systemAction")
});
mgr.Register();

// 2. Build the toast via the fluent builder
auto builder = AppNotificationBuilder()
    .AddText(L"Build complete")
    .AddText(L"Installer ready. What now?")
    .AddButton(
        AppNotificationButton(L"Reveal in Finder")
            .AddArgument(L"action", L"reveal"))
    .AddButton(
        AppNotificationButton(L"Copy path")
            .AddArgument(L"action", L"copy"))
    .AddButton(
        AppNotificationButton(L"Share…")
            .AddArgument(L"action", L"share"));

AppNotification toast = builder.BuildNotification();
mgr.Show(toast);

// 3. For cold-process activation, you ALSO need a COM activator…
class DECLSPEC_UUID("YOUR-CLSID-GUID")
NotifActivator : public RuntimeClass<RuntimeClassFlags<ClassicCom>,
                          INotificationActivationCallback> {
public:
    IFACEMETHODIMP Activate(LPCWSTR aumid, LPCWSTR invokedArgs,
        const NOTIFICATION_USER_INPUT_DATA*, ULONG) noexcept override
    {
        std::wstring s = invokedArgs;
        if (s.find(L"action=reveal") != std::wstring::npos)
            revealInExplorer(file);
        // …
        return S_OK;
    }
};
DWORD cookie = 0;
CoRegisterClassObject(__uuidof(NotifActivator), factory.Get(),
    CLSCTX_LOCAL_SERVER, REGCLS_MULTIPLEUSE, &cookie);

// + AUMID must match your Start Menu shortcut (or no toast appears)
// + sign the .exe — unsigned binaries don't get action callbacks
// + register CLSID in HKCR\\CLSID\\{...}\\LocalServer32`,
      },
      {
        os: 'Linux · libnotify',
        lang: 'c',
        bytes: '~62 lines',
        code: `// libnotify (the modern API on GNOME / KDE / freedesktop)
#include <libnotify/notify.h>

notify_init("MyApp");

// 1. Build the notification — actions get added one at a time, each
//    with its own GClosure for the callback. Memory ownership is
//    NotifyNotification-managed but the callback closures are not —
//    don't free them too early.
NotifyNotification* n = notify_notification_new(
    "Build complete",
    "Installer ready. What now?",
    "dialog-information");

notify_notification_add_action(n,
    "reveal", "Reveal in Finder",
    NOTIFY_ACTION_CALLBACK(on_reveal), file, NULL);

notify_notification_add_action(n,
    "copy",   "Copy path",
    NOTIFY_ACTION_CALLBACK(on_copy), file, NULL);

notify_notification_add_action(n,
    "share",  "Share…",
    NOTIFY_ACTION_CALLBACK(on_share), file, NULL);

g_signal_connect(n, "closed",
    G_CALLBACK(on_closed), NULL);

GError* err = NULL;
notify_notification_show(n, &err);

// 2. Callback signatures — note the param ordering and the typing
//    you have to get exactly right per the gobject runtime.
static void on_reveal(NotifyNotification* n, char* action, gpointer data) {
    File* file = (File*) data;
    reveal_in_files(file);
    notify_notification_close(n, NULL);
}
static void on_copy(NotifyNotification* n, char* action, gpointer data) {
    File* file = (File*) data;
    copy_path(file);
}
static void on_share(NotifyNotification* n, char* action, gpointer data) {
    share_sheet((File*) data);
}
static void on_closed(NotifyNotification* n, gpointer data) {
    int reason = notify_notification_get_closed_reason(n);
    if (reason == 2) telemetry_log("notif_dismissed");
    g_object_unref(n);
}

// + you must pump the GLib main loop for actions to fire
// + .desktop file with X-GNOME-UsesNotifications
// + GNOME Shell strips action buttons (you get just the body)
// + KDE / XFCE / Mate / Cinnamon each render actions differently
// + Flatpak / Snap need separate xdg-portal codepath`,
      },
    ],
  },
  {
    id: 'tray',
    nameKey: 'exTray',
    iconPath: 'M3 16h18M3 20h18M5 4h14a2 2 0 012 2v8H3V6a2 2 0 012-2z',
    nucleus: `import dev.nucleusframework.tray.Tray
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode

var isDarkMode by remember { mutableStateOf(false) }

Tray(
    icon = if (isDarkMode) Icons.Default.DarkMode else Icons.Default.LightMode,
    tooltip = "My App",
    primaryAction = { showWindow() },
) {
    Item(label = "Show Window") { showWindow() }
    Divider()
    CheckableItem(label = "Dark Mode", checked = isDarkMode) {
        isDarkMode = !isDarkMode
    }
    SubMenu(label = "Options") {
        Item(label = "Settings") { openSettings() }
        Item(label = "About")    { openAbout() }
    }
    Divider()
    Item(label = "Quit") { exitProcess(0) }
}`,
    natives: [
      {
        os: 'macOS · SwiftUI',
        lang: 'swift',
        bytes: '~46 lines',
        code: `// SwiftUI MenuBarExtra (macOS 13+) — modern but limited.
// Dynamic icons require remember-the-pattern wrapping.
import SwiftUI

@main
struct MyApp: App {
    @StateObject var vm = TrayViewModel()

    var body: some Scene {
        MenuBarExtra {
            // 1. Menu content — has to be hand-written; no reactive DSL
            Button("Show Window") { vm.showWindow() }
            Divider()

            // 2. Toggle — SwiftUI's Toggle doesn't render as a native
            //    checkmark in MenuBarExtra. Use Button + Image instead.
            Button {
                vm.isDarkMode.toggle()
            } label: {
                if vm.isDarkMode {
                    Label("Dark Mode", systemImage: "checkmark")
                } else {
                    Text("Dark Mode")
                }
            }

            // 3. Submenu — Menu inside MenuBarExtra
            Menu("Options") {
                Button("Settings") { vm.openSettings() }
                Button("About")    { vm.openAbout() }
            }

            Divider()
            Button("Quit") { NSApp.terminate(nil) }
        } label: {
            // 4. Icon — SF Symbol, reactive on @StateObject — but can't
            //    use a custom Composable / drawn icon without falling
            //    back to NSStatusBar
            Image(systemName: vm.isDarkMode ? "moon.fill" : "sun.max.fill")
        }
        .menuBarExtraStyle(.menu)
    }
}

class TrayViewModel: ObservableObject {
    @Published var isDarkMode = false
    func showWindow()    { /* AppKit dance to bring window forward */ }
    func openSettings()  { /* ... */ }
    func openAbout()     { /* ... */ }
}

// + .window style is a popover, not the menu — they're separate APIs
// + custom-drawn icons need fallback to NSStatusItem (no SwiftUI)
// + reactive icon redraw works, but submenu state doesn't auto-rebuild`,
      },
      {
        os: 'Windows · WinUI 3',
        lang: 'cpp',
        bytes: '~80 lines',
        code: `// WinUI 3 / Windows App SDK has no first-party tray API. You drop
// down to Shell_NotifyIconW + a hidden window for menu hosting.
#include <windows.h>
#include <shellapi.h>

#define WM_TRAY (WM_USER + 1)

bool isDarkMode = false;
NOTIFYICONDATAW nid = {};
HMENU menu;

void buildMenu() {
    if (menu) DestroyMenu(menu);
    menu = CreatePopupMenu();
    AppendMenuW(menu, MF_STRING, 1001, L"Show Window");
    AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
    AppendMenuW(menu,
        MF_STRING | (isDarkMode ? MF_CHECKED : MF_UNCHECKED),
        1002, L"Dark Mode");

    HMENU sub = CreatePopupMenu();
    AppendMenuW(sub, MF_STRING, 2001, L"Settings");
    AppendMenuW(sub, MF_STRING, 2002, L"About");
    AppendMenuW(menu, MF_POPUP, (UINT_PTR)sub, L"Options");

    AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
    AppendMenuW(menu, MF_STRING, 1009, L"Quit");
}

void updateIcon() {
    nid.hIcon = LoadIconW(hInstance,
        isDarkMode ? MAKEINTRESOURCEW(IDI_DARK)
                   : MAKEINTRESOURCEW(IDI_LIGHT));
    Shell_NotifyIconW(NIM_MODIFY, &nid);
}

void installTray(HWND hidden) {
    nid.cbSize = sizeof(nid);
    nid.hWnd   = hidden;
    nid.uID    = 1;
    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    nid.uCallbackMessage = WM_TRAY;
    wcscpy_s(nid.szTip, L"My App");
    updateIcon();
    Shell_NotifyIconW(NIM_ADD, &nid);
    buildMenu();
}

LRESULT CALLBACK WndProc(HWND h, UINT msg, WPARAM w, LPARAM l) {
    if (msg == WM_TRAY) {
        if (LOWORD(l) == WM_LBUTTONUP) showWindow();
        if (LOWORD(l) == WM_RBUTTONUP) {
            POINT pt; GetCursorPos(&pt);
            SetForegroundWindow(h);             // anti-stale popup workaround
            TrackPopupMenu(menu, TPM_BOTTOMALIGN | TPM_LEFTALIGN,
                pt.x, pt.y, 0, h, nullptr);
        }
        return 0;
    }
    if (msg == WM_COMMAND) {
        switch (LOWORD(w)) {
            case 1001: showWindow(); break;
            case 1002:
                isDarkMode = !isDarkMode;
                updateIcon();                   // redraw icon manually
                buildMenu();                    // rebuild to flip the check
                break;
            case 2001: openSettings(); break;
            case 2002: openAbout();    break;
            case 1009: PostQuitMessage(0); break;
        }
        return 0;
    }
    return DefWindowProcW(h, msg, w, l);
}

// + WinUI 3 XAML islands can't host the tray icon
// + reactive icon = manual NIM_MODIFY on every state change
// + reactive menu = full rebuild on every state change
// + per-monitor DPI: reload .ico on WM_DPICHANGED`,
      },
      {
        os: 'Linux · GTK4 / libadwaita',
        lang: 'c',
        bytes: '~95 lines',
        code: `// GTK4 + libadwaita (the modern stack) — but GTK4 dropped GtkStatusIcon
// entirely. Tray = StatusNotifierItem D-Bus + com.canonical.dbusmenu.
// You implement both protocols. By hand. Or via libayatana-appindicator
// (Ubuntu/KDE), which has yet another API and ignores GNOME by default.
#include <gio/gio.h>

static const char* SNI_XML =
"<node><interface name='org.kde.StatusNotifierItem'>"
"  <property name='Title'    type='s' access='read'/>"
"  <property name='Status'   type='s' access='read'/>"
"  <property name='IconName' type='s' access='read'/>"
"  <property name='Menu'     type='o' access='read'/>"
"  <method  name='Activate'>"
"    <arg type='i' name='x' direction='in'/>"
"    <arg type='i' name='y' direction='in'/></method>"
"  <method  name='ContextMenu'>"
"    <arg type='i' name='x' direction='in'/>"
"    <arg type='i' name='y' direction='in'/></method>"
"  <signal name='NewIcon'/>"
"</interface></node>";

static const char* MENU_XML =
"<node><interface name='com.canonical.dbusmenu'>"
"  <method name='GetLayout'>"
"    <arg type='i' name='parentId'   direction='in'/>"
"    <arg type='i' name='depth'      direction='in'/>"
"    <arg type='as' name='properties' direction='in'/>"
"    <arg type='u' name='revision'   direction='out'/>"
"    <arg type='(ia{sv}av)' name='layout' direction='out'/>"
"  </method>"
"  <method name='Event'>"
"    <arg type='i' name='id'        direction='in'/>"
"    <arg type='s' name='eventId'   direction='in'/>"
"    <arg type='v' name='data'      direction='in'/>"
"    <arg type='u' name='timestamp' direction='in'/></method>"
"  <signal name='LayoutUpdated'>"
"    <arg type='u' name='revision'/>"
"    <arg type='i' name='parent'/></signal>"
"</interface></node>";

// Then you walk your tree in GetLayout, returning nested
// (ia{sv}av) variants — int id, dict of properties
// (label/icon-data/toggle-type/toggle-state/children-display/visible),
// array of variants for each child. You bump revision and emit
// LayoutUpdated on every state change. You handle Event for clicks
// and AboutToShow for lazy submenus.

GDBusConnection* bus = g_bus_get_sync(G_BUS_TYPE_SESSION, NULL, NULL);
GDBusNodeInfo* sni  = g_dbus_node_info_new_for_xml(SNI_XML,  NULL);
GDBusNodeInfo* menu = g_dbus_node_info_new_for_xml(MENU_XML, NULL);

g_dbus_connection_register_object(bus, "/StatusNotifierItem",
    sni->interfaces[0],  &sni_vtable,  NULL, NULL, NULL);
g_dbus_connection_register_object(bus, "/Menu",
    menu->interfaces[0], &menu_vtable, NULL, NULL, NULL);

g_bus_own_name_on_connection(bus,
    "org.kde.StatusNotifierItem-12345-1",
    G_BUS_NAME_OWNER_FLAGS_NONE,
    on_acquired, on_lost, NULL, NULL);

// Then ask the host to watch us:
g_dbus_connection_call_sync(bus,
    "org.kde.StatusNotifierWatcher",
    "/StatusNotifierWatcher",
    "org.kde.StatusNotifierWatcher",
    "RegisterStatusNotifierItem",
    g_variant_new("(s)", "org.kde.StatusNotifierItem-12345-1"),
    NULL, G_DBUS_CALL_FLAGS_NONE, -1, NULL, NULL);

// + GNOME doesn't include StatusNotifierWatcher — install the
//   AppIndicator extension or fall back to libayatana-appindicator
// + dynamic icons: emit NewIcon, then host re-fetches IconName
// + every tree change = bump revision + LayoutUpdated signal +
//   keep the previous layout in sync, by hand`,
      },
    ],
  },
  {
    id: 'hotkey',
    nameKey: 'exHotkey',
    iconPath: 'M5 8h14M5 12h14M5 16h14',
    nucleus: `import dev.nucleusframework.hotkey.registerGlobalHotkey
import dev.nucleusframework.hotkey.Key
import dev.nucleusframework.hotkey.Modifier

registerGlobalHotkey(
    keys = setOf(Modifier.Cmd, Modifier.Shift, Key.K),
) {
    showCommandPalette()
}`,
    natives: [
      {
        os: 'macOS · SwiftUI',
        lang: 'swift',
        bytes: '~36 lines',
        code: `// SwiftUI has no global hotkey API. You drop to Carbon — yes, Carbon —
// because RegisterEventHotKey is still the only supported way in 2025.
import Carbon

@main
struct MyApp: App {
    init() { registerCmdShiftK() }
    var body: some Scene { WindowGroup { ContentView() } }
}

var hotKeyRef: EventHotKeyRef?

func registerCmdShiftK() {
    let id = EventHotKeyID(signature: OSType("htk1".fourCharCode),
                           id: UInt32(1))

    InstallEventHandler(
        GetApplicationEventTarget(),
        { _, eventRef, _ in
            var id = EventHotKeyID()
            GetEventParameter(eventRef,
                EventParamName(kEventParamDirectObject),
                EventParamType(typeEventHotKeyID), nil,
                MemoryLayout<EventHotKeyID>.size, nil, &id)
            DispatchQueue.main.async { showCommandPalette() }
            return noErr
        },
        1,
        [EventTypeSpec(eventClass: OSType(kEventClassKeyboard),
                       eventKind: UInt32(kEventHotKeyPressed))],
        nil, nil)

    RegisterEventHotKey(
        UInt32(kVK_ANSI_K),
        UInt32(cmdKey | shiftKey),
        id,
        GetApplicationEventTarget(),
        0,
        &hotKeyRef)
}
// + .keyboardShortcut() in SwiftUI only fires when the app is focused
// + Accessibility permission prompt for system-wide capture
// + UnregisterEventHotKey on exit`,
      },
      {
        os: 'Windows · WinUI 3',
        lang: 'cpp',
        bytes: '~30 lines',
        code: `// Windows App SDK has no native global hotkey wrapper. Same Win32
// RegisterHotKey as before — but now you have to bridge it back into
// the XAML/Dispatcher thread for your WinUI 3 UI to react.
#include <windows.h>
#include <winrt/Microsoft.UI.Dispatching.h>

using namespace winrt::Microsoft::UI::Dispatching;

const int HK_ID = 1;
HWND msgWnd;       // hidden message-only window
DispatcherQueue ui = DispatcherQueue::GetForCurrentThread();

if (!RegisterHotKey(msgWnd, HK_ID,
                    MOD_CONTROL | MOD_SHIFT | MOD_NOREPEAT, 'K'))
{
    // already registered by another process — no way to override
}

// Message pump on a worker thread, then post back to the UI dispatcher
std::thread([] {
    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        if (msg.message == WM_HOTKEY && msg.wParam == HK_ID) {
            ui.TryEnqueue([] { showCommandPalette(); });
        }
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
}).detach();

// + WinUI 3 KeyboardAccelerators only fire when the app is focused
// + UnregisterHotKey + close the worker thread on exit
// + same MOD_CONTROL/MOD_NOREPEAT/Mod2/CapsLock variations to handle`,
      },
      {
        os: 'Linux · GTK4',
        lang: 'c',
        bytes: '~50 lines',
        code: `// GTK4 has no global hotkey API. On Wayland it's *only* possible via
// xdg-desktop-portal GlobalShortcuts (which itself is portal v1.5+,
// async, and asks the user for permission per-shortcut).
#include <gio/gio.h>

GDBusProxy* portal = g_dbus_proxy_new_for_bus_sync(
    G_BUS_TYPE_SESSION, G_DBUS_PROXY_FLAGS_NONE, NULL,
    "org.freedesktop.portal.Desktop",
    "/org/freedesktop/portal/desktop",
    "org.freedesktop.portal.GlobalShortcuts",
    NULL, NULL);

// 1. Build the (as)(s)(a(sa{sv}))(s) options dict that requests one shortcut
GVariantBuilder shortcuts;
g_variant_builder_init(&shortcuts, G_VARIANT_TYPE("a(sa{sv})"));
GVariantBuilder props;
g_variant_builder_init(&props, G_VARIANT_TYPE("a{sv}"));
g_variant_builder_add(&props, "{sv}",
    "description", g_variant_new_string("Show command palette"));
g_variant_builder_add(&props, "{sv}",
    "preferred_trigger", g_variant_new_string("CTRL+SHIFT+k"));
g_variant_builder_add(&shortcuts, "(sa{sv})",
    "show-palette", &props);

// 2. Call BindShortcuts — async, returns a Request handle whose
//    Response signal you have to subscribe to ahead of time.
GVariant* res = g_dbus_proxy_call_sync(portal, "BindShortcuts",
    g_variant_new("(oasa{sv}s)", session_handle, &shortcuts,
                  NULL, ""),
    G_DBUS_CALL_FLAGS_NONE, -1, NULL, NULL);

// 3. Subscribe to Activated signal to actually receive the keypress
g_signal_connect(portal, "g-signal",
    G_CALLBACK(on_portal_signal), NULL);

static void on_portal_signal(GDBusProxy* p, gchar* sender,
                              gchar* name, GVariant* params) {
    if (g_strcmp0(name, "Activated") == 0) {
        const char* id; g_variant_get(params, "(o&sa{sv})",
            NULL, &id, NULL);
        if (g_strcmp0(id, "show-palette") == 0)
            show_command_palette();
    }
}

// + on X11 you'd use XGrabKey + the four numlock/capslock variants
// + need to maintain BOTH code paths for X11/Wayland users
// + portal version differs per distro (Ubuntu 24.04 has 1.4)
// + user can refuse the shortcut binding — handle that case`,
      },
    ],
  },
  {
    id: 'scheduler',
    nameKey: 'exScheduler',
    iconPath: 'M12 6v6l4 2M12 22a10 10 0 110-20 10 10 0 010 20z',
    nucleus: `import dev.nucleusframework.scheduler.*
import kotlin.time.Duration.Companion.hours

val SyncId = TaskId("sync")

class SyncTask : DesktopTask {
    override suspend fun doWork(ctx: TaskContext): TaskResult {
        return try { performSync(); TaskResult.Success }
        catch (e: IOException) { TaskResult.Retry(e.message ?: "") }
    }
}

// At startup
fun main(args: Array<String>) {
    if (DesktopBootReceiver.isSchedulerInvocation(args)) {
        DesktopBootReceiver.handle(args, registry)
        return
    }
    DesktopTaskScheduler.enqueue(
        TaskRequest.periodic(SyncId, 1.hours) {
            constraints {
                requiredNetworkType = NetworkType.UNMETERED
                requiresBatteryNotLow = true
            }
            retryPolicy(RetryPolicy.ExponentialBackoff())
        }
    )
}`,
    natives: [
      {
        os: 'macOS · launchd',
        lang: 'swift',
        bytes: '~85 lines',
        code: `// SwiftUI has no scheduling API — you write a launchd plist by hand,
// register it via launchctl or SMAppService, then handle the re-launch.
import Foundation
import ServiceManagement

let label = "com.example.MyApp.SyncTask"
let plistPath = ("~/Library/LaunchAgents/" + label + ".plist")
    .expandingTildeInPath

// 1. Write the plist — launchd's StartInterval has a 15-minute floor on
//    modern macOS and silently ignores anything smaller.
let plist: [String: Any] = [
    "Label": label,
    "ProgramArguments": [Bundle.main.executablePath!,
                         "--nucleus-scheduler-run", "sync"],
    "StartInterval": 3600,
    "RunAtLoad": false,
    "ThrottleInterval": 10,
    "StandardOutPath": "/tmp/" + label + ".out",
    "StandardErrorPath": "/tmp/" + label + ".err",
    // Constraints (network / battery / charging / idle) are NOT supported.
    // You check them yourself at the top of your runner.
]

let data = try PropertyListSerialization.data(
    fromPropertyList: plist, format: .xml, options: 0)
try data.write(to: URL(fileURLWithPath: plistPath))

// 2. Load it
let task = Process()
task.launchPath = "/bin/launchctl"
task.arguments = ["load", "-w", plistPath]
try task.run()
task.waitUntilExit()

// 3. Detect the re-launch in main() (launchd re-spawns your binary)
let args = CommandLine.arguments
if args.contains("--nucleus-scheduler-run") {
    // Check constraints manually:
    guard isOnUnmeteredNetwork() else { exit(0) }   // your code
    guard batteryLevel() > 0.15 else { exit(0) }

    // Retry policy: also yours to implement.
    var attempt = readAttemptCount(label) + 1
    do {
        try performSync()
        writeAttemptCount(label, 1)
    } catch {
        if attempt < 3 {
            scheduleOneShotRetry(label, in: backoff(attempt))
        }
        writeAttemptCount(label, attempt)
    }
    exit(0)
}

// 4. Orphan cleanup on uninstall: macOS gives you NOTHING here.
// If the user drag-trashes your .app, launchd keeps trying to spawn
// the missing binary forever (throttled, log-spamming) until the user
// manually deletes ~/Library/LaunchAgents/<label>.plist. The Apple-
// documented workaround is "ship an explicit uninstaller".

// + For App Store distribution, this entire approach is FORBIDDEN.
//   Switch to SMAppService.daemon(plistName:) + an agent embedded in
//   the .app bundle. Different API. Different lifetime. Different bugs.`,
      },
      {
        os: 'Windows · Task Scheduler',
        lang: 'cpp',
        bytes: '~115 lines',
        code: `// Windows Task Scheduler 2.0 — COM API. WinUI 3 has no wrapper.
#include <taskschd.h>
#include <comdef.h>
#pragma comment(lib, "taskschd.lib")

CoInitializeEx(nullptr, COINIT_MULTITHREADED);
CoInitializeSecurity(nullptr, -1, nullptr, nullptr,
    RPC_C_AUTHN_LEVEL_PKT_PRIVACY, RPC_C_IMP_LEVEL_IMPERSONATE,
    nullptr, 0, nullptr);

// 1. Connect to the Task Service
ITaskService* service = nullptr;
CoCreateInstance(CLSID_TaskScheduler, nullptr, CLSCTX_INPROC_SERVER,
    IID_PPV_ARGS(&service));
service->Connect(_variant_t(), _variant_t(), _variant_t(), _variant_t());

// 2. Get / create the folder
ITaskFolder* root = nullptr;
service->GetFolder(_bstr_t(L"\\\\Nucleus\\\\MyApp"), &root);
if (!root) service->GetFolder(_bstr_t(L"\\\\"), &root)->CreateFolder(
    _bstr_t(L"Nucleus\\\\MyApp"), _variant_t(L""), &root);

// 3. Build the task definition (a fluent chain of 6 separate COM objects)
ITaskDefinition* def = nullptr;
service->NewTask(0, &def);

IRegistrationInfo* info; def->get_RegistrationInfo(&info);
info->put_Author(_bstr_t(L"MyApp"));

IPrincipal* principal; def->get_Principal(&principal);
principal->put_LogonType(TASK_LOGON_INTERACTIVE_TOKEN);

ITaskSettings* settings; def->get_Settings(&settings);
settings->put_StartWhenAvailable(VARIANT_TRUE);
settings->put_StopIfGoingOnBatteries(VARIANT_TRUE);     // power constraint
settings->put_DisallowStartIfOnBatteries(VARIANT_TRUE);
INetworkSettings* net;
settings->get_NetworkSettings(&net);
// (no "unmetered" filter — Task Scheduler doesn't differentiate)

// 4. Triggers — for a "periodic" task you create a TimeTrigger
//    with a Repetition, not a single value.
ITriggerCollection* triggers; def->get_Triggers(&triggers);
ITrigger* trigger; triggers->Create(TASK_TRIGGER_TIME, &trigger);
ITimeTrigger* tt; trigger->QueryInterface(IID_PPV_ARGS(&tt));
tt->put_StartBoundary(_bstr_t(L"2026-01-01T09:00:00"));
IRepetitionPattern* rep; tt->get_Repetition(&rep);
rep->put_Interval(_bstr_t(L"PT1H"));
rep->put_Duration(_bstr_t(L""));   // run forever

// 5. Action — an ExecAction pointing at a wrapper script that
//    self-destructs if the app binary is gone (otherwise the OS
//    keeps spawning a missing exe after uninstall, forever).
IActionCollection* actions; def->get_Actions(&actions);
IAction* action; actions->Create(TASK_ACTION_EXEC, &action);
IExecAction* exec; action->QueryInterface(IID_PPV_ARGS(&exec));
exec->put_Path(_bstr_t(L"wscript.exe"));
exec->put_Arguments(_bstr_t(
    L"\\"C:\\\\Users\\\\me\\\\AppData\\\\Local\\\\nucleus\\\\sync.vbs\\""));

// 6. Register
IRegisteredTask* registered;
root->RegisterTaskDefinition(
    _bstr_t(L"sync"),
    def,
    TASK_CREATE_OR_UPDATE,
    _variant_t(L""), _variant_t(L""),
    TASK_LOGON_INTERACTIVE_TOKEN, _variant_t(L""),
    &registered);

// 7. Now write that .vbs wrapper to disk — it has to:
//    - check whether the .exe still exists
//    - if yes: spawn it with --nucleus-scheduler-run sync
//    - if no:  delete itself + the registered task via the same
//              ITaskFolder COM API + delete the persisted metadata
//             (otherwise orphans linger after uninstall forever)

// + Constraint checks (network/battery): mixed support, no unmetered flag
// + Retry / backoff policy: yours to track in a file
// + Input data / payloads: yours to serialize, store, re-read
// + Per-user vs per-machine, elevated vs not: 6 more flags to wire
// + Release all 8 COM interfaces in reverse order, on every exit path`,
      },
      {
        os: 'Linux · systemd',
        lang: 'c',
        bytes: '~85 lines',
        code: `// systemd user units — register via D-Bus org.freedesktop.systemd1.Manager
// (or write to ~/.config/systemd/user/ + 'systemctl --user daemon-reload')
#include <gio/gio.h>

// 1. Write the .service unit
FILE* svc = fopen(
    "/home/me/.config/systemd/user/nucleus-myapp-sync.service", "w");
fprintf(svc,
    "[Unit]\\n"
    "Description=MyApp sync task\\n"
    "\\n"
    "[Service]\\n"
    "Type=oneshot\\n"
    "ExecStart=/home/me/.local/share/nucleus/scripts/sync.sh\\n"
    "Environment=NUCLEUS_TASK_ID=sync\\n");
fclose(svc);

// 2. Write the .timer unit
FILE* tmr = fopen(
    "/home/me/.config/systemd/user/nucleus-myapp-sync.timer", "w");
fprintf(tmr,
    "[Unit]\\n"
    "Description=Timer for MyApp sync\\n"
    "\\n"
    "[Timer]\\n"
    "OnUnitActiveSec=1h\\n"
    "AccuracySec=1m\\n"
    "Persistent=true\\n"
    // Constraints aren't expressible here. systemd has 'ConditionACPower='
    // and 'ConditionPathExists=' but no "unmetered network" knob — you
    // gate inside the script.
    "\\n"
    "[Install]\\n"
    "WantedBy=timers.target\\n");
fclose(tmr);

// 3. Write the self-destructing wrapper script (so uninstall is clean)
FILE* sh = fopen(
    "/home/me/.local/share/nucleus/scripts/sync.sh", "w");
fprintf(sh,
    "#!/bin/sh\\n"
    "BIN=/opt/myapp/MyApp\\n"
    "if [ ! -x \\"$BIN\\" ]; then\\n"
    "  systemctl --user disable --now nucleus-myapp-sync.timer\\n"
    "  rm -f ~/.config/systemd/user/nucleus-myapp-sync.{service,timer}\\n"
    "  systemctl --user daemon-reload\\n"
    "  rm -- \\"$0\\"\\n"
    "  exit 0\\n"
    "fi\\n"
    "# Check constraints — network / battery / idle — by hand\\n"
    "[ \\"$(cat /sys/class/power_supply/BAT0/capacity)\\" -lt 15 ] && exit 0\\n"
    "\\"$BIN\\" --nucleus-scheduler-run sync\\n");
fclose(sh);
chmod(sh, 0755);

// 4. Reload + enable via D-Bus (or shell out to systemctl)
GDBusConnection* bus = g_bus_get_sync(G_BUS_TYPE_SESSION, NULL, NULL);
g_dbus_connection_call_sync(bus,
    "org.freedesktop.systemd1",
    "/org/freedesktop/systemd1",
    "org.freedesktop.systemd1.Manager",
    "EnableUnitFiles",
    g_variant_new("(asbb)",
        (const char*[]){ "nucleus-myapp-sync.timer", NULL },
        FALSE, TRUE),
    NULL, G_DBUS_CALL_FLAGS_NONE, -1, NULL, NULL);
g_dbus_connection_call_sync(bus,
    "org.freedesktop.systemd1",
    "/org/freedesktop/systemd1",
    "org.freedesktop.systemd1.Manager",
    "Reload",
    NULL, NULL, G_DBUS_CALL_FLAGS_NONE, -1, NULL, NULL);

// + Retry policy: yours to encode (the wrapper has to remember
//   attempt count in a per-task properties file)
// + Calendar tasks: separate OnCalendar= syntax to generate
// + Input data: yours to store + re-read (we picked .properties files)
// + Flatpak/Snap: sandboxed, can't write to ~/.config/systemd at all —
//   need xdg-portal Background or a wholly separate codepath`,
      },
    ],
  },
  {
    id: 'update',
    nameKey: 'exUpdate',
    iconPath: 'M21 12a9 9 0 11-3-6.7M21 4v5h-5',
    nucleus: `import dev.nucleusframework.updater.NucleusUpdater
import dev.nucleusframework.updater.UpdateResult
import dev.nucleusframework.updater.provider.GitHubProvider

val updater = NucleusUpdater {
    provider = GitHubProvider(owner = "myorg", repo = "myapp")
}

when (val r = updater.checkForUpdates()) {
    is UpdateResult.Available -> {
        updater.downloadUpdate(r.info).collect { p ->
            ui.setProgress(p.percent)
            if (p.file != null) updater.installAndRestart(p.file!!)
        }
    }
    is UpdateResult.NotAvailable -> {}
    is UpdateResult.Error        -> log(r.exception)
}`,
    natives: [
      {
        os: 'macOS · Sparkle',
        lang: 'swift',
        bytes: '~120+ lines + framework',
        code: `// Apple ships no auto-updater. Sparkle is the de-facto SDK — third-party,
// MIT-licensed, but you bake the entire framework into your .app bundle,
// implement EdDSA code-signing yourself, host an appcast.xml on a server,
// and implement the SUUpdater delegate to actually drive the UI.
import Sparkle

@main
struct MyApp: App {
    let controller = SPUStandardUpdaterController(
        startingUpdater: true,
        updaterDelegate: nil,
        userDriverDelegate: nil)

    var body: some Scene { WindowGroup { ContentView() } }
}

// 1. Host an appcast.xml on your CDN — handwritten or generated:
//    <rss xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
//      <channel>
//        <item>
//          <title>Version 1.2.3</title>
//          <sparkle:version>1.2.3</sparkle:version>
//          <sparkle:minimumSystemVersion>14.0</sparkle:minimumSystemVersion>
//          <enclosure
//              url="https://cdn.example/MyApp-1.2.3.zip"
//              length="98000000"
//              type="application/octet-stream"
//              sparkle:edSignature="…base64…"/>
//        </item>
//      </channel>
//    </rss>

// 2. Generate the EdDSA signing key + sign every release artifact.
//    Apple's notarization is separate — you also have to staple it.

// 3. Wire up Info.plist:
//      SUFeedURL = https://cdn.example/appcast.xml
//      SUPublicEDKey = <your base64 public key>
//      SUEnableInstallerLauncherService = YES
//      INSTALLER_LAUNCHER_TOOL embedded helper

// 4. For ZIP-based updates (the modern path), Sparkle drops the new
//    .app into place via a helper tool, which itself requires
//    code-signing + sandboxing entitlements + a separate install path.

// + If you ship to the App Store, none of the above applies — Apple
//   handles updates and forbids Sparkle entirely. Two release pipelines.
// + No support for delta updates, no progress observation outside the
//   Sparkle UI, no "patch only" rollout. The framework is opinionated.
// + Out-of-cycle Sparkle CVEs (CVE-2016-4140, CVE-2022-31019, …) require
//   re-shipping the framework with your next release.`,
      },
      {
        os: 'Windows · WinUI 3',
        lang: 'cpp',
        bytes: '~155 lines',
        code: `// Windows App SDK has no in-app updater. You write the full pipeline.
#include <windows.h>
#include <winhttp.h>
#include <wincrypt.h>

// 1. Parse your own update manifest. Most teams ship a YAML or JSON
//    blob alongside the installer. We'll roll a tiny JSON one.
//    {
//      "version": "1.2.3",
//      "url": "https://cdn.example/MyApp-1.2.3.exe",
//      "sha512": "base64hash",
//      "size": 85000000
//    }
//    Compare to current version (parse semver yourself).

bool checkForUpdate(VersionInfo current, UpdateInfo* out) {
    HINTERNET s = WinHttpOpen(L"MyApp/1.0",
        WINHTTP_ACCESS_TYPE_DEFAULT_PROXY, NULL, NULL, 0);
    HINTERNET c = WinHttpConnect(s, L"cdn.example", 443, 0);
    HINTERNET r = WinHttpOpenRequest(c, L"GET",
        L"/latest.json", NULL, NULL, NULL, WINHTTP_FLAG_SECURE);
    WinHttpSendRequest(r, NULL, 0, NULL, 0, 0, 0);
    WinHttpReceiveResponse(r, NULL);
    // parse, fill *out, compare versions, return true/false
    // …
}

// 2. Download with progress
bool downloadInstaller(const wchar_t* url, const wchar_t* dest,
                       std::function<void(double)> onProgress) {
    // open WinHttp request, stream chunks to disk, fire onProgress
    // (the JDK has HttpClient; native C++ on Windows = WinHttp from scratch)
}

// 3. Verify SHA-512
bool verifySha512(const std::wstring& file, const std::string& expected) {
    HCRYPTPROV prov; HCRYPTHASH hash;
    CryptAcquireContextW(&prov, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT);
    CryptCreateHash(prov, CALG_SHA_512, 0, 0, &hash);

    HANDLE f = CreateFileW(file.c_str(), GENERIC_READ, FILE_SHARE_READ,
        NULL, OPEN_EXISTING, 0, NULL);
    BYTE buf[8192]; DWORD n;
    while (ReadFile(f, buf, sizeof(buf), &n, NULL) && n > 0)
        CryptHashData(hash, buf, n, 0);
    CloseHandle(f);

    BYTE digest[64]; DWORD len = 64;
    CryptGetHashParam(hash, HP_HASHVAL, digest, &len, 0);
    CryptDestroyHash(hash); CryptReleaseContext(prov, 0);
    return base64(digest, 64) == expected;
}

// 4. Detect installer type (NSIS / MSI / EXE) — different silent flags
//    NSIS:  installer.exe /S
//    MSI:   msiexec /i installer.msi /passive /norestart
//    InnoSetup: installer.exe /SILENT /SUPPRESSMSGBOXES /NORESTART

// 5. Elevate if needed
SHELLEXECUTEINFOW info = { sizeof(info) };
info.lpVerb       = L"runas";     // UAC prompt if installed per-machine
info.lpFile       = installer.c_str();
info.lpParameters = L"/S";
info.nShow        = SW_HIDE;
info.fMask        = SEE_MASK_NOCLOSEPROCESS;
ShellExecuteExW(&info);

// 6. Restart logic — kill the current process AFTER spawning the installer
//    but BEFORE the installer overwrites our binary, or we corrupt the
//    download. Subtle dance — get it wrong, app silently fails to restart.
//    The canonical pattern: write a small relauncher.exe to %TEMP%,
//    launch it, exit. Relauncher waits for installer to finish, then
//    spawns the new app.

// 7. After-update post-launch detection: write a marker file before
//    quitting, re-read on next launch to show "What's new". (None of
//    this is provided by Windows — your code, your marker file format.)

// + WinUI 3 / Windows App SDK has no helper for ANY of this
// + Delta updates: separate problem entirely (BSDiff or Courgette)
// + Code signature verification: another CryptoAPI rabbit hole
// + MSIX / Store distribution: this whole module shouldn't run at all`,
      },
      {
        os: 'Linux · DEB / RPM',
        lang: 'c',
        bytes: '~95 lines + .deb plumbing',
        code: `// No in-app update on Linux unless you go AppImage. With DEB/RPM the
// expectation is "you publish a repo and the package manager updates".
// In practice — for an app you ship via your own CDN — you do this:
#include <gio/gio.h>
#include <openssl/sha.h>

// 1. Fetch your own JSON/YAML manifest (whichever you invented)
//    GET https://updates.example.com/latest-linux.yml
GDBusConnection* bus = g_bus_get_sync(G_BUS_TYPE_SESSION, NULL, NULL);
// (or libcurl, or GLib's GUnixSocketAddress + custom HTTP — pick one)
// parse YAML, compare against /etc/myapp/version

// 2. Detect format
//    .deb if /usr/bin/dpkg exists, .rpm if /usr/bin/rpm exists,
//    .AppImage if running from a mounted squashfs (/proc/self/maps)
char fmt[8];
if (access("/usr/bin/dpkg", X_OK) == 0)      strcpy(fmt, "deb");
else if (access("/usr/bin/rpm",  X_OK) == 0) strcpy(fmt, "rpm");
else if (running_as_appimage())              strcpy(fmt, "appimage");
else { /* abort: user uses pacman/zypper/portage — out of scope */ }

// 3. Download with libcurl-style streaming. Show progress in your UI.
//    (No standard "system updater" lib on Linux — every app rolls its own.)

// 4. Verify SHA-512
SHA512_CTX ctx; SHA512_Init(&ctx);
FILE* f = fopen(downloaded, "rb");
unsigned char buf[8192]; size_t n;
while ((n = fread(buf, 1, sizeof(buf), f)) > 0) SHA512_Update(&ctx, buf, n);
unsigned char digest[64]; SHA512_Final(digest, &ctx);
// base64 encode and compare against expected

// 5. Install — elevation MANDATORY for DEB/RPM
char cmd[512];
if (strcmp(fmt, "deb") == 0) {
    snprintf(cmd, sizeof cmd,
        "pkexec dpkg -i \\"%s\\"", downloaded);
} else if (strcmp(fmt, "rpm") == 0) {
    snprintf(cmd, sizeof cmd,
        "pkexec rpm -U \\"%s\\"", downloaded);
} else if (strcmp(fmt, "appimage") == 0) {
    // simpler — just replace the AppImage in place
    snprintf(cmd, sizeof cmd, "mv \\"%s\\" \\"%s\\"",
             downloaded, current_appimage_path());
}
int rc = system(cmd);

// 6. Restart yourself. fork + exec is the only reliable way.
if (fork() == 0) {
    execl(current_appimage_path(), current_appimage_path(), NULL);
}
exit(0);

// + No equivalent on Linux for "show progress while installing"
//   (DEB / RPM both block on pkexec, the user sees the polkit dialog)
// + AppImage doesn't ship a built-in updater either — AppImageUpdate
//   is a separate binary you bundle alongside.
// + Snap / Flatpak: this whole module shouldn't run — store handles it.
// + Arch / Gentoo / Void / NixOS users: file an issue.`,
      },
    ],
  },
  {
    id: 'taskbar',
    nameKey: 'exTaskbar',
    iconPath: 'M3 7h18v10H3zM3 12h12',
    nucleus: `import dev.nucleusframework.taskbar.Taskbar

// One API for dock badge (macOS) + taskbar overlay + Unity progress
Taskbar.setProgress(fraction = 0.62f, state = Taskbar.State.Normal)
Taskbar.setBadge(count = 3)
Taskbar.requestAttention(critical = true)`,
    natives: [
      {
        os: 'macOS · SwiftUI',
        lang: 'swift',
        bytes: '~26 lines',
        code: `// SwiftUI has no dock-tile API. Drop down to AppKit NSApp.dockTile —
// and for progress, draw your own view because there's no NSProgressAPI
// at the dock level.
import SwiftUI
import AppKit

extension NSApplication {
    func setDockProgress(_ p: Double) {
        let tile = dockTile
        let host = NSHostingView(rootView: DockProgress(value: p))
        host.frame = NSRect(x: 0, y: 0, width: 128, height: 128)
        tile.contentView = host
        tile.display()
    }
}

struct DockProgress: View {
    let value: Double
    var body: some View {
        Image(nsImage: NSApp.applicationIconImage)
            .overlay(alignment: .bottom) {
                ProgressView(value: value)
                    .progressViewStyle(.linear)
                    .padding(.horizontal, 8)
            }
    }
}

NSApp.dockTile.badgeLabel = "3"
NSApp.setDockProgress(0.62)
NSApp.requestUserAttention(.criticalRequest)
// + redraw the tile every time progress changes
// + handle Reduce Motion preference for the bouncing icon`,
      },
      {
        os: 'Windows · WinUI 3',
        lang: 'cpp',
        bytes: '~36 lines',
        code: `// Still COM ITaskbarList3 — WinUI 3 doesn't wrap it. Plus the new
// Windows App SDK badge API (BadgeNotification) is also separate.
#include <shobjidl_core.h>
#include <winrt/Microsoft.Windows.AppNotifications.Builder.h>

// 1. Progress on the taskbar button
ITaskbarList3* tb = nullptr;
CoCreateInstance(CLSID_TaskbarList, nullptr, CLSCTX_INPROC_SERVER,
                 IID_PPV_ARGS(&tb));
tb->HrInit();
tb->SetProgressValue(hwnd, 62, 100);
tb->SetProgressState(hwnd, TBPF_NORMAL);

// 2. Badge — Windows App SDK BadgeUpdateManager (UWP API, still works)
auto updater = BadgeUpdateManager::CreateBadgeUpdaterForApplication();
auto xml = BadgeUpdateManager::GetTemplateContent(
    BadgeTemplateType::BadgeNumber);
auto attrs = xml.GetElementsByTagName(L"badge").GetAt(0)
                .Attributes();
attrs.GetNamedItem(L"value").NodeValue() =
    winrt::PropertyValue::CreateString(L"3");
updater.Update(BadgeNotification(xml));

// 3. Flash window (request attention)
FLASHWINFO fi { sizeof(fi), hwnd,
    FLASHW_TRAY | FLASHW_TIMERNOFG, 5, 0 };
FlashWindowEx(&fi);

tb->Release();
// + wait for WM_TASKBARCREATED before any taskbar call
// + WinUI 3 has no per-window taskbar accessor — use XamlRoot.HostWindow
// + the BadgeUpdater path also requires AUMID registration`,
      },
      {
        os: 'Linux · libunity',
        lang: 'c',
        bytes: '~28 lines',
        code: `// libunity (still the only cross-DE option for progress + badge)
#include <unity/unity/unity.h>

UnityLauncherEntry* e = unity_launcher_entry_get_for_desktop_id(
    "my-app.desktop");

// 1. Progress
unity_launcher_entry_set_progress(e, 0.62);
unity_launcher_entry_set_progress_visible(e, TRUE);

// 2. Badge (count)
unity_launcher_entry_set_count(e, 3);
unity_launcher_entry_set_count_visible(e, TRUE);

// 3. Urgency (request attention)
unity_launcher_entry_set_urgent(e, TRUE);

// + libunity is Canonical-only — Unity, KDE, Cinnamon, Pantheon honour
//   the D-Bus signal it emits. GNOME ignores it entirely.
// + the .desktop file must exist and be in XDG_DATA_DIRS
// + no equivalent in libadwaita 1.x — there's no canonical GTK4 API
// + Wayland: same caveats — most compositors don't display badges
//   without a panel extension`,
      },
    ],
  },
];

function highlightCFamily(line: string): string {
  // Single-pass tokenizer — never re-processes already emitted HTML.
  // Tokens are matched in priority order; the first one wins.
  const RULES: Array<{ name: string; re: RegExp }> = [
    { name: 'com',  re: /\/\/.*$/y },
    { name: 'str',  re: /L?"(?:[^"\\]|\\.)*"/y },
    { name: 'ann',  re: /#(?:include|define|if|endif|pragma|ifdef|ifndef|else|elif)\b/y },
    { name: 'ann',  re: /@[A-Za-z_][A-Za-z0-9_]*/y },
    { name: 'num',  re: /\b\d+(?:\.\d+)?\b/y },
    { name: 'kw',   re: /\b(?:import|let|var|func|class|struct|enum|protocol|guard|if|else|while|for|in|return|throws|try|catch|throw|do|switch|case|default|break|continue|void|int|char|short|long|bool|float|double|unsigned|signed|true|false|nil|null|nullptr|NULL|static|const|extern|using|namespace|public|private|protected|new|delete|sizeof|typedef|template|typename|virtual|override|inline|auto|register|volatile|mutable|friend|operator|this|self)\b/y },
    { name: 'type', re: /\b[A-Z][A-Za-z0-9_]+\b/y },
    { name: 'fn',   re: /\b[a-z_][a-zA-Z0-9_]*(?=\()/y },
  ];

  let i = 0;
  let out = '';
  let plain = '';
  while (i < line.length) {
    let matched: { rule: { name: string; re: RegExp }; text: string } | null = null;
    for (const rule of RULES) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(line);
      if (m && m.index === i) { matched = { rule, text: m[0] }; break; }
    }
    if (matched) {
      if (plain) { out += escapeHtml(plain); plain = ''; }
      out += `<span class="ck-${matched.rule.name}">${escapeHtml(matched.text)}</span>`;
      i += matched.text.length;
    } else {
      plain += line[i];
      i += 1;
    }
  }
  if (plain) out += escapeHtml(plain);
  return out;
}

function highlightForLang(line: string, lang: string): string {
  if (lang === 'kotlin') return highlightKotlin(line);
  if (lang === 'bash') return highlightBash(line);
  return highlightCFamily(line);
}

/* compact code renderer for NativeParadox — handles multi-language coloring */
function CodeMini({ code, lang }: { code: string; lang: string }) {
  const lines = code.split('\n');
  return (
    <pre className="np-pre">
      <code>
        {lines.map((line, i) => (
          <div key={i} className="np-line">
            <span className="np-lineno">{i + 1}</span>
            <span
              className="np-linecode"
              dangerouslySetInnerHTML={{ __html: highlightForLang(line, lang) }}
            />
          </div>
        ))}
      </code>
    </pre>
  );
}

interface NativeParadoxProps {
  lang: Lang;
}

export function NativeParadox({ lang }: NativeParadoxProps) {
  const [exId, setExId] = useState<string>(NATIVE_EXAMPLES[0].id);
  const [osIdx, setOsIdx] = useState(0);

  const example = NATIVE_EXAMPLES.find((e) => e.id === exId)!;
  const nat = example.natives[osIdx];

  // Count source line totals across all 3 OSes for the dramatic ratio number
  const totalNativeLines = example.natives.reduce((acc, n) => acc + n.code.split('\n').length, 0);
  const nucleusLines = example.nucleus.split('\n').length;
  const ratio = Math.round(totalNativeLines / nucleusLines);
  const linesWord = pick(npT.lines, lang);

  return (
    <section className="np" id="paradigm">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(npT.eyebrow, lang)}
          title={pick(npT.title, lang)}
          subtitle={pick(npT.subtitle, lang)}
        />

        {/* Example selector */}
        <div className="np-examples">
          {NATIVE_EXAMPLES.map((e) => (
            <button
              key={e.id}
              onClick={() => { setExId(e.id); setOsIdx(0); }}
              className={`np-ex ${e.id === exId ? 'is-active' : ''}`}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d={e.iconPath} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {pick(npT[e.nameKey], lang)}
            </button>
          ))}
        </div>

        <div className="np-grid">
          {/* Left: native */}
          <div className="np-side np-side-native">
            <div className="np-side-head">
              <div className="np-side-label np-label-old">{pick(npT.nativeApi, lang)} · {nat.os}</div>
              <div className="np-os-tabs">
                {example.natives.map((n, i) => (
                  <button
                    key={n.os}
                    onClick={() => setOsIdx(i)}
                    className={`np-os ${i === osIdx ? 'is-active' : ''}`}
                  >{n.os}</button>
                ))}
              </div>
            </div>
            <div className="np-code np-code-native">
              <CodeMini code={nat.code} lang={nat.lang}/>
            </div>
            <div className="np-foot np-foot-native">
              <span className="np-foot-bytes">{nat.bytes}</span>
              <span className="np-foot-dot"/>
              <span>{pick(npT.threadingNote, lang)}</span>
            </div>
          </div>

          {/* Big arrow between */}
          <div className="np-arrow" aria-hidden="true">
            <div className="np-arrow-ratio">
              <div className="np-arrow-num">{ratio}×</div>
              <div className="np-arrow-num-k">{pick(npT.fewerLines, lang)}</div>
            </div>
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" className="np-arrow-icon">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="np-arrow-tag">
              <img src="/assets/logo.png" alt="" />
              Nucleus
            </div>
          </div>

          {/* Right: Nucleus */}
          <div className="np-side np-side-nucleus">
            <div className="np-side-head">
              <div className="np-side-label np-label-new">
                <span className="np-label-dot"/> {pick(npT.oneApi, lang)}
              </div>
              <div className="np-os-tabs np-os-tabs-static">
                <button className="np-os is-active">macOS</button>
                <button className="np-os is-active">Windows</button>
                <button className="np-os is-active">Linux</button>
              </div>
            </div>
            <div className="np-code np-code-nucleus">
              <CodeMini code={example.nucleus} lang="kotlin"/>
            </div>
            <div className="np-foot np-foot-nucleus">
              <span className="np-foot-bytes">{nucleusLines} {linesWord}</span>
              <span className="np-foot-dot"/>
              <span>{pick(npT.nucleusFootnote, lang)}</span>
            </div>
          </div>
        </div>

        <div className="np-callout">
          <div className="np-callout-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M9 12l2 2 4-4M12 3l9 4v6c0 5-4 8-9 9-5-1-9-4-9-9V7l9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="np-callout-body">
            <div className="np-callout-h">{pick(npT.calloutH, lang)}</div>
            <div className="np-callout-d">{pick(npT.calloutD, lang)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
