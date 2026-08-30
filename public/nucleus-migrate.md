# Nucleus Migration — AI Agent Guide

> Self-contained, zero-install guide for AI coding agents (Claude Code, Cursor, Codex, Copilot Workspace, …) to migrate a JetBrains Compose Desktop / JVM desktop app to the Nucleus framework (https://nucleusframework.dev), interactively and step by step.

## For humans: how to use this file

Open your AI coding agent inside the app you want to migrate and paste:

```
Fetch https://nucleusframework.dev/nucleus-migrate.md and follow its instructions to
analyze this app and migrate it to Nucleus step by step.
```

That's it. The agent scans the project, asks you a few questions (backend, design system, features, installer, GraalVM, CI), then migrates one verifiable phase at a time. Everything below this line is addressed to the agent.

---

## Agent instructions

You are performing an interactive migration to Nucleus: **detect → interview → plan → migrate step by step → verify**. Never dump the whole migration at once; every phase ends with a working, verifiable state. All the knowledge you need is in this document — the "Reference:" sections at the bottom are your source of truth for Nucleus APIs. Do not invent Nucleus API names.

| Section in this document | Use during |
|---|---|
| Detection script | Phase 1 — project scan |
| Reference: Gradle setup and DSL migration | Phase 3.2 — plugin, DSL block swap, coordinates, renames/gotchas |
| Reference: Window shell (Tao) | Phase 3.3 — main(), DecoratedWindow, title bar, M2/M3/Jewel, secondary windows, threading |
| Reference: AWT/Swing removal | Phase 3.4 — every AWT/Swing hit → Tao-safe replacement table |
| Reference: Feature adoption | Phase 3.5 — notifications, tray, updater, deep links, dark mode, taskbar, trust store |
| Reference: Packaging | Phase 3.6 — formats, MSI→NSIS, compression, signing |
| Reference: GraalVM | Phase 3.7 — feasibility triage + setup + workflow |
| Reference: CI/CD | Phase 3.8 — setup-nucleus action, release matrix, update feeds |
| Reference: Real-world example (Flocon) | Anytime — ordering template and the 10 costliest gotchas |

Live docs: https://nucleusframework.dev (full text: https://nucleusframework.dev/llms-full.txt). Official build-migration guide: https://nucleusframework.dev/docs/migrate/from-jb-compose

### Phase 1 — Scan

1. Target = the project the user pointed you at (default: current directory). Verify it is a Gradle project.
2. Resolve the latest Nucleus version (snippets below use placeholders like `<version>`):
   `curl -s https://repo1.maven.org/maven2/dev/nucleusframework/nucleus.nucleus-application/maven-metadata.xml | grep -o '<latest>[^<]*'`
3. Save the code block from the "Detection script" section below to `/tmp/nucleus-detect.py` (or a temp dir on Windows) and run:
   ```bash
   python3 /tmp/nucleus-detect.py <target>          # human report
   python3 /tmp/nucleus-detect.py <target> --json   # structured, if you prefer
   ```
   If `python3` is unavailable, grep the project manually using the pattern tables inside the script.
4. Read the key files the scanner points at (main entry point, the `compose.desktop` block, workflows) to judge each hit in context — e.g. `BufferedImage` is fine, `SwingPanel` is fatal on Tao.
5. Present a readable findings summary to the user: what the app is (KMP? single module?), window shell, design system, every feature signal with its Nucleus counterpart, packaging today, CI today, GraalVM red/green flags. If Nucleus 1.x (`io.github.kdroidfilter.nucleus`) is detected, this is a namespace upgrade — say so and follow the 1.x note in the Gradle reference.

### Phase 2 — Interview

Ask the user in two short rounds (use your environment's structured question tool if you have one, e.g. AskUserQuestion in Claude Code; otherwise plain questions in chat). Base options on scan results — never offer something contradicted by the scan; mark the scan-recommended choice "(Recommended)".

Round 1 — architecture:
1. **Backend**: Tao (Recommended — no AWT, faster startup, GraalVM-ready) vs keep AWT backend (`decorated-window-jni`, legacy — only if heavy Swing interop was detected).
2. **Design system** for window chrome, pre-selected from scan: Material 3 / Material 2 / Jewel / core only (custom).
3. **Migration mode**: step-by-step (pause at every checkpoint for user validation — Recommended) vs autonomous (migrate everything, single review at the end).
4. **Scope**: window shell + everything below, or build/packaging only (keep AWT windows for now — valid first step).

Round 2 — features & distribution (skip items scope excludes):
1. **Features to adopt** (multi-select; only offer what the scan justifies + always offer notifications/updater/tray as enhancements): notifications, tray, auto-update, deep links, taskbar progress, system accent color, OS trust store, energy manager.
2. **Windows installer**: switch MSI→NSIS (Recommended: auto-update + differential downloads; WARNING if MSI is currently shipped: existing installs won't auto-upgrade — confirm the installed base is small or a migration note is acceptable) vs keep MSI vs both.
3. **GraalVM native image**: enable now / try later (only offer "now" if the feasibility triage in the GraalVM reference passes) / JVM + AOT cache instead (JDK 25+).
4. **CI update**: migrate workflows to setup-nucleus + release pipeline, yes/no.

### Phase 3 — Plan, then execute phase by phase

Produce a short numbered plan from the answers (only the selected phases), show it, then execute. In step-by-step mode, end each phase with its checkpoint and ask the user to validate before continuing (continue / fix something / skip next). In autonomous mode run checkpoints yourself and keep a log for the final report.

**Ordering (skip unselected):**

1. **Prerequisites**: Gradle wrapper ≥ 8 (9+ recommended), consistent `jvmToolchain(N)` across ALL modules (KMP especially), Node.js present for installer packaging.
2. **Gradle migration** (Gradle reference): add plugin, swap `compose.desktop.application {}` → `nucleus.application {}` (they cannot coexist), swap DSL imports, add runtime deps.
   *Checkpoint*: `./gradlew tasks --group nucleus` lists tasks; `./gradlew run` still launches the unmodified app.
3. **Window shell** (Window shell reference): main() → `nucleusApplication {}` + `[Material|Jewel]DecoratedWindow`, title bar, theme-wraps-window inversion, secondary windows via `HostedWindow`/scope pattern.
   *Checkpoint*: `./gradlew run` — user visually validates chrome, drag, fullscreen, minimize, secondary windows, dark-mode flip.
4. **AWT removal** (AWT reference): triage every `awt`/`swing`/`window` hit from the scan with the table; migrate or consciously keep (record which). Drop `kotlinx-coroutines-swing`, `apple.awt.*` props.
   *Checkpoint*: compile + run + exercise each touched feature (file dialogs, links, clipboard…).
5. **Feature adoption** (Features reference): one feature at a time, in the user's selected order. Delete the hand-rolled/precursor implementation in the same change the Nucleus one lands.
   *Checkpoint per feature*: runtime demo of the feature (send a notification, trigger the tray, `open myapp://test`…). Note: notifications on macOS need `runDistributable` (unbundled apps are silently dropped).
6. **Packaging** (Packaging reference): target formats, NSIS block, compression (+ per-format overrides), homepage for Deb, `Zip` next to `Dmg` if updater, signing carry-over.
   *Checkpoint*: `./gradlew packageDistributionForCurrentOS`, list artifacts with sizes, install/launch one locally if possible.
7. **GraalVM** (GraalVM reference): enable, `runGraalvmNative` loop, fix metadata, then `packageGraalvmNativeDistributionForCurrentOS`.
   *Checkpoint*: native binary launches and core flows work.
8. **CI** (CI reference): swap setup steps for `setup-nucleus` (PIN `java-version` — its default is 25), packaging task swap, release fan-in with update feeds.
   *Checkpoint*: workflow YAML review with the user; optionally push a branch and watch the run.

### Phase 4 — Final report

Summarize: what changed per phase, what was consciously kept (e.g. AWT clipboard), behavior changes the user gets for free (single instance ON by default, live dark mode), leftovers/TODOs (MSI upgrade note for existing users, ProGuard orphaned if GraalVM replaced it, features skipped), and suggested next steps (adopt updater once feeds publish, tray, store formats).

### Non-negotiable rules

- One phase per commit-sized change; never leave the tree broken between phases.
- Every code suggestion must come from the Reference sections or the live docs — do not invent Nucleus API names.
- When scan evidence and user expectation conflict (e.g. "we don't use AWT" but the scan shows hits), show the evidence and ask.
- Behavior changes are opt-in: single-instance is enabled by default by `nucleusApplication` — tell the user; pass `enableSingleInstance = false` if they refuse.
- If a blocker appears mid-phase (unsupported interop like SwingPanel-heavy UI), stop, present options (NativeView/WebView port, keep AWT backend, defer), and let the user choose.

---

## Detection script

Save this to `/tmp/nucleus-detect.py` and run it against the project root:

```python
#!/usr/bin/env python3
"""Nucleus migration detector.

Scans a Gradle/Compose Desktop project and reports every signal relevant to a
migration to the Nucleus framework: AWT/Swing usage, tray, notifications,
window decoration, design system, packaging formats, precursor libraries,
GraalVM feasibility and CI workflows.

Usage:
    python3 detect.py [project_root] [--json]

Output: human-readable markdown report on stdout (default) or JSON (--json).
Exit code: 0 = scan OK, 2 = not a Gradle project.
"""

import json
import os
import re
import sys
from collections import defaultdict

SOURCE_EXTS = {".kt", ".kts", ".java"}
BUILD_FILES = {"build.gradle.kts", "build.gradle", "settings.gradle.kts", "settings.gradle"}
SKIP_DIRS = {".git", ".gradle", "build", "node_modules", ".idea", ".kotlin", "out", ".fleet"}

# ---------------------------------------------------------------------------
# Pattern tables. Each entry: (category, key, regex, human label)
# Categories drive the report sections; keys are stable identifiers the skill
# maps to Nucleus modules in references/features.md.
# ---------------------------------------------------------------------------

SOURCE_PATTERNS = [
    # --- Entry point / window shell ---
    ("window", "compose_application", r"import\s+androidx\.compose\.ui\.window\.(application|singleWindowApplication)", "Compose Desktop AWT application {} entry point"),
    ("window", "compose_window", r"import\s+androidx\.compose\.ui\.window\.Window\b", "androidx Window composable (AWT-backed)"),
    ("window", "undecorated", r"undecorated\s*=\s*true", "Undecorated window (custom title bar likely)"),
    ("window", "transparent_window", r"transparent\s*=\s*true", "Transparent window"),
    ("window", "window_placement", r"WindowPlacement\.(Fullscreen|Maximized)", "WindowPlacement fullscreen/maximized"),
    ("window", "menubar", r"\bMenuBar\s*[({]|import\s+androidx\.compose\.ui\.window\.MenuBar", "Compose MenuBar (AWT menu)"),
    ("window", "compose_dialog", r"import\s+androidx\.compose\.ui\.window\.DialogWindow", "DialogWindow (AWT OS window — in-composition Dialog is fine)"),
    ("window", "apple_awt_props", r"apple\.awt\.|apple\.laf\.", "apple.awt/laf system properties (obsolete on Tao)"),
    ("window", "jewel_decorated", r"org\.jetbrains\.jewel\.window\.DecoratedWindow", "Jewel DecoratedWindow (JBR-based)"),
    # --- AWT / Swing direct usage ---
    ("awt", "awt_desktop", r"java\.awt\.Desktop|Desktop\.getDesktop\(\)", "java.awt.Desktop (browse/open/mail)"),
    ("awt", "awt_tray", r"java\.awt\.SystemTray|java\.awt\.TrayIcon", "java.awt SystemTray/TrayIcon"),
    ("awt", "awt_toolkit", r"java\.awt\.Toolkit|Toolkit\.getDefaultToolkit", "java.awt.Toolkit"),
    ("awt", "awt_clipboard", r"java\.awt\.datatransfer|getSystemClipboard", "AWT clipboard"),
    ("awt", "awt_robot", r"java\.awt\.Robot\b", "java.awt.Robot"),
    ("awt", "awt_graphics_env", r"GraphicsEnvironment|GraphicsDevice", "AWT GraphicsEnvironment/Device (screen info)"),
    ("awt", "awt_filedialog", r"java\.awt\.FileDialog|javax\.swing\.JFileChooser", "AWT/Swing file dialogs"),
    ("awt", "swing", r"import\s+javax\.swing|SwingUtilities|SwingPanel", "Swing usage (javax.swing / SwingPanel)"),
    ("awt", "awt_taskbar", r"java\.awt\.Taskbar|Taskbar\.getTaskbar", "java.awt.Taskbar (badge/progress/menu)"),
    ("awt", "awt_splash", r"java\.awt\.SplashScreen", "AWT SplashScreen"),
    ("awt", "awt_image", r"java\.awt\.image\.BufferedImage|javax\.imageio\.ImageIO", "AWT imaging (BufferedImage/ImageIO)"),
    ("awt", "awt_font", r"java\.awt\.Font\b|java\.awt\.FontMetrics", "AWT fonts"),
    ("awt", "awt_headless", r"java\.awt\.headless", "AWT headless flag manipulation"),
    # --- Design system ---
    ("theme", "material2", r"import\s+androidx\.compose\.material\.(?!icons)", "Material 2"),
    ("theme", "material3", r"import\s+androidx\.compose\.material3\.", "Material 3"),
    ("theme", "jewel", r"import\s+org\.jetbrains\.jewel\.", "Jewel (IntelliJ look)"),
    # --- Features with a native Nucleus equivalent ---
    ("feature", "compose_tray", r"import\s+androidx\.compose\.ui\.window\.Tray|rememberTrayState", "Compose Tray composable (AWT tray)"),
    ("feature", "tray_notification", r"rememberNotification|TrayState.*sendNotification|\.sendNotification\(", "Notifications via AWT TrayState"),
    ("feature", "dark_mode_detection", r"isSystemInDarkTheme\(\)", "isSystemInDarkTheme (static on desktop, no live OS updates)"),
    ("feature", "custom_single_instance", r"ServerSocket\(\s*\d|FileLock|LockFile|single.?instance", "Hand-rolled single-instance mechanism"),
    ("feature", "custom_update_check", r"releases/latest|/releases/download/|UpdateChecker|checkForUpdate", "Hand-rolled update check (GitHub releases…)"),
    ("feature", "uri_handler", r"LocalUriHandler|UriHandler", "Compose UriHandler (AWT Desktop.browse underneath)"),
    ("feature", "screen_wake", r"SetThreadExecutionState|caffeinate|IOPMAssertionCreate|keep.?awake", "Hand-rolled screen-awake / power management"),
    ("feature", "deep_link_custom", r"CFBundleURLTypes|x-scheme-handler|registerUriScheme", "Custom deep-link / URI-scheme registration"),
    # --- Precursor libraries (source-level imports) ---
    ("deps", "kdroid_tray_src", r"io\.github\.kdroidfilter\.composenativetray|com\.kdroid\.composetray", "kdroid tray lib imports (→ dev.nucleusframework:composenativetray)"),
    ("deps", "kdroid_platformtools_src", r"io\.github\.kdroidfilter\.platformtools", "kdroid platformtools imports (→ Nucleus modules)"),
    ("deps", "nucleus_1x_src", r"io\.github\.kdroidfilter\.nucleus", "Nucleus 1.x imports (→ dev.nucleusframework namespace)"),
    # --- GraalVM feasibility signals ---
    ("graalvm", "reflection", r"Class\.forName|::class\.java\.getDeclared|kotlin\.reflect\.full", "Runtime reflection"),
    ("graalvm", "service_loader", r"ServiceLoader\.load", "ServiceLoader usage"),
    ("graalvm", "dynamic_proxy", r"Proxy\.newProxyInstance", "Dynamic proxies"),
    ("graalvm", "method_handles", r"MethodHandles\.|invokedynamic", "MethodHandles"),
    ("graalvm", "jni_load", r"System\.load(Library)?\(", "Direct native library loading"),
]

BUILD_PATTERNS = [
    ("build", "compose_plugin", r"org\.jetbrains\.compose", "JetBrains Compose Gradle plugin"),
    ("build", "kmp_plugin", r"kotlin\(\"multiplatform\"\)|org\.jetbrains\.kotlin\.multiplatform", "Kotlin Multiplatform project"),
    ("build", "compose_desktop_block", r"compose\.desktop\s*\{", "compose.desktop application DSL (to replace with Nucleus DSL)"),
    ("build", "nucleus_plugin", r"dev\.nucleusframework", "Nucleus 2.x already present"),
    ("build", "nucleus_1x_plugin", r"io\.github\.kdroidfilter\.nucleus", "Nucleus 1.x present (namespace migration needed)"),
    ("build", "hot_reload_plugin", r"org\.jetbrains\.compose\.hot-reload|hotRun", "Compose Hot Reload (compatible with Nucleus, mainClass is propagated)"),
    ("packaging", "format_msi", r"TargetFormat\.Msi", "MSI installer (Nucleus recommends NSIS)"),
    ("packaging", "format_exe", r"TargetFormat\.Exe", "Exe installer"),
    ("packaging", "format_dmg", r"TargetFormat\.Dmg", "DMG (macOS)"),
    ("packaging", "format_pkg", r"TargetFormat\.Pkg", "PKG (macOS)"),
    ("packaging", "format_deb", r"TargetFormat\.Deb", "DEB (Linux)"),
    ("packaging", "format_rpm", r"TargetFormat\.Rpm", "RPM (Linux)"),
    ("packaging", "format_appimage", r"AppImage|appimage", "AppImage (Linux)"),
    ("packaging", "proguard", r"proguard|isMinifyEnabled|obfuscate", "ProGuard/minification config"),
    ("packaging", "jpackage_options", r"jvmArgs|javaHome|packageVersion|copyright|vendor\s*=", "jpackage metadata to carry over"),
    ("packaging", "macos_signing", r"signing\s*\{|notarization|bundleID", "macOS signing/notarization config"),
    ("packaging", "conveyor", r"dev\.hydraulic\.conveyor|conveyor\b", "Hydraulic Conveyor (packaging/update alternative)"),
    ("deps", "jna", r"net\.java\.dev\.jna|com\.sun\.jna", "JNA dependency (GraalVM-hostile, Nucleus uses JNI)"),
    ("deps", "kdroid_tray", r"composenativetray|compose-native-tray", "kdroid compose-native-tray (precursor lib)"),
    ("deps", "kdroid_notification", r"composenativenotification|compose-native-notification", "kdroid native notification lib (precursor)"),
    ("deps", "kdroid_darkmode", r"platformtools\.darkmodedetector|darkmodedetector", "kdroid dark-mode detector (precursor)"),
    ("deps", "kdroid_platformtools", r"io\.github\.kdroidfilter\.platformtools", "kdroid platformtools (precursor: release fetcher, app manager…)"),
    ("deps", "jsystemthemedetector", r"jSystemThemeDetector|com\.github\.Dansoftowner", "jSystemThemeDetector (AWT/JNA dark mode lib)"),
    ("deps", "dorkbox_tray", r"com\.dorkbox.*SystemTray|dorkbox", "dorkbox SystemTray"),
    ("deps", "update4j", r"org\.update4j", "update4j updater"),
    ("deps", "unique4j", r"unique4j", "unique4j single instance"),
    ("deps", "filekit", r"io\.github\.vinceglb.*filekit|filekit", "FileKit (KEEP — Nucleus-recommended dialogs on Tao; needs FileKit.init + Linux jdk.security.auth)"),
    ("deps", "coroutines_swing", r"kotlinx-coroutines-swing", "kotlinx-coroutines-swing (droppable on Tao — Dispatchers.Main is native)"),
    ("deps", "mpfilepicker", r"mpfilepicker|compose-multiplatform-file-picker", "compose-multiplatform-file-picker (AWT/Swing-backed)"),
    ("deps", "slf4j", r"org\.slf4j|logback", "SLF4J/Logback logging (fine; note GraalVM build-time init caveat)"),
    ("deps", "ktor_client", r"io\.ktor:ktor-client", "Ktor client (native-http-ktor can wire OS trust store)"),
    ("deps", "okhttp", r"com\.squareup\.okhttp3", "OkHttp (native-http-okhttp can wire OS trust store)"),
    ("graalvm", "native_image_plugin", r"org\.graalvm\.buildtools", "GraalVM native build tools already applied"),
]

CI_PATTERNS = [
    ("ci", "gh_workflows", r".", "GitHub Actions workflows present"),
    ("ci", "package_task", r"package(Release)?DistributionForCurrentOS|packageDmg|packageMsi|packageDeb", "CI runs Compose packaging tasks"),
    ("ci", "msi_artifact", r"\.msi\b", "CI publishes .msi artifacts"),
    ("ci", "release_upload", r"softprops/action-gh-release|gh release upload|upload-release", "CI uploads GitHub release artifacts (updater feed candidate)"),
    ("ci", "os_matrix", r"macos-|windows-|ubuntu-", "Per-OS runner matrix"),
    ("ci", "jdk_setup", r"actions/setup-java|temurin|zulu|corretto|jbr", "JDK setup step"),
]


def iter_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            yield os.path.join(dirpath, name), name


def scan(root):
    findings = defaultdict(list)  # key -> [{file, line, text}]
    meta = {"root": os.path.abspath(root), "kotlin_files": 0, "gradle_files": [], "workflows": []}
    labels = {}

    for cat, key, rx, label in SOURCE_PATTERNS + BUILD_PATTERNS + CI_PATTERNS:
        labels[key] = (cat, label)

    for path, name in iter_files(root):
        rel = os.path.relpath(path, root)
        ext = os.path.splitext(name)[1]
        is_workflow = f"{os.sep}.github{os.sep}workflows{os.sep}" in path and ext in {".yml", ".yaml"}
        is_build = name in BUILD_FILES or name == "libs.versions.toml" or (ext == ".kts" and "gradle" in name)
        is_source = ext in SOURCE_EXTS and not is_build

        if not (is_workflow or is_build or is_source):
            continue
        try:
            with open(path, encoding="utf-8", errors="replace") as fh:
                lines = fh.readlines()
        except OSError:
            continue

        if is_source:
            meta["kotlin_files"] += 1
            table = SOURCE_PATTERNS
        elif is_build:
            meta["gradle_files"].append(rel)
            table = BUILD_PATTERNS
        else:
            meta["workflows"].append(rel)
            table = CI_PATTERNS

        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("#"):
                continue
            for cat, key, rx, label in table:
                if key == "gh_workflows":
                    continue
                if re.search(rx, line):
                    if len(findings[key]) < 25:  # cap evidence per signal
                        findings[key].append({"file": rel, "line": i, "text": stripped[:160]})

    # Workflows often live at the repo root while the Gradle project is a subdir:
    # walk up to the git root looking for .github/workflows.
    if not meta["workflows"]:
        cur = os.path.abspath(root)
        for _ in range(4):
            parent = os.path.dirname(cur)
            if parent == cur:
                break
            cur = parent
            wf_dir = os.path.join(cur, ".github", "workflows")
            if os.path.isdir(wf_dir):
                for name in sorted(os.listdir(wf_dir)):
                    if not name.endswith((".yml", ".yaml")):
                        continue
                    path = os.path.join(wf_dir, name)
                    rel = os.path.relpath(path, root)
                    meta["workflows"].append(rel)
                    try:
                        with open(path, encoding="utf-8", errors="replace") as fh:
                            lines = fh.readlines()
                    except OSError:
                        continue
                    for i, line in enumerate(lines, 1):
                        for cat, key, rx, label in CI_PATTERNS:
                            if key == "gh_workflows":
                                continue
                            if re.search(rx, line) and len(findings[key]) < 25:
                                findings[key].append({"file": rel, "line": i, "text": line.strip()[:160]})
                break
            if os.path.isdir(os.path.join(cur, ".git")):
                break

    if meta["workflows"]:
        findings["gh_workflows"] = [{"file": w, "line": 1, "text": ""} for w in meta["workflows"]]
    return findings, meta, labels


def to_report(findings, meta, labels):
    categories = defaultdict(list)
    for key, hits in findings.items():
        cat, label = labels[key]
        categories[cat].append({"key": key, "label": label, "count": len(hits), "evidence": hits})

    order = ["build", "window", "theme", "awt", "feature", "deps", "packaging", "graalvm", "ci"]
    titles = {
        "build": "Build setup",
        "window": "Window shell / entry point",
        "theme": "Design system",
        "awt": "Direct AWT/Swing usage",
        "feature": "Features with a native Nucleus equivalent",
        "deps": "Dependencies to migrate or audit",
        "packaging": "Packaging",
        "graalvm": "GraalVM feasibility signals",
        "ci": "CI/CD",
    }
    return {"meta": meta, "sections": [
        {"id": c, "title": titles[c], "signals": sorted(categories[c], key=lambda s: -s["count"])}
        for c in order if categories.get(c)
    ]}


def render_markdown(report):
    out = [f"# Nucleus migration scan — {report['meta']['root']}", ""]
    out.append(f"Kotlin/Java files scanned: {report['meta']['kotlin_files']} · "
               f"Gradle files: {len(report['meta']['gradle_files'])} · "
               f"Workflows: {len(report['meta']['workflows'])}")
    if not report["sections"]:
        out.append("\nNo migration-relevant signals found. Is this a Compose Desktop project?")
    for sec in report["sections"]:
        out.append(f"\n## {sec['title']}")
        for sig in sec["signals"]:
            out.append(f"- **{sig['label']}** — {sig['count']} hit(s) `[{sig['key']}]`")
            for ev in sig["evidence"][:3]:
                loc = f"{ev['file']}:{ev['line']}"
                out.append(f"    - `{loc}` {ev['text']}" if ev["text"] else f"    - `{loc}`")
            if sig["count"] > 3:
                out.append(f"    - … {sig['count'] - 3} more")
    return "\n".join(out)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    root = args[0] if args else "."
    as_json = "--json" in sys.argv

    if not any(os.path.exists(os.path.join(root, f)) for f in BUILD_FILES):
        print(f"error: {root} does not look like a Gradle project (no build/settings file)", file=sys.stderr)
        sys.exit(2)

    findings, meta, labels = scan(root)
    report = to_report(findings, meta, labels)
    print(json.dumps(report, indent=2) if as_json else render_markdown(report))


if __name__ == "__main__":
    main()
```

---

## Reference: Gradle setup and DSL migration


### Prerequisites

JDK 17+ (25+ only for `enableAotCache`), Kotlin 2.0+, Gradle 8.0+. Nucleus 2.5.7 pairs with Kotlin 2.4.10 / Compose 1.12.0. Node.js is required for installer packaging (electron-builder pipeline).

### Step 1 — Apply the plugin (keep the JetBrains Compose plugin)

Plugin id `dev.nucleusframework` resolves from the **Gradle Plugin Portal** (no pluginManagement changes). Runtime modules publish to **Maven Central** under group `dev.nucleusframework`.

```kotlin
plugins {
    kotlin("jvm") version "2.4.10"                      // or multiplatform
    id("org.jetbrains.compose") version "1.12.0"        // KEEP — Hot Reload + IDE integration
    id("org.jetbrains.kotlin.plugin.compose") version "2.4.10"
    id("dev.nucleusframework") version "<nucleus-version>"
}

repositories { mavenCentral(); google() }
```

- The `org.jetbrains.compose` plugin is optional: without it, use the Nucleus accessor `implementation(nucleus.desktop.currentOs)` instead of `compose.desktop.currentOs`.
- KMP projects: works with a single JVM target; with more than one, call `from(target)` explicitly in `nucleus.application {}`.
- Verify install: `./gradlew tasks --group nucleus`.

### Step 2 — Move the DSL block (they CANNOT coexist)

Nucleus registers the same task names as Compose Desktop packaging; having both blocks is a hard `error()`. Remove `compose.desktop.application {}`, keep the plugin applied.

```diff
-import org.jetbrains.compose.desktop.application.dsl.TargetFormat
+import dev.nucleusframework.desktop.application.dsl.TargetFormat
```
Same package change for `CompressionLevel`, `SigningAlgorithm` and all other DSL types.

```diff
-compose.desktop {
-    application {
+nucleus.application {
     mainClass = "com.example.MainKt"
     nativeDistributions {
-        targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Deb)
+        targetFormats(TargetFormat.Dmg, TargetFormat.Zip, TargetFormat.Nsis, TargetFormat.Deb)
         packageName = "MyApp"
         packageVersion = "1.0.0"
+        homepage = "https://example.com"   // REQUIRED for Deb
     }
-    }
-}
+}
```

**Everything carries over identically**: `mainClass`, `mainJar`, `javaHome`, `args`, `jvmArgs`, `from()`, `nativeDistributions` metadata (appName/packageName/packageVersion/vendor/copyright/description/licenseFile), `modules()`/`includeAllModules`, `buildTypes { release { proguard {} } }`, per-OS blocks (`macOS { bundleID, signing, notarization, entitlements… }`, `windows { iconFile, upgradeUuid, console… }`, `linux { debMaintainer, menuGroup… }`).

**Renames / semantic changes:**
- `TargetFormat.AppImage` (jpackage app folder) → **`TargetFormat.RawAppImage`**. In Nucleus, `AppImage` means the *Linux AppImage* format. Biggest silent gotcha.
- `targetFormats` has **no default** — an empty set packages nothing.
- `windows { perUserInstall }` deprecated → `msi { perMachine }` (default **true**; `nsis { perMachine }` defaults **false**).
- `Exe` and `Nsis` are both NSIS installers now (electron-builder); `Pkg` is always App Store (sandboxed pipeline).
- `macOsSdkVersion = "26.0"` is the default → Liquid Glass ON. Set `null` to opt out.
- `compose.desktop.*` Gradle property names for signing/notarization are **unchanged** (`compose.desktop.mac.sign`, `…signing.identity`, `…notarization.appleID`) — existing CI secrets carry over verbatim.

### Step 3 — Runtime dependencies

```kotlin
dependencies {
    implementation(compose.desktop.currentOs)
    implementation("dev.nucleusframework:nucleus.nucleus-application:<v>")   // nucleusApplication {}
    implementation("dev.nucleusframework:nucleus.decorated-window-tao:<v>")  // recommended backend
    // pick ONE style adapter: nucleus.decorated-window-material3 / -material2 / -jewel
    // opt-in per feature (see features.md): nucleus.core-runtime, nucleus.updater-runtime,
    // nucleus.notification-common, nucleus.taskbar-progress(-tao), nucleus.darkmode-detector,
    // nucleus.system-color, nucleus.aot-runtime, nucleus.native-http…
}
```

Multi-module projects: only the app module applies the plugin and declares `nucleus.application {}`; pin the version once (`val nucleusVersion = "…"` or version catalog).

### New DSL capabilities to offer (opt-in)

```kotlin
nucleus.application {
    garbageCollector = GarbageCollector.Z         // SERIAL|PARALLEL|G1|Z|SHENANDOAH|EPSILON; unset = ergonomics
    nativeDistributions {
        compressionLevel = CompressionLevel.Maximum
        artifactName = "${'$'}{name}-${'$'}{version}-${'$'}{os}-${'$'}{arch}.${'$'}{ext}"
        cleanupNativeLibs = true
        splashImage = "splash.png"
        enableAotCache = true                     // JDK 25+, add nucleus.aot-runtime
        protocol("MyApp", "myapp")                // deep links
        fileAssociation("application/x-my", "myext", "My file")
        trustedCertificates.from(files("certs/corp-ca.crt"))
        publish { github { enabled = true; owner = "me"; repo = "app" } }
    }
    additionalLaunchers { create("helper") { mainClass = "…"; winConsole = true } }
    graalvm { isEnabled = true; imageName = "myapp" }   // see graalvm.md
}
```

Hot Reload: `org.jetbrains.compose.hot-reload` keeps working — Nucleus forwards `mainClass` to `hotRun`, and auto-adds `-XstartOnFirstThread` on macOS when tao is on the classpath.

Useful tasks after migration: `run`, `runDistributable`, `packageDistributionForCurrentOS`, `packageReleaseDistributionForCurrentOS`, `suggestRuntimeModules` (prints the `modules(...)` your app needs), `checkRuntime`, `notarizeDistributionForCurrentOS`.

### Coming from Nucleus 1.x instead?

Namespace rename only: plugin id and group `io.github.kdroidfilter.nucleus` → `dev.nucleusframework`; imports `io.github.kdroidfilter.nucleus.*` → `dev.nucleusframework.*`. Then follow the same feature steps.

---

## Reference: Window shell (Tao)


### Entry point

```kotlin
import dev.nucleusframework.application.nucleusApplication
import dev.nucleusframework.application.DecoratedWindow

fun main(args: Array<String>) = nucleusApplication(args) {
    // optional: aotTraining(duration = 45.seconds)   // AOT cache training auto-exit
    // optional: onDeepLink { uri -> navigate(uri) }
    DecoratedWindow(onCloseRequest = ::exitApplication, title = "MyApp") {
        App()
    }
}
```

`nucleusApplication(args, backend = NucleusBackend.Auto, enableSingleInstance = true, defaultLocale = null, dockIconFollowsWindows = false)` bootstraps in order: `GraalVmInitializer.initialize()` → single-instance lock (second launch relays deep link, exits 0) → platform priming (AutoLaunch cache, Windows AUMID) → backend resolution → application loop. `Auto` picks Tao when `decorated-window-tao` is on the classpath. Ship **exactly one** backend module. Keep pre-UI early-exit paths (CLI modes, scheduler bypass) ABOVE `nucleusApplication` — it acquires the lock first.

macOS: do **not** add `-XstartOnFirstThread` manually — the Tao layer dispatches to the AppKit main thread itself, and the flag would deadlock the AWT classes Compose touches. The plugin injects it only where needed (Hot Reload tasks).

### DecoratedWindow parameters

`onCloseRequest`, `state: WindowState = rememberWindowState()`, `visible`, `title`, `icon: Painter?`, `resizable`, `enabled` (Tao: applies at construction only), `focusable`, `alwaysOnTop`, `undecorated` (Tao only), `popupFor` (Linux subsurface overlay), `nativePopupLayers` (Compose Popups as real native panels), `hiddenFromDock`, `minimumSize: DpSize?`, `onPreviewKeyEvent`, `onKeyEvent`, `content: @Composable NucleusDecoratedWindowScope.() -> Unit`.

Compose's `WindowState` keeps working, including `placement = WindowPlacement.Fullscreen/Maximized`. Backend-agnostic handle: `nucleusWindow` in scope (or `LocalNucleusWindow`) — `isFocused/isMinimized/isMaximized/isFullscreen`, `focusFlow: StateFlow<Boolean>`, `setFullscreen()`, `setMinimumSize()`, `setIcon()`, `close()`, escape hatch `unsafe.taoWindow?.nativeHandle` (HWND/NSWindow for launcher APIs).

### Design system integration (pick ONE)

| App uses | Module | Window / title bar |
|---|---|---|
| Material 3 | `nucleus.decorated-window-material3` | `MaterialDecoratedWindow` + `MaterialTitleBar` + `rememberMaterialTitleBarStyle(MaterialTheme.colorScheme)` |
| Material 2 | `nucleus.decorated-window-material2` | same names, `.window.material2` package |
| Jewel (IntelliJ look) | `nucleus.decorated-window-jewel` | `JewelDecoratedWindow` + `JewelTitleBar` + `rememberJewelTitleBarStyle()`; needs jvmToolchain(25) + IntelliJ repos |
| None / custom | just tao | `DecoratedWindow` + `TitleBar {}` or `WindowScaffold` + `NucleusDecoratedWindowTheme(isDark, windowStyle, titleBarStyle)` |

The Material/Jewel wrappers re-provide the theme INSIDE the window (each Tao window owns its own ComposeScene — CompositionLocals don't cross scenes). Hence: the app theme must **wrap the window call**, and window-scoped locals must be re-provided per window.

### Title bar

Custom title bar (replaces `undecorated = true` + `WindowDraggableArea` hacks):

```kotlin
MaterialDecoratedWindow(…, titleBarStyle = style) {
    MaterialTitleBar(layoutPolicy = TitleBarLayoutPolicy.FillCenter) {
        SearchField(Modifier.align(Alignment.CenterHorizontally))  // FillCenter: max ONE center child
    }
    AppContent()
}
```

- Height: `style.copy(metrics = style.metrics.copy(height = 44.dp))`.
- `TitleBarScope`: `title`, `icon`, `Modifier.align(Alignment.Start/CenterHorizontally/End)`, `Modifier.titleBarClickable {}`.
- macOS niceties: `Modifier.newFullscreenControls()`, `Modifier.macOSLargeCornerRadius()`; the title bar reserves 78dp for traffic lights automatically.
- Design-system-agnostic chrome (2.2+): `WindowScaffold(titleBar = {…}, titleBarPlacement = TitleBarPlacement.Docked | Overlay(autoHideInFullscreen)) { contentPadding -> }` + `Modifier.windowDragArea()` / `noWindowDrag()`, `WindowControls(…)`, `LocalWindowChromeInsets`.
- Extra chrome: `WindowBackground(color)`, `WindowAppearance(WindowAppearanceMode.Dark)`, `WindowsBackdrop(WindowsBackdropStyle.Mica)` (Win 11), `Modifier.windowGlassRegion(WindowGlassRegionKind.Sidebar)` (macOS).

### Secondary windows & dialogs

- **App code**: call `MaterialDecoratedWindow`/`DecoratedWindow` anywhere in the composition; get the scope with `val scope = LocalNucleusApplicationScope.current` then `scope.MaterialDecoratedWindow(...)`. **Type the val explicitly as `NucleusApplicationScope`** — the scope extends AWT `ApplicationScope`, and overload resolution can silently pick the wrong extension.
- **Library/navigation code**: use `HostedWindow(...)` / `HostedDialog(...)` — chrome-agnostic; the app themes them by overriding `LocalNucleusWindowHost` with its own `NucleusWindowHost` implementation (see flocon-example.md for a full one).
- In-composition `androidx.compose.ui.window.Dialog(properties=…)` (the CMP dialog) needs NO change. Only real OS-level windows (`Window`, `DialogWindow`) must be migrated to `DecoratedWindow`/`DecoratedDialog`.
- Auto-sized windows (`DpSize(Unspecified, Unspecified)`) are not viable — give explicit sizes.
- Re-provide window-scoped CompositionLocals (escape stacks, etc.) inside each new window's content.

### Threading

`Dispatchers.Main` IS the Tao native event loop (ServiceLoader override shipped in decorated-window-tao). Drop `kotlinx-coroutines-swing`; replace `SwingUtilities.invokeLater`/`Dispatchers.Swing` with `Dispatchers.Main`. `collectAsStateWithLifecycle` works only INSIDE window content (no `LocalLifecycleOwner` above it — use `collectAsState()` there).

### URL opening

Use `LocalUriHandler.current.openUri(url)` — Nucleus wires it per backend (on Linux/Tao it spawns `xdg-open` because `java.awt.Desktop.browse` deadlocks the GLX/Tao loop). Direct `Desktop.getDesktop().browse()` is safe on macOS/Windows only.

### Tray-style / agent apps

`nucleusApplication(dockIconFollowsWindows = true)` (macOS menu-bar app), `DecoratedWindow(hiddenFromDock = true, undecorated = true)` for panels, `TaoStandalonePopup(...)` (ownerless non-activating native panel, built for tray popups), `SingleInstanceRestoreEffect { }` for "second launch reopens the popup". Tray icon itself: `dev.nucleusframework:composenativetray` (see features.md).

### Verification checklist after this step

`./gradlew run` then check: window opens with correct chrome; dragging/double-click maximize on the title bar; fullscreen enter/exit; minimize/restore; secondary windows/dialogs open with theme; Escape/keyboard shortcuts per window; dark-mode flip is live; on macOS the app menu name is correct.

---

## Reference: AWT/Swing removal


The Tao backend runs without AWT windows: anything needing an AWT `Window`/`Frame`/peer **crashes or silently fails**. Headless-style AWT APIs (imaging, fonts, clipboard) still work. Triage every `awt`/`swing` hit from the detect report with this table.

| Detected usage | Verdict on Tao | Replacement |
|---|---|---|
| `androidx.compose.ui.window.application` / `Window` | replace | `nucleusApplication {}` + `DecoratedWindow` / `MaterialDecoratedWindow` / `JewelDecoratedWindow` |
| `androidx.compose.ui.window.Tray`, `rememberTrayState` | **unsupported** (compiles, fails at runtime) | `dev.nucleusframework:composenativetray` (independent version, currently 2.0.x) |
| `TrayState.sendNotification` / `rememberNotification` | unsupported | `nucleus.notification-common` (`NotificationManager`) |
| `java.awt.Desktop.getDesktop().browse(uri)` | works on macOS/Windows; **deadlocks on Linux/Tao** (XAWT vs GLX loop) | `LocalUriHandler.current.openUri(url)` — Nucleus swaps in a Tao-safe handler (`xdg-open` on Linux) |
| `Desktop` about/preferences/quit handlers (`setAboutHandler`…) | AWT app-menu dead on Tao | `nucleus.menu-macos` `NativeMenuBar { Menu { Item } }` (no-op off macOS) |
| `java.awt.Toolkit.getDefaultToolkit().screenSize` | dead | `TaoScreenGeometry.primaryMonitorWorkAreaPx()` (nullable IntArray `[x,y,w,h]` in **physical** px, **work area** not full screen) + `primaryMonitorScaleFactor()` |
| `Toolkit.getDefaultToolkit().systemClipboard` / `java.awt.datatransfer` | works (no window needed) | keep, or Compose `LocalClipboardManager` for text |
| `java.awt.FileDialog` / `javax.swing.JFileChooser` | dead | FileKit `io.github.vinceglb:filekit-dialogs` (see flocon-example.md for init/module/proguard requirements) |
| `SwingPanel` / `javax.swing.*` embedded UI | **crashes at runtime** | Nucleus NativeView-based components: `dev.nucleusframework:composewebview` for HTML, `TextureView` for video/GL; otherwise reimplement in Compose |
| `java.awt.Dimension` + `window.minimumSize` | dead escape hatch | `minimumSize = DpSize(...)` parameter on `DecoratedWindow` |
| `java.awt.Taskbar` (badge/progress) | dead | `nucleus.taskbar-progress-tao` — extensions on `NucleusWindow` (`setTaskbarProgress(0.42)`, `requestTaskbarAttention()`) |
| `java.awt.SplashScreen` | dead | `nativeDistributions { splashImage = "splash.png" }` |
| `GraphicsEnvironment` / `GraphicsDevice` | dead | `TaoScreenGeometry`; for per-window scale use window APIs |
| `java.awt.Robot` | mostly works (uses CGEvent/XTest) | keep if needed; test per-OS |
| `BufferedImage` / `ImageIO` / `java.awt.Font` (headless imaging) | works | keep (ensure `java.desktop` stays in `modules(...)`) |
| `SwingUtilities.invokeLater` / `Dispatchers.Swing` / `kotlinx-coroutines-swing` | pointless on Tao | `Dispatchers.Main` is the native event loop; drop the `kotlinx-coroutines-swing` dependency |
| `androidx.compose.ui.window.DialogWindow` (OS-level dialog window) | replace | scoped `DecoratedDialog` / `HostedDialog`; in-composition `Dialog(properties=…)` (CMP dialog) is **fine as-is** |
| `MenuBar {}` under Window (AWT menu) | dead | `nucleus.menu-macos` for the macOS app menu; in-window Compose UI elsewhere |
| `apple.awt.*` / `apple.laf.*` system properties | obsolete | delete — Tao owns app name, appearance, menu bar |
| `java.awt.headless` manipulation | obsolete for UI | delete |
| jSystemThemeDetector / other JNA dark-mode libs | replace | `nucleus.darkmode-detector` — and from 2.3, `nucleusApplication` makes stock `isSystemInDarkTheme()` reactive for free |

Rule of thumb: if the API needs a *window or the AWT event loop*, it is dead on Tao. If it is pure computation (images, fonts, clipboard data), it works.

If too much AWT is load-bearing (heavy Swing interop, JCEF, etc.), offer the fallback: migrate the build/packaging to Nucleus now but keep the AWT backend (`nucleus.decorated-window-jni`, legacy/maintenance-only) and move to Tao later.

---

## Reference: Feature adoption


All artifacts: group `dev.nucleusframework`, artifactId `nucleus.<module>` (tray is the standalone `composenativetray`, independently versioned). Offer each block only when the detect report shows the signal, or as an "enhancement" the user opts into.

### Notifications — `[tray_notification]`, kdroid notification libs
Deps: `nucleus.notification-common` + the per-OS backends `nucleus.notification-windows` / `-linux` / `-macos` (the common module delegates to whichever is on the runtime classpath — verify they resolve transitively, otherwise add all three).
```kotlin
NotificationManager.initialize()          // once at startup
val n = notification(title = "Done", message = "Export finished",
        onActivated = { /* clicked */ }) {
    button("Open") { openFile() }         // max 5 buttons
    windows { scenario = ToastScenario.URGENT }
    macos { subtitle = "Details" }
    linux { urgency = Urgency.CRITICAL }
}
n.send()   // → NotificationResult.Success(handle) / Failure(reason)
```
Gotchas: never call `WindowsNotificationCenter.initialize()` yourself in `main()` — under Tao, `OleInitialize` fails `RPC_E_CHANGED_MODE` → native abort `0xC0000409`. macOS silently drops notifications from unbundled apps → test with `./gradlew runDistributable`.

### System tray — `[compose_tray]`, `[awt_tray]`, dorkbox, kdroid tray
Dep: `dev.nucleusframework:composenativetray` (own version line, ~2.0.x). AWT `Tray` compiles but is unsupported on Tao.
```kotlin
Tray(icon = Icons.Default.Favorite, tooltip = "MyApp", primaryAction = { showWindow() }) {
    Item("Open") { … }; Divider(); Item("Quit") { exitApplication() }
}
```
Icon accepts ImageVector/Painter/DrawableResource or `iconContent`; `windowsIcon`/`macLinuxIcon` split. Linux GNOME needs the AppIndicator extension. `TrayApp` (alpha) gives a tray-anchored Compose popup.

### Auto-update — `[custom_update_check]`, update4j, conveyor
Dep: `nucleus.updater-runtime` (+ optional `nucleus.native-http`). Build side: `publish { github { enabled = true; owner; repo } }` + CI uploading `latest*.yml` (see ci.md). macOS needs `TargetFormat.Zip` next to `Dmg`.
```kotlin
val updater = NucleusUpdater {
    provider = GitHubProvider("owner", "repo")   // or GenericProvider(baseUrl) for S3/any static host
    differentialDownload = true                  // blockmap-based delta downloads
}
when (val r = updater.checkForUpdates()) {
    is UpdateResult.Available -> {
        updater.downloadUpdate(r.info).collect { p -> /* progress; final emission has file != null */ }
        updater.installAndRestart(file)          // or installAndQuit(file)
    }
    else -> {}
}
// updater.wasJustUpdated() / consumeUpdateEvent() for post-update UX
```
Channels come from the tag (`v1.2.3` latest, `-beta.1` beta, `-alpha.1` alpha). Store formats (Pkg/AppX/Snap/Flatpak) are store-managed — `isUpdateSupported()` guards.

### Single instance — `[custom_single_instance]`, unique4j
**Automatic** in `nucleusApplication` (default `enableSingleInstance = true`): FileLock + restore-request relay; a second launch relays its deep-link/CLI and exits 0. DELETE hand-rolled ServerSocket/FileLock code. Opt out: `nucleusApplication(args, enableSingleInstance = false)`. Keep pre-UI early-exit paths ABOVE `nucleusApplication` (it acquires the lock first).

### Deep links — `[deep_link_custom]`, `[uri_handler]` for app URLs
Build: `nativeDistributions { protocol("MyApp", "myapp") }` (CFBundleURLTypes / registry / `.desktop` MimeType). Runtime, inside `nucleusApplication`:
```kotlin
onDeepLink { uri -> navigate(uri) }
```
Never use `installAwtAppleEventHandler()` with Tao (macOS deadlock). Test: `open myapp://x` / `start myapp://x` / `xdg-open myapp://x`.

### Dark mode — `[dark_mode_detection]`, jSystemThemeDetector
From Nucleus 2.3, `nucleusApplication` bridges `LocalSystemTheme`, so stock `isSystemInDarkTheme()` becomes **live** with zero code change (darkmode-detector is an api dep of nucleus-application). Imperative API if needed: `getPlatformDarkModeDetector().isDark()` / `registerListener {}`. Delete jSystemThemeDetector/JNA equivalents.

### System accent color / high contrast
Dep: `nucleus.system-color`. `systemAccentColor(): Color?` (composable, null → fall back to brand palette), `isSystemInHighContrast()`, `isSystemAccentColorSupported()`.

### Taskbar progress / attention — `[awt_taskbar]`, custom JNA
Tao: dep `nucleus.taskbar-progress-tao`, extensions on `NucleusWindow`: `setTaskbarProgress(0.42)`, `showTaskbarIndeterminate()`, `showTaskbarError()`, `hideTaskbarProgress()`, `requestTaskbarAttention()`; or `rememberTaoTaskbarProgress()`. AWT backends: `nucleus.taskbar-progress` + `TaskbarProgress.showProgress(window, 0.75)`. macOS progress is app-wide (NSDockTile); Linux uses Unity LauncherEntry D-Bus.

### Launcher extras (badges, jump lists, dock menu)
`nucleus.launcher-windows` (jump lists, overlay icons, thumbnail toolbar), `nucleus.launcher-linux` (badges, quicklists, urgency), `nucleus.launcher-macos` (Dock menu). `nucleus.menu-macos` `NativeMenuBar {}` for the macOS app menu (About/Preferences handlers).

### OS trust store — `[ktor_client]`, `[okhttp]`
`nucleus.native-http-ktor` / `nucleus.native-http-okhttp` / plain `nucleus.native-http` (`NativeHttpClient.create()`) — corporate proxies/SSL just work; also feeds the updater. Build-side alternative for custom CAs: `trustedCertificates.from(files("ca.crt"))`.

### Screen wake / energy — `[screen_wake]`
`nucleus.energy-manager` — screen-awake and efficiency APIs replacing `caffeinate`/`SetThreadExecutionState` hacks.

### Others worth offering when relevant
- `nucleus.core-runtime`: `NucleusApp` metadata, platform/executable-type detection.
- `nucleus.aot-runtime` + `enableAotCache = true` (JDK 25+): ~2× faster JVM cold start; `aotTraining(duration = 45.seconds)` inside `nucleusApplication` for training runs.
- Auto-launch at login (`lifecycle` docs: `AutoLaunch`), scheduler, service-management, fs-watcher, global-hotkey, media-control, system-info: point the user to nucleusframework.dev docs; add only on demand.
- PDF (`pdf` modules) and WebView (`composewebview`) for `SwingPanel`-replacement scenarios.

---

## Reference: Packaging


Nucleus packaging pipeline: jpackage builds the app-image, then **electron-builder** (`--prepackaged`) produces each installer. Store formats (Pkg, AppX, Flatpak) go through a parallel `createSandboxedDistributable`. Formats unsupported on the host OS are silently skipped. **Node.js is required** on the machine/CI for installer formats.

### Target formats (18)

`RawAppImage, Pkg, Deb, Rpm, Dmg, Exe, Msi, Nsis, NsisWeb, Portable, AppX, AppImage, Pacman, Snap, Flatpak, Zip, Tar, SevenZ`

Import changes from `org.jetbrains.compose.desktop.application.dsl.TargetFormat` to `dev.nucleusframework.desktop.application.dsl.TargetFormat` (same for `CompressionLevel`, `SigningAlgorithm`, and other DSL types).

Key semantics:
- `TargetFormat.AppImage` = Linux AppImage. The old jpackage app folder is now `RawAppImage`.
- `targetFormats` defaults to **empty** — nothing is packaged unless declared.
- `Exe` is NSIS under the hood (`electronBuilderTarget = "nsis"`); `Nsis` differs only in output naming.
- Store formats `Pkg` (always App Store), `AppX`, `Flatpak` switch to a sandboxed pipeline (native libs replaced by markers + `System.load` bytecode rewriting). Escape hatch: `sandboxing { keepNativeLibsInJars("lib-name") }`.
- Update manifests (`latest*.yml`) are produced for `Exe, Nsis, NsisWeb, Msi, Portable, Dmg, AppImage, Deb, Rpm` (+ `Zip` on macOS).

### MSI → NSIS (recommended switch)

NSIS gives auto-update support with differential downloads, a richer installer UX, and smaller artifacts. Keep `Msi` only if the app is deployed via GPO/Intune-style enterprise tooling.

```kotlin
nucleus.application {
    nativeDistributions {
        targetFormats(TargetFormat.Dmg, TargetFormat.Zip, TargetFormat.Nsis, TargetFormat.Deb)
        //                              ^ Zip REQUIRED next to Dmg for macOS auto-update

        windows {
            nsis {
                oneClick = false
                perMachine = false
                allowElevation = true
                allowToChangeInstallationDirectory = true
                createDesktopShortcut = true
                createStartMenuShortcut = true
                runAfterFinish = true
                // deleteAppDataOnUninstall, multiLanguageInstaller, installerLanguages,
                // installerIcon / uninstallerIcon / installerHeader / installerSidebar,
                // license, script / includeScript
            }
        }
    }
}
```

If keeping MSI: set a **stable** `upgradeUuid` (never change it once shipped) and `msi { perMachine }` (default `true`; supersedes the deprecated inverted `windows.perUserInstall`).

### Compression

```kotlin
nativeDistributions {
    compressionLevel = CompressionLevel.Maximum   // Store | Normal | Maximum | Ultra
    linux { appImage { compressionLevel = CompressionLevel.Normal } }      // per-format override
    windows { portable { compressionLevel = CompressionLevel.Maximum } }   // 2.3.1+
}
```

**Warning:** `Maximum`/`Ultra` on AppImage means squashfs decompression through FUSE at every launch — can push cold start to ~60 s. Keep AppImage at `Normal`.

`Ultra` additionally triggers plugin post-processing: DMG converted to LZMA (`hdiutil -format ULMO`, ~20% smaller, then re-signed; skipped if `dmg.format` set explicitly or `minimumSystemVersion < 10.15`) and DEB rebuilt with `xz -9e` (~25% smaller). There is no zstd knob; `SevenZ` is a target format, not a compression setting.

### Other packaging features to offer during migration

```kotlin
nativeDistributions {
    packageName = "MyApp"
    packageVersion = "1.0.0"
    homepage = "https://example.com"      // REQUIRED for Deb (electron-builder fails without it)
    artifactName = "${'$'}{name}-${'$'}{version}-${'$'}{os}-${'$'}{arch}.${'$'}{ext}"
    splashImage.set(project.file("splash.png"))
    cleanupNativeLibs = true              // strip foreign-platform natives from the image
    enableAotCache = true                 // JDK 25+ only; add nucleus.aot-runtime dependency
    protocol("MyApp", "myapp")            // deep links: CFBundleURLTypes / registry / .desktop
    fileAssociation("myext", "My file type", "application/x-my")
    publish { github { enabled = true; owner = "me"; repo = "myapp" } }
}
```

### Code signing

- **macOS**: `macOS { signing { sign.set(true); identity.set("Developer ID Application: …") }; notarization { … } }` — three mutually exclusive notarization modes (Apple ID / notarytool keychain profile / App Store Connect API key). All codesign calls use `--options runtime --timestamp`; universal binaries are re-signed inside-out after lipo.
- **Windows**: `.pfx` (`certificateFile`, `certificatePassword`, `algorithm = SigningAlgorithm.Sha256`, `timestampServer`) or Azure Artifact Signing (`publisherName`, `azureTenantId`, `azureEndpoint`, `azureCertificateProfileName`, `azureCodeSigningAccountName`).
- **Linux GPG**: `linux { signing { enabled.set(true); keyId.set("AB12CD34EF56"); debMethod = DebSignMethod.Detached } }` → `.deb.asc` + `.pub.asc`. With `silentUpdate.set(true)` + bundled polkit helper, DEB/RPM updates install without a password prompt.

### Mapping from compose.desktop / jpackage config

Everything inside `nativeDistributions` carries over unchanged (packageName, packageVersion, vendor, copyright, description, icons per OS, `modules()` / `includeAllModules`, jvmArgs, buildTypes/ProGuard). Only the block name (`compose.desktop.application` → `nucleus.application`) and the DSL imports change. `macOS { bundleID }`, `windows { upgradeUuid, menuGroup, dirChooser, shortcut }`, `linux { debMaintainer, menuGroup }` all carry over; NSIS-specific options replace `dirChooser`/`shortcut` when switching Msi→Nsis.

---

## Reference: GraalVM


### Feasibility assessment (do this BEFORE proposing it)

Green lights: pure Compose Desktop UI, kotlinx.serialization, Ktor/OkHttp, SQLDelight, plain Kotlin/Java code. Nucleus ships 3 levels of reachability metadata (generic L1 in `graalvm-runtime`, Oracle metadata repository L2 auto-resolved, platform-specific L3 in the plugin), so most apps need near-zero manual metadata.

Red flags (from the detect report's `graalvm` section — discuss each with the user):
- **JNA** (`net.java.dev.jna`): hostile to native image; each usage needs migration to a Nucleus module or JNI. Often disappears naturally when precursor libs are replaced by Nucleus modules.
- Heavy runtime reflection / `Class.forName` on dynamic names, dynamic proxies on app interfaces, bytecode generation (ByteBuddy/CGLIB), Spring/Groovy.
- `ServiceLoader` on app-defined services (needs metadata entries — fine, just work).
- SLF4J/Logback: works, but is initialized at run time by design. Apps with a fixed backend may opt into `graalvm { buildArgs.add("--initialize-at-build-time=org.slf4j") }` (trades frozen provider/config for cheaper first log).

If red flags dominate, recommend shipping the JVM distribution first (optionally with `enableAotCache` on JDK 25+ for ~2× faster cold start) and revisiting GraalVM later.

### Setup

```kotlin
nucleus.application {
    graalvm {
        isEnabled = true                 // nothing is registered without this
        imageName = "myapp"
        // optimization = NativeImageOptimization.LEVEL_2   (default; LEVEL_3/PGO = Oracle only)
        // march = NativeImageMarch.COMPATIBILITY           (default, except macOS arm64 → NATIVE)
        // garbageCollector = NativeImageGarbageCollector.G1  (Oracle + Linux only)
        // maxHeapSizePercent = 25                          (JVM parity default)
        // toolchain { distribution = GraalvmDistribution.COMMUNITY }  (default; ORACLE logs GFTC warning)
        // metadataRepository { enabled = true }            (default)
    }
}
```

Toolchain auto-downloads (GraalVM CE, cached under `~/.gradle/nucleus/graalvm/`) only when a native task actually runs; `GRAALVM_HOME` wins if set. Intel macs fall back to Liberica NIK automatically.

App code requirement: `GraalVmInitializer.initialize()` must be the first call in `main()` — **`nucleusApplication {}` already does this**, so apps using the Nucleus entry point need nothing.

### Workflow

1. `./gradlew runGraalvmNative` — fast dev loop (quick-build `-Ob`, exact-reachability check scoped to app packages). Fix any `MissingRegistration` it surfaces.
2. If something is missing at runtime: `./gradlew runWithNativeAgent` (exercise the app), agent output is auto-deduplicated against library metadata; app-specific entries land in the app's `reachability-metadata.json`.
3. `./gradlew createGraalvmNativeDistributable` / `runGraalvmNativeDistributable` — full app folder with configured optimization.
4. `./gradlew packageGraalvmNativeDistributionForCurrentOS` or per-format `packageGraalvm{Nsis,Dmg,Deb}` — native installers (need Node.js; `packageGraalvmDeb` needs `homepage`).
5. Oracle only: `runWithPgoInstrument` records `graalvm/pgo/default.iprof`; later builds apply it automatically (`-Pnucleus.graalvm.pgo=off` to skip).
6. Housekeeping: `cleanupGraalvmMetadata` strips manual entries already covered by L1/L2/L3; `analyzeGraalvmStaticMetadata` for static analysis.

Platform toolchains: Xcode CLT (macOS), MSVC (Windows), GCC + patchelf + xvfb (Linux). In CI: `setup-nucleus` with `graalvm: 'true'`.

Notes: GraalVM tasks exist for the default build type only (no `Release` variants — ProGuard does not apply; use `graalvm { advancedObfuscation = true }` on Oracle for obfuscation). Expected result vs JVM: cold start ~0.2 s vs ~1–2 s, binary ~40 MB vs 80–120 MB installed.

---

## Reference: CI/CD


Nucleus ships **six composite actions** in the framework repo, referenced as `NucleusFramework/Nucleus/.github/actions/<name>@<ref>` (pin a release tag in production, `@main` while experimenting):

| Action | Purpose | Key inputs |
|---|---|---|
| `setup-nucleus` | JBR + Gradle + Node + packaging tools | `jbr-version` (default `25.0.2b329.66`), `packaging-tools`, `flatpak`, `snap`, `graalvm`, `graalvm-java-version`, `node-version` |
| `setup-macos-signing` | Import signing cert into a keychain | `certificate-base64`, `certificate-password` → outputs `keychain-path` |
| `build-macos-universal` | lipo arm64+x64 into universal, re-sign | `arm64-path`, `x64-path`, `output-path`, `signing-identity`, `keychain-path` |
| `build-windows-appxbundle` | Merge per-arch AppX into a bundle | `amd64-path`, `arm64-path`, `output-path` |
| `generate-update-yml` | Produce `latest*.yml` update feeds (SHA-512 + size) | `artifacts-path`, `version`, `channel` |
| `publish-release` | Upload artifacts + feeds to GitHub release | `artifacts-path`, `tag`, `release-type` |

Reference workflow: `https://github.com/NucleusFramework/Nucleus/blob/main/.github/workflows/release-desktop.yaml`

### Canonical release matrix (from the official docs)

```yaml
name: Release
on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - { os: ubuntu-latest,    arch: amd64 }
          - { os: ubuntu-24.04-arm, arch: arm64 }
          - { os: windows-latest,   arch: amd64 }
          - { os: windows-11-arm,   arch: arm64 }
          - { os: macos-latest,     arch: arm64 }
          - { os: macos-15-intel,   arch: amd64 }
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: NucleusFramework/Nucleus/.github/actions/setup-nucleus@main
        with:
          jbr-version: '25.0.2b329.66'
          packaging-tools: 'true'
          flatpak: 'true'
          snap: 'true'
      - run: ./gradlew packageReleaseDistributionForCurrentOS --stacktrace --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: release-assets-${{ runner.os }}-${{ matrix.arch }}
          path: build/compose/binaries/main/**/*
```

The artifact name pattern `release-assets-<os>-<arch>` is load-bearing: downstream jobs (universal macOS build, AppX bundle merge, update-yml generation, release publishing) fetch by that pattern.

### Migrating an existing workflow

1. Replace `actions/setup-java` + manual tool installs with `setup-nucleus` (installs JBR, Gradle cache, Node for electron-builder, and on Linux: `xvfb rpm fakeroot libarchive-tools libdbus-1-dev libglib2.0-dev libx11-dev libgtk-3-dev patchelf`).
2. Replace `packageMsi`/`packageDmg`/`packageDeb` calls with `packageReleaseDistributionForCurrentOS` (or `packageDistributionForCurrentOS` for debug jobs).
3. If the app publishes updates: add `generate-update-yml` + `publish-release` in a fan-in job after the matrix, and enable `publish { github { } }` in the DSL. Update channels derive from the tag: `v1.0.0` → latest, `v1.0.0-beta.1` → beta, `-alpha.1` → alpha → `latest-mac.yml` / `latest.yml` / `latest-linux.yml`.
4. macOS signing secrets (base64 cert, password, notarization credentials) go through `setup-macos-signing`; on private repos remember macOS runners bill 10× and `notarytool --wait` idles on the clock — consider a self-hosted mac runner.
5. GraalVM jobs: `setup-nucleus` with `graalvm: 'true'` (installs Liberica NIK + Xcode/MSVC toolchains), then per-OS `packageGraalvm{Deb,Dmg,Nsis}`.

### GraalVM release workflow (real-world Flocon pattern)

When the app ships GraalVM native builds, the release job per OS becomes:

```yaml
      - uses: actions/checkout@v4
      - name: Normalize version
        shell: bash
        run: |
          TAG="${GITHUB_REF_NAME}"; echo "PROJECT_VERSION_NAME=${TAG#v}" >> "$GITHUB_ENV"
      - uses: NucleusFramework/Nucleus/.github/actions/setup-nucleus@main
        with:
          java-version: '21'        # setup-nucleus DEFAULTS TO 25 — pin the project's JDK
          graalvm: 'true'           # MSVC/Xcode toolchains + ~/.gradle/nucleus/graalvm cache
      - name: Build GraalVM native packages
        env:
          GITHUB_TOKEN: ${{ github.token }}   # GraalVM CE resolved via GitHub releases API — avoids rate limits
        run: ./gradlew :app:packageGraalvmNativeDistributionForCurrentOS --stacktrace --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: graalvm-app-${{ runner.os }}-${{ matrix.arch }}
          path: app/build/compose/binaries/**/graalvm-*/**
          if-no-files-found: error
```

Publish job (fan-in): `download-artifact` with `pattern: graalvm-app-*`, collect `*.dmg *.exe *.zip *.deb *.rpm *.AppImage *.asc latest*.yml beta*.yml alpha*.yml` into one dir, then `gh release upload "$TAG" release-assets/* --clobber` (create the release first with `--prerelease` when the tag contains `-alpha`/`-beta`). The `latest*.yml` feeds are emitted automatically for NSIS/DMG/AppImage/DEB/RPM — uploading them makes the release update-feed-ready even before the app adopts the updater.

Matrix note: macOS Intel runner is `macos-15-intel`; GraalVM may fall back to an older GA build there (no macos-x64 on latest feature releases — Liberica NIK fallback is automatic).

### PR/verification workflow

A minimal per-OS check for PRs: same matrix (or just the 3 x64 OSes), `./gradlew build` + `packageDistributionForCurrentOS`, upload artifacts for manual testing. Keep `fail-fast: false` so one OS failing doesn't hide the others.

---

## Reference: Real-world example (Flocon)


A complete real-world KMP Compose Desktop → Nucleus 2.4 migration (+640/−627, 33 files). Use it as the ordering template and for its hard-won gotchas.

### Migration order used

1. **Version catalog**: `nucleus = "2.5.7"` version; libraries `dev.nucleusframework:nucleus.{nucleus-application, core-runtime, decorated-window-tao, decorated-window-material3, menu-macos}`; plugin alias `nucleus = { id = "dev.nucleusframework", version.ref = "nucleus" }`. ArtifactId convention: `nucleus.<module-dir>` (hence the double `nucleus.nucleus-application`).
2. **Plugins**: add `alias(libs.plugins.nucleus)`; remove nothing (JB Compose plugin stays).
3. **DSL swap**: `compose.desktop { application {} }` → `nucleus { application {} }`, imports → `dev.nucleusframework.desktop.application.dsl.*`. Formats Msi→Nsis (+Zip, AppImage, Portable), `compressionLevel = CompressionLevel.Ultra` with `appImage`/`portable` overridden to `Store`, `cleanupNativeLibs = true`, `homepage` added for Deb. ProGuard `buildTypes.release` deleted (GraalVM `optimization = NativeImageOptimization.SIZE` replaces it as shrinker — note: the plain-JVM path then loses shrinking).
4. **Toolchain alignment**: `jvmToolchain(21)` added to EVERY KMP module (multi-module mismatch otherwise); Gradle wrapper bumped to 9.5.1.
5. **main() migration** (see delta below).
6. **Secondary windows** via `HostedWindow` + custom `NucleusWindowHost`.
7. **AWT removals** (see awt-removal.md).
8. **CI**: setup-java+setup-gradle → `setup-nucleus`, packaging task → `packageGraalvmNativeDistributionForCurrentOS`, hand-written release-upload steps → find + `gh release upload` including `latest*.yml` feeds.

### main() delta checklist

1. `application {}` → `nucleusApplication {}` (`dev.nucleusframework.application.nucleusApplication`).
2. `Window(...)` → `MaterialDecoratedWindow(...)` (or plain `DecoratedWindow`, or Jewel variant).
3. Drop all `apple.awt.*` / `apple.laf.*` system properties — Tao owns app name/appearance/menu bar.
4. `window.minimumSize = Dimension(w,h)` → `minimumSize = DpSize(w.dp, h.dp)` parameter.
5. `Desktop.getDesktop().setAboutHandler {}` → `NativeMenuBar { Menu("App") { Item("About…") {} ; Separator() } }` (`nucleus.menu-macos`, no-op elsewhere).
6. `exitApplication()`, `rememberWindowState`, `WindowState` unchanged (`NucleusApplicationScope : ApplicationScope`).
7. Title bar goes INSIDE window content as first child: `MaterialTitleBar(layoutPolicy = TitleBarLayoutPolicy.FillCenter) { … }`. Custom height: `style.copy(metrics = style.metrics.copy(height = 44.dp))` passed as `titleBarStyle`.
8. Theme must WRAP the window (title bar reads `MaterialTheme.colorScheme`) → invert `App()` into `FloconApp(content)` pattern.
9. `FileKit.init(appId = "…")` before the application block if using FileKit.

### The 10 costliest gotchas

1. **Overload ambiguity**: `NucleusApplicationScope` extends AWT `ApplicationScope`, so `MaterialDecoratedWindow(...)` can bind to the wrong receiver extension. Fix: `val scope: NucleusApplicationScope = LocalNucleusApplicationScope.current; scope.MaterialDecoratedWindow(...)` — explicit type.
2. Composable not in application scope needing a window: `with(LocalNucleusApplicationScope.current) { MaterialDecoratedWindow(…) }`.
3. **Every window re-provides window-scoped CompositionLocals** (e.g. an escape-handler stack) — otherwise a secondary window's Escape pops the main window's handler. In a host implementation, chain to the caller: `handlers.lastOrNull()?.invoke() ?: onPreviewKeyEvent(event)`.
4. **`collectAsStateWithLifecycle` crashes above the window** (no `LocalLifecycleOwner` outside window content) → use `collectAsState()` there; keep the lifecycle variant inside window content.
5. `TitleBarLayoutPolicy.FillCenter` accepts **at most one** centered child.
6. Native views (WebView, video): explicit sizes (no intrinsic measurement) and real `.clip(shape)` (not `background(shape=…)`) — the native view overlays the Compose surface.
7. `DpSize(Unspecified, Unspecified)` auto-size windows are not viable — give explicit sizes.
8. Secondary-window architecture rule: **library/navigation code uses `HostedWindow`** (chrome-agnostic, themed via `LocalNucleusWindowHost` override); **app code calls `MaterialDecoratedWindow` directly**. In-composition `androidx.compose.ui.window.Dialog` (CMP dialog) needs NO change — only real OS windows do.
9. `setup-nucleus` defaults to Java **25** — pin `java-version: '21'` (or whatever the project uses) AND align `jvmToolchain` in all modules.
10. AWT `Tray`/`rememberTrayState` **compiles but is unsupported under Tao** — dead code behind a flag is a latent trap; migrate to `dev.nucleusframework:composenativetray` or delete.

### What Flocon deliberately kept / skipped (valid choices to offer)

- `Desktop.getDesktop().browse(uri)` kept for opening URLs (Tao-safe; Nucleus's own demos do this).
- AWT clipboard (`Toolkit.getDefaultToolkit().systemClipboard`) untouched — works under Tao, no Nucleus module for it.
- Skipped: notifications, updater-runtime (even though CI already publishes `latest*.yml` feeds — the natural NEXT step), deep links, taskbar-progress, global hotkey, auto-launch.
- `mavenLocal()` added to repos = dev-only convenience, don't ship it.
- MSI→NSIS means **existing MSI installs won't auto-upgrade** — ask the user about their installed base before dropping Msi.

### FileKit specifics (Nucleus-recommended file dialogs on Tao)

`io.github.vinceglb:filekit-dialogs` (0.14.2): suspend `FileKit.openFilePicker(type = FileKitType.File(extensions), dialogSettings = FileKitDialogSettings(title))` / `FileKit.openFileSaver(suggestedName, defaultExtension, …)`. Requirements: `FileKit.init(appId)` at top of main(); Linux: `modules("jdk.security.auth")` in `nativeDistributions.linux {}` (XDG portal/D-Bus); if ProGuard stays enabled: keep rules for `com.sun.jna.**`, `org.freedesktop.dbus.**`, `io.github.vinceglb.filekit.dialogs.platform.xdg.**`.
