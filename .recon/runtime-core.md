# Recon: runtime-core cluster

Fact-check of Nucleus docs against real Kotlin/Java source.

- SOURCE ROOT: `/home/elie-gambache/IdeaProjects/Nucleus`
- Modules inspected: `core-runtime`, `aot-runtime`, `graalvm-runtime`, `updater-runtime`

## 1. Module inventory & public API

### core-runtime
- Coordinate: `dev.nucleusframework:nucleus.core-runtime` (build.gradle.kts). JVM target 11.
- Package: `dev.nucleusframework.core.runtime`
- Public/entry types:
  - `object NucleusApp` — props: `appId: String`, `version: String?`, `vendor: String?`, `description: String?`, `appName: String?`, `aumid: String` (NON-null, falls back to appId), `startupTaskId: String?`, `isConfigured: Boolean`. Resource `nucleus/nucleus-app.properties`.
  - `enum class ExecutableType` — values: `EXE, MSI, NSIS, NSIS_WEB, PORTABLE, APPX, DMG, PKG, DEB, RPM, SNAP, FLATPAK, APPIMAGE, PACMAN, ZIP, TAR, SEVEN_Z, DEV`. (NO `JAR`/`Jar`; dev mode is `DEV`.)
  - `object ExecutableRuntime` — `TYPE_PROPERTY = "nucleus.executable.type"`, `type()`, `type(propertyName)`, `parseType(raw)`, `markerVersion()`, `isGraalVmNativeImage`, and `is*()` for every enum value: `isExe, isMsi, isNsis, isNsisWeb, isPortable, isAppX, isDmg, isPkg, isDeb, isRpm, isSnap, isFlatpak, isAppImage, isPacman, isZip, isTar, isSevenZ, isDev`. (NO `isJar()`.)
  - `enum class Platform { Linux, Windows, MacOS, Unknown }` + `Current`, `isWayland`.
  - `enum class WindowBackend { Awt, Tao }` + `Current`, `isNucleusManaged`, `setActive()`. (Only two values — NO `Auto`.)
  - `object DeepLinkHandler` — `uri: URI?` (private set), `register(...)` (@Deprecated), `setHandler(args, onDeepLink)`, `captureFromArgs(args)`, `installAwtAppleEventHandler()`, `writeUriTo(path)`, `readUriFrom(path)`, `deliver(uri)`.
  - `object SingleInstanceManager` — `data class Configuration(lockFilesDir, lockIdentifier)` with derived `lockFileName`, `restoreRequestFileName`, `lockFilePath`, `restoreRequestFilePath`; `var configuration`; `isSingleInstance(onRestoreFileCreated?, onRestoreRequest): Boolean`.
  - `object AppRestarter` — `applicationExecutablePath`, `restartApplication()`.
  - `enum class LinuxDesktopEnvironment { Gnome, KDE, XFCE, Cinnamon, Mate, Unknown }` + `Current`.
  - `object NativeLibraryLoader` — `load(libraryName, callerClass, resourcePrefix, sidecarFiles)`.
  - tools: `object AppIdProvider` (`appId()`), `object LinuxDesktopFileDetector` (`desktopFilename`), logging (`ComposeNativeTrayLoggingLevel`, `allowNucleusRuntimeLogging`, `composeNativeTrayLoggingLevel`).

### aot-runtime
- Coordinate: `dev.nucleusframework:nucleus.aot-runtime` (api → core-runtime). JVM 11.
- Package: `dev.nucleusframework.aot.runtime`
  - `enum class AotRuntimeMode { OFF, TRAINING, RUNTIME }` — **there is NO `NONE`; the "not active" value is `OFF`**.
  - `object AotRuntime` — `mode(): AotRuntimeMode`, `isRuntime()`, `isTraining()`.
  - `typealias ExecutableType`/`ExecutableRuntime` re-exported from core-runtime.

### graalvm-runtime
- Coordinate: `dev.nucleusframework:nucleus.graalvm-runtime` (impl → core-runtime, linux-hidpi). JVM 11.
- Kotlin: `object GraalVmInitializer` (`isNativeImage`, `initialize()`), `internal object NativeLocaleBridge`.
- Java SVM substitutions (`src/main/java`): `FcFontManagerSubstitution`, `FontCreateFontSubstitution`, `Win32FontManagerSubstitution`, `SplashScreenSubstitution`, `XToolkitAppNameSubstitution` (X11 WMClass), + BooleanSupplier gates.
- Resources: `META-INF/native-image/.../native-image.properties` (IncludeResources globs) and `reachability-metadata.json`.
- native-image.properties resource patterns (VERBATIM):
  `.*\.(svg|ttf|otf)`, `nucleus/.*`, `META-INF/services/.*`, `composeResources/.*` (plus `-H:+UnlockExperimentalVMOptions -H:+SharedArenaSupport`).

### updater-runtime
- Coordinate: `dev.nucleusframework:nucleus.updater-runtime` (api → core-runtime). JVM 11.
- Package: `dev.nucleusframework.updater`
  - `class NucleusUpdater(config)` + DSL `fun NucleusUpdater(block: UpdaterConfig.() -> Unit)`. Methods: `currentVersion`, `isUpdateSupported()`, `suspend checkForUpdates(): UpdateResult`, `downloadUpdate(info): Flow<DownloadProgress>`, `installAndRestart(file)`, `installAndQuit(file)`, `consumeUpdateEvent(): UpdateEvent?`, `wasJustUpdated(): Boolean`.
  - `class UpdaterConfig` — `currentVersion`, `provider` (lateinit), `channel="latest"`, `allowDowngrade`, `allowPrerelease`, `executableType: String?`, `httpClient: HttpClient?`. (NO "custom HTTP headers" field.)
  - `sealed class UpdateResult` — subtypes: **`Available(info: UpdateInfo, level: UpdateLevel)`**, **`NotAvailable`** (data object), **`Error(exception: UpdateException)`**. (NOT `UpdateAvailable`/`NoUpdate`/`Failed`.)
  - `enum class UpdateLevel { MAJOR, MINOR, PATCH, PRE_RELEASE }` (UPPER_SNAKE — not `Major/Minor/Patch/PreRelease`).
  - `data class UpdateInfo(version, releaseDate, files, currentFile)`, `data class UpdateFile(url, sha512, size, blockMapSize?, fileName)`.
  - `data class UpdateEvent(previousVersion, newVersion, updateLevel)` (field is `updateLevel`, not `level`).
  - `data class DownloadProgress(bytesDownloaded, totalBytes, percent, file?)`.
  - `interface UpdateProvider` (`getUpdateMetadataUrl`, `getDownloadUrl`, `authHeaders()`, `resolveMetadataUrl`); `class GitHubProvider(owner, repo, token?=null)`; `class GenericProvider(baseUrl)`.
  - exceptions: `UpdateException`(base), `NetworkException`, `ChecksumException`, `NoMatchingFileException`, `ParseException`.

## 2. Per-page findings

### lifecycle/executable-type.mdx — NEEDS REWRITE (facts)
- Enum members use wrong casing throughout. `ExecutableType.AppX/.Snap/.Flatpak/.Pkg` (lines 24-27) → real `APPX/SNAP/FLATPAK/PKG`.
- `isJar()` does not exist (lines 10, 49). Dev-mode type is `DEV`; the method is `isDev()`.
- "the runtime reports `Jar`" (line 40) and the `Jar` variant (lines 53, 57) → real value is `DEV`.
- `ExecutableType` value list (line 53) `Jar, AppImage, Dmg, Pkg, Exe, Msi, AppX, Deb, Rpm, Flatpak, Snap` is wrong-cased and omits `NSIS, NSIS_WEB, PORTABLE, PACMAN, ZIP, TAR, SEVEN_Z`.
- Reference table (line 49) lists `isJar()` (nonexistent) and omits `isNsis/isNsisWeb/isPortable/isPacman/isZip/isTar/isSevenZ/isDev`.

### lifecycle/app-metadata.mdx — MINOR FIX
- `aumid` documented as `String?` (line 11 TL;DR "All values are String? except appId … and isConfigured"; line 60 table). Actual: `public val aumid: String` — non-null, falls back to `appId`. So `appId` AND `aumid` are the non-null String props.
- Everything else accurate (appId/appName/version/vendor/description/startupTaskId/isConfigured all exist; resource path correct).

### lifecycle/single-instance.mdx — OK
- `isSingleInstance(onRestoreFileCreated, onRestoreRequest)`, `configuration`, `Configuration(lockFilesDir, lockIdentifier, lockFileName, restoreRequestFileName)` all match source exactly.

### lifecycle/deep-links.mdx — MINOR
- Reference lists `uri` as `var URI?` (line 89). Source is `var uri: URI? = null; private set` — externally read-only (effectively a `val`). Cosmetic.
- `setHandler`, `installAwtAppleEventHandler`, `writeUriTo`, `deliver` all exist and match. `protocol(...)` Gradle DSL is plugin-side (not in these 4 modules).

### concepts/runtimes.mdx — NEEDS REWRITE (facts)
- Import `dev.nucleusframework.aotruntime.AotRuntime` / `AotRuntimeMode` (lines 96-97) → wrong package; real is `dev.nucleusframework.aot.runtime`.
- `AotRuntimeMode.NONE` (line 103) does not exist → real value `OFF`.
- Comment `// Jar, AppImage, Dmg, Exe, Msi, AppX, …` (line 107): `Jar` invented; casing wrong.
- The `runtime = Runtime.NativeImage/JvmWithAotCache` shorthand (line 72) is already self-flagged FACT-CHECK NEEDED; confirmed there is no `Runtime` enum in any of these 4 runtime modules.

### concepts/backends.mdx — MOSTLY OUT OF SCOPE
- `NucleusBackend` (Auto/Tao/Awt) lives in `nucleus-application`, not in these modules; not verifiable here. Note: core-runtime's analogous type is `WindowBackend` and it has only `Awt`/`Tao` (no `Auto`). No confirmed error.

### concepts/architecture.mdx — MINOR
- "JDK 17+" (lines 13, 52, 56): the four runtime modules compile to Java 11 bytecode (`sourceCompatibility = VERSION_11`). App-level minimum may legitimately be higher; flag as worth confirming, not a hard error.
- `core-runtime.NucleusApp` + `nucleus-app.properties` claims are correct.

### concepts/modules.mdx — OK
- Coordinate format `dev.nucleusframework:nucleus.<name>` matches source. Umbrella-pulls-core/aot/graalvm is consistent with the dependency graph (`aot-runtime` api core-runtime; `graalvm-runtime` impl core-runtime).
- Note: `fs-watcher` and `scheduler-testing` are real modules absent from every table (see §3). `sf-symbols`, `taskbar-progress-tao`, `native-http-okhttp`, `native-http-ktor` are listed in the module table but have no dedicated page.

### performance/aot-cache.mdx — MINOR FIX
- `AotRuntimeMode.NONE` appears twice (line 92 prose, line 122 reference table) → does not exist; real value `OFF`.
- Import `dev.nucleusframework.aot.runtime.AotRuntime` (line 78) is CORRECT. `AotRuntimeMode.TRAINING` used at line 81 without an import (cosmetic).
- DSL/scope items (`enableAotCache`, `aotTraining`, `isAotTraining`, `isAotRuntime`) are plugin/nucleus-application concerns, not these modules.

### performance/index.mdx — OK
- Module coordinates `nucleus.graalvm-runtime`, `nucleus.aot-runtime` correct. Numbers are marketing.

### performance/graalvm/runtime-bootstrap.mdx — MINOR FIX
- Substitution names `FontCreateFontSubstitution`, `Win32FontManagerSubstitution`, `FcFontManagerSubstitution` all match Java files. `GraalVmInitializer.initialize()` / `isNativeImage` correct.
- Resource-glob table (line 76) says `nucleus/native/.*`, but native-image.properties actually registers the broader `nucleus/.*`. Fix the pattern.

### performance/graalvm/index.mdx — OK (runtime parts)
- graalvm-runtime substitutions incl "X11 toolkit WMClass" — confirmed (`XToolkitAppNameSubstitution`). DSL bits are plugin-side.

### performance/graalvm/configuration.mdx — OUT OF SCOPE
- Entire `graalvm { }` DSL, `metadataRepository`, `macOS` sub-block, `nativeImageConfigBaseDir` are plugin-build (not in these 4 modules). Belongs to the plugin cluster's fact-check.

### performance/graalvm/automatic-metadata.mdx — OUT OF SCOPE (one runtime claim OK)
- L1-L4 and the tasks are plugin-build. L5 claim ("graalvm-runtime ships reachability-metadata.json") is CORRECT — file confirmed present.

### performance/graalvm/tasks-ci.mdx — OUT OF SCOPE
- All Gradle tasks / CI action content is plugin-build.

### packaging/auto-update.mdx — NEEDS REWRITE (facts)
- `UpdateResult.UpdateAvailable` (lines 38, 93, 160) → real `UpdateResult.Available` (carries `info` AND `level`).
- `UpdateResult.NoUpdate` (lines 45, 93, 160) → real `UpdateResult.NotAvailable`.
- `UpdateResult.Failed(reason)` (lines 47, 93, 160) → real `UpdateResult.Error(exception: UpdateException)` — the field is `exception`, not `reason`.
- `UpdateLevel` values `Major, Minor, Patch, PreRelease` (line 99) → real `MAJOR, MINOR, PATCH, PRE_RELEASE`.
- Builder field list (line 158) includes "custom HTTP headers" — no such field on `UpdaterConfig`; auth headers come from the `UpdateProvider.authHeaders()`.
- Prose says `UpdateEvent(..., level)` (lines 97, 154); the data class field is `updateLevel`.
- Correct: `GitHubProvider(owner, repo, token?=null)`, `GenericProvider(baseUrl)`, exception names, `downloadUpdate → Flow<DownloadProgress>`, `installAndRestart`/`installAndQuit`, `wasJustUpdated`, `consumeUpdateEvent`, `checkForUpdates` is `suspend`, `NativeHttpClient.create()` (in `dev.nucleusframework.nativehttp`).

## 3. Undocumented modules (real sources, no dedicated page)
These are outside the 4 runtime-core source modules but were flagged as suspects:
- `fs-watcher` (`nucleus.fs-watcher`, 4 kt files): public `interface FsWatcher : AutoCloseable`, `interface FsWatchRegistration`, `object FsWatchers`, `class FsWatchException`. Absent from all docs. → propose `os/fs-watcher`.
- `scheduler-testing` (`nucleus.scheduler-testing`, 3 kt): `object TestTaskRunner.runTask(...)`, `class TestConstraintChecker` (install/uninstall). Absent from docs. → propose `os/scheduler/testing`.
- `sf-symbols` (`nucleus.sf-symbols`, 22 kt): listed in modules table only, no page. → `os/sf-symbols`.
- `taskbar-progress-tao` (`nucleus.taskbar-progress-tao`): listed in table only. → `os/taskbar-progress` (Tao section).
- `native-http-okhttp` (`nucleus.native-http-okhttp`), `native-http-ktor` (`nucleus.native-http-ktor`): listed in table only, no dedicated pages. → `performance/native-http` (adapters section).

## 4. Stale pages
None. Every page fact-checked references a feature with backing source. The `runtime = …` shorthand in concepts/runtimes.mdx is aspirational but already self-flagged (not stale, not backed).
