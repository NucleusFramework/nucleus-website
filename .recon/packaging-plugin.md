# Recon: `packaging-plugin` cluster

Fact-check of Nucleus packaging docs against the real Kotlin source.

- SOURCE MODULE: `/home/elie-gambache/IdeaProjects/Nucleus/plugin-build`
- The module has Kotlin sources under `plugin-build/plugin/src/main/kotlin/dev/nucleusframework/**` (exists = true).

## Module identity / coordinates

- Gradle plugin id: **`dev.nucleusframework`** (`plugin-build/gradle.properties` → `ID=dev.nucleusframework`, `GROUP=dev.nucleusframework`, `IMPLEMENTATION_CLASS=dev.nucleusframework.NucleusPlugin`).
- Marker artifact: `dev.nucleusframework:dev.nucleusframework.gradle.plugin`.
- Plugin registered in `plugin/build.gradle.kts` via `gradlePlugin { plugins { create(property("ID")) { ... tags=[nucleus,desktop,jvm,packaging] } } }`.
- Docs consistently say `id("dev.nucleusframework") version "2.0.0"` — plugin id is **correct**. (Version `2.0.0` resolves from `GITHUB_REF` at publish time; default fallback in `plugin-build/build.gradle.kts` is `"1.0.0"` — not verifiable, not flagged.)

## Public API surface (entry points)

- `dev.nucleusframework.NucleusPlugin : Plugin<Project>` — creates the `nucleus` extension.
- `dev.nucleusframework.NucleusExtension` — `val application: JvmApplication`, `fun application(Action)`, `val nativeApplication: NativeApplication`, `fun nativeApplication(Action)`, `val dependencies`.
- DSL package `dev.nucleusframework.desktop.application.dsl`:
  - Containers: `JvmApplication`, `NativeApplication`, `AbstractDistributions`, `JvmApplicationDistributions`, `NativeApplicationDistributions`, `JvmApplicationBuildTypes`/`JvmApplicationBuildType`.
  - Platform settings: `AbstractPlatformSettings`, `AbstractMacOSPlatformSettings`, `JvmMacOSPlatformSettings`, `NativeApplicationMacOSPlatformSettings`, `LinuxPlatformSettings`, `WindowsPlatformSettings`, `InfoPlistSettings`.
  - Sub-settings: `DmgSettings`/`DmgWindowSettings`, `SnapSettings`, `FlatpakSettings`, `AppImageSettings`, `NsisSettings`, `AppXSettings`, `ProguardSettings`, `LaunchAgentSettings`/`LaunchAgentDefinition`/`CalendarInterval`, `GraalvmSettings`/`GraalvmMacOSSettings`/`GraalvmWindowsSettings`/`MetadataRepositorySettings`.
  - Signing: `MacOSSigningSettings`, `WindowsSigningSettings`, `LinuxSigningSettings`, `UnifiedSigningSettings`, `MacOSNotarizationSettings`.
  - Publish: `PublishSettings`, `GitHubPublishSettings`, `S3PublishSettings`, `GenericPublishSettings`.
  - Enums: `PackagingBackend{JPACKAGE,ELECTRON_BUILDER}`, `TargetFormat`, `ReleaseType{Release,Draft,Prerelease}`, `ReleaseChannel{Latest,Beta,Alpha}`, `SigningAlgorithm{Sha1,Sha256,Sha512}`, `PublishMode{Never,Auto,Always}`, `CompressionLevel{Store,Normal,Maximum}`, `SnapConfinement{Strict,Classic,Devmode}`, `SnapGrade{Stable,Devel}`, `SnapCompression{Xz,Lzo}`, `SnapPlug{15 values}`, `AppImageCategory{11 values}`, `DebSignMethod{Detached,DpkgSig,Debsig}`, `DmgFormat{UDRW,UDRO,UDCO,UDZO,UDBZ,ULFO}`, `DmgContentType{Link,File,Dir}`.
  - Data classes: `UrlProtocol(name, schemes)`; internal `FileAssociation`, `DmgContentEntry`.
  - Marker: `@ExperimentalNucleusLibrary`.

### `TargetFormat` — the source of truth (`dsl/TargetFormat.kt`)

**18 enum constants** (docs repeatedly claim "sixteen"):
`RawAppImage, Pkg, Deb, Rpm, Dmg, Exe, Msi, Nsis, NsisWeb, Portable, AppX, AppImage, Pacman, Snap, Flatpak, Zip, Tar, SevenZ`.

Key points:
- The 7-zip constant is **`SevenZ`** (id `"7z"`), NOT `SevenZip`.
- **`Exe`** (id `"exe"`, Windows, electronBuilderTarget→`"nsis"`) exists.
- **`Pacman`** (id `"pacman"`, Linux) exists and is **completely undocumented** in every page.
- `isStoreFormat` = {Pkg, AppX, Flatpak}. `needsPluginUpdateYml` = {Msi, Portable}.

---

## Per-page findings

### packaging/index.mdx — NEEDS REWRITE (facts)
- Title "One DSL, sixteen installers" and body "ships sixteen distributable formats" / "Sixteen total" — the enum has **18** formats.
- Explicit list uses **`SevenZip`** — the constant is **`SevenZ`**. `TargetFormat.SevenZip` would not compile.
- List and coverage matrix **omit `Exe` and `Pacman`**, both real `TargetFormat` values (Linux page has no pacman either).
- Everything else (hybrid jpackage→electron-builder pipeline, store split, `packageDistributionForCurrentOS`) is accurate.

### packaging/macos.mdx — MINOR FIX (one broken snippet)
- `launchAgents { agent(...) { bundleProgram = "..."; arguments = listOf("--background"); startInterval = 3600 } }` uses **property assignment**, but `LaunchAgentDefinition` (`dsl/LaunchAgentSettings.kt`) exposes **functions**: `fun bundleProgram(path: String)`, `fun arguments(vararg args: String)`, `fun startInterval(seconds: Int)`. As written the Kotlin snippet does not compile. Correct form: `bundleProgram("Contents/MacOS/indexer")`, `arguments("--background")`, `startInterval(3600)`.
- Reference line says `installationPath` "(defaults to `/Applications`)". Source `AbstractMacOSPlatformSettings.installationPath: String? = null` — default is **null**, not `/Applications`.
- Verified accurate: `nucleusPatchMacJvm` task, `macOsSdkVersion` default `"26.0"`, all listed macOS properties (`layeredIconDir`, `bundleID`, `dmgPackageVersion`, `pkgPackageVersion`, `packageBuildVersion`, `entitlementsFile`, `runtimeEntitlementsFile`, `provisioningProfile`, `runtimeProvisioningProfile`), sub-blocks `signing/notarization/dmg/launchAgents/infoPlist`, `DmgContentType.File/.Link`.

### packaging/windows.mdx — OK
- `Nsis, NsisWeb, Msi, AppX, Portable`, signing (`enabled`, `certificateFile`, `certificatePassword`, `algorithm=SigningAlgorithm.Sha256`, `timestampServer`), `nsis { }` and `appx { }` property lists, `upgradeUuid`, `perUserInstall`, `menuGroup` — all match source.
- `WindowsJumpListManager.setProcessAppId()` (Notes) is a runtime API, not in `plugin-build`; not verifiable in this cluster.

### packaging/linux.mdx — MINOR (undocumented format)
- All shown properties match `LinuxPlatformSettings` and the snap/flatpak/appImage sub-settings.
- Omits **`Pacman`** target plus `LinuxPlatformSettings.pacmanPackageVersion` / `pacmanDepends` (both present in source). Same omission as index/gradle-dsl.
- Flatpak default `runtimeVersion = "23.08"` and finishArgs defaults match source.

### packaging/code-signing.mdx — OK
- macOS `signing { sign/identity/keychain/prefix }`, three mutually-exclusive notarization modes (`appleID`+`password`+`teamID` / `keychainProfile`(+`keychainPath`) / `apiKey`+`apiKeyId`+`apiIssuer`) — exact match to `MacOSSigningSettings` / `MacOSNotarizationSettings`.
- Windows PFX + Azure fields (`publisherName`, `azureTenantId`, `azureEndpoint`, `azureCertificateProfileName`, `azureCodeSigningAccountName`) — match `WindowsSigningSettings`.
- Linux `enabled/keyId/keyFile/passphrase/debMethod/silentUpdate` and `DebSignMethod{Detached,DpkgSig,Debsig}` — match `LinuxSigningSettings`. `compose.desktop.linux.signing.*` property keys match `NucleusProjectProperties`.

### packaging/trusted-certificates.mdx — OK
- `nativeDistributions.trustedCertificates: ConfigurableFileCollection` exists.
- Tasks `patchCaCertificates` and `createRuntimeImage` are the real registered names (`configureJvmApplication.kt`; `taskNameAction="patch"/"create"`, object `"CaCertificates"/"runtimeImage"`).
- Alias derivation ("filename + first 8 chars of SHA-256", e.g. `corp-root-ca-3a1f8b2c`) matches `AbstractPatchCaCertificatesTask.certAlias` (`<sanitized-filename>-<first-8-of-sha256>`). (Note: the KDoc on `JvmApplicationDistributions.trustedCertificates` is the stale one — it omits the fingerprint suffix; the doc page is correct.)

### packaging/sandboxing.mdx — OK
- Task names verified against `configureJvmApplication.kt`: `extractNativeLibsForSandboxing`, `stripNativeLibsFromJars`, `prepareSandboxedAppResources`, `createSandboxedDistributable`, `generateSandboxedAotCache`. Store formats = Pkg/AppX/Flatpak (`isStoreFormat`).
- `appStore` deprecation note matches `JvmMacOSPlatformSettings.appStore` (`@Deprecated`, ignored).

### packaging/publishing.mdx — OK
- `PublishMode{Never,Auto,Always}`, `ReleaseChannel{Latest,Beta,Alpha}`, `ReleaseType{Release,Draft,Prerelease}` match.
- `github{enabled,owner,repo,token,channel,releaseType}`, `s3{enabled,bucket,region,path,acl}`, `generic{enabled,url,channel,useMultipleRangeRequest}` match `PublishSettings` classes exactly.

### packaging/ci-cd.mdx — OK
- All six documented composite actions exist under `Nucleus/.github/actions/`: `setup-nucleus`, `setup-macos-signing`, `build-macos-universal`, `build-windows-appxbundle`, `generate-update-yml`, `publish-release` (a 7th, `validate-release-ref`, exists but is not claimed). `release-desktop.yaml` workflow exists. Page already carries a `[FACT-CHECK NEEDED]` self-note.

### reference/gradle-dsl.mdx — NEEDS FIX
- Line 44 "The 16 formats" and line 57 `TargetFormat` list use **`SevenZip`** (→ `SevenZ`) and **omit `Pacman`**. (This list does include `Exe`, unlike index.)
- Line 67 `installationPath: String? = "/Applications"` — real default is **null**.
- Everything else is impressively accurate: modules defaults, GraalVM section (`isEnabled`=false, `javaLanguageVersion`=25, `march`="native", `metadataRepository.version`="0.10.6"), SnapPlug 15-value list, snap 11 default plugs, flatpak defaults, DmgFormat/DmgContentType values, signing/notarization surfaces.
- Omission (not an error): the `windows { }` GraalVM sub-block `GraalvmWindowsSettings` (`bundleCRuntime`, `dlls`, `sourceDir`) is not listed.

### reference/troubleshooting.mdx — OK
- `packageGraalvmDeb`/`packageDeb`, `homepage` required for DEB, `CompressionLevel.Maximum` AppImage warning, `flatpak-builder`/`snapcraft` skips, `setup-nucleus` inputs — all consistent with source/actions. AppX default MinVersion `10.0.14316.0` is electron-builder's default (matches the example in `AppXSettings.minVersion` KDoc); not independently verifiable but plausible.

### start/configuration.mdx — MINOR FIX
- Line 13 "16 supported" — actual **18**.
- Line 132 format list correctly uses **`SevenZ`** but omits `NsisWeb`, `Pacman`, `RawAppImage`.
- ProGuard snippet mixes `isEnabled = true` / `optimize = true` with `obfuscate.set(false)` / `joinOutputJars.set(true)`. All four are `Property<Boolean>` in `ProguardSettings`; `=` works under modern Gradle lazy-property assignment, so this is a style inconsistency, low severity.
- macOS/windows/linux example properties all match source.

### start/project-setup.mdx — OK (for this cluster)
- Plugin id `dev.nucleusframework` correct. `enableAotCache`, `nucleus.application.graalvm { javaLanguageVersion.set(25) }` consistent with DSL.
- Runtime artifact coordinates (`dev.nucleusframework:nucleus.nucleus-application`, etc.) belong to other clusters (runtime modules), not verifiable against `plugin-build`.

### ecosystem/index.mdx, ecosystem/file-dialog.mdx — OK
- Only plugin-relevant claim: "Nucleus plugin ships preloaded GraalVM reachability metadata for FileKit." **Verified** — `plugin/src/main/resources/nucleus/graalvm/library-metadata/filekit.json` (+ `index.txt`) exist. Everything else describes third-party libraries (FileKit, JVM ecosystem), out of scope for source verification.

### ecosystem/spell-check.mdx — OK
- Entirely about the third-party `PlatformSpellCheckerKt` library; no Nucleus plugin API referenced.

---

## Undocumented features (real source, no doc coverage)

1. **`TargetFormat.Pacman`** + `LinuxPlatformSettings.pacmanPackageVersion` / `pacmanDepends` — Arch Linux pacman packaging, absent from every page. Suggested: document in `packaging/linux.mdx` (and add to the format lists in index / gradle-dsl / configuration).
2. **`TargetFormat.Exe`** — present in gradle-dsl and configuration lists but missing from `packaging/index.mdx` list and coverage matrix.
3. **`GraalvmWindowsSettings`** (`windows { bundleCRuntime; dlls; sourceDir }` under `graalvm { }`) — bundles MSVC runtime DLLs next to native-image `.exe`; undocumented in gradle-dsl and configuration. Suggested: add to the GraalVM reference section.

## Cross-cutting correction

The format count "sixteen" is wrong on **four pages** (index, gradle-dsl, configuration, plus the index title). Canonical count from `TargetFormat` is **18**. And `SevenZip` (index, gradle-dsl) must be `SevenZ`.
