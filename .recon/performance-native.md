# Fact-check report — cluster "performance-native"

Source root: `/home/elie-gambache/IdeaProjects/Nucleus`
Docs root: `/home/elie-gambache/IdeaProjects/nucleus-website/content/docs`

## Module inventory (verified against source)

All five assigned modules have Kotlin sources under `src/main/kotlin` and are published under group `dev.nucleusframework`.

| Module | Artifact | Public entry points (verified) |
|--------|----------|--------------------------------|
| native-ssl | `dev.nucleusframework:nucleus.native-ssl` | `object NativeTrustManager` |
| native-http | `dev.nucleusframework:nucleus.native-http` | `object NativeHttpClient` |
| native-http-okhttp | `dev.nucleusframework:nucleus.native-http-okhttp` | `object NativeOkHttpClient` |
| native-http-ktor | `dev.nucleusframework:nucleus.native-http-ktor` | top-level `fun installNativeSsl()` |
| linux-hidpi | `dev.nucleusframework:nucleus.linux-hidpi` | top-level `getLinuxNativeScaleFactor()`, `applyLinuxHiDpiScale()` |

Coordinates confirmed from each `build.gradle.kts` `coordinates(...)` call.

### native-ssl — actual public surface
`NativeTrustManager.kt`:
- `object NativeTrustManager`
  - `val trustManager: X509TrustManager`  (doc claims `X509ExtendedTrustManager` — see finding S1)
  - `val sslContext: SSLContext`
  - `val sslSocketFactory: SSLSocketFactory`
  - No other public members. **No `isAvailable()`** (see S2).

`NativeCertificateProvider.kt`:
- `internal object NativeCertificateProvider` — internal, NOT a public `interface`, NOT an SPI (see S3).

Other types are `internal object`: `mac.NativeSslBridge`, `windows.WindowsSslBridge`, `windows.WindowsCertificateProvider`, `linux.LinuxCertificateProvider`. `Logger.kt` exposes only `internal fun debugln/errorln`.

### native-http — actual public surface (`NativeHttpClient.kt`)
- `object NativeHttpClient`
  - `fun create(): HttpClient` — builds with `.followRedirects(HttpClient.Redirect.NORMAL).withNativeSsl()`.
  - `fun HttpClient.Builder.withNativeSsl(): HttpClient.Builder` — member extension; sets `sslContext(NativeTrustManager.sslContext)` and `sslParameters(needClientAuth=false)`.

### native-http-okhttp (`NativeOkHttpClient.kt`)
- `object NativeOkHttpClient`
  - `fun create(): OkHttpClient`
  - `fun OkHttpClient.Builder.withNativeSsl(): OkHttpClient.Builder` → `sslSocketFactory(NativeTrustManager.sslSocketFactory, NativeTrustManager.trustManager)`

### native-http-ktor (`NativeSslKtorExtension.kt`)
- top-level `fun <T : HttpClientEngineConfig> HttpClientConfig<T>.installNativeSsl()`
- Engine-specific config verified: CIO `https { trustManager = ... }`; Java `config { sslContext(...) }`; OkHttp `config { sslSocketFactory(sslSocketFactory, trustManager) }`; Apache5 `sslContext = ...`. Engines are `compileOnly` in build.gradle.kts — matches doc.

### linux-hidpi (`LinuxHiDpi.kt`, `HiDpiLinuxBridge.kt`)
- top-level `fun getLinuxNativeScaleFactor(): Double`
- top-level `fun applyLinuxHiDpiScale()`
- `internal object HiDpiLinuxBridge` with `nativeGetScaleFactor(): Double`, `nativeApplyScaleToEnv(scale: Int)`.
- KDoc lists **six** detection sources in priority order: 1 `J2D_UISCALE`, 2 GSettings, **3 Mutter DBus (`org.gnome.Mutter.DisplayConfig`)**, 4 `GDK_SCALE`, 5 `GDK_DPI_SCALE`, 6 `Xft.dpi`.

---

## Findings per doc page

### performance/native-ssl.mdx

- **S1 (minor-fix) — Reference table, line 88.** Doc: `NativeTrustManager.trustManager: X509ExtendedTrustManager`. Source declares `val trustManager: X509TrustManager` (`NativeTrustManager.kt:14`, backing field `combined: X509TrustManager`). The runtime object returned by `TrustManagerFactory` is in practice an `X509ExtendedTrustManager`, but the declared/public type is `X509TrustManager`. The TL;DR/intro prose calling the result "a single `X509ExtendedTrustManager`" is describing behavior, but the API table's declared type is wrong.

- **S2 (needs-rewrite-facts) — Reference table, line 91.** Doc lists `NativeTrustManager.isAvailable(): Boolean` ("`false` only if the JNI bridge failed to load on macOS/Windows"). **This method does not exist.** `grep -rn "isAvailable" native-ssl/` returns nothing in `NativeTrustManager`. The only `isLoaded` flags are `internal` on `NativeSslBridge`/`WindowsSslBridge`. Invented API — remove the row.

- **S3 (needs-rewrite-facts) — Reference table, line 92.** Doc: `interface NativeCertificateProvider` — "SPI if you need to plug in a custom certificate source." Source has `internal object NativeCertificateProvider` (`NativeCertificateProvider.kt:12`). It is not public, not an `interface`, and there is no plug-in/SPI mechanism (dispatch is a hard `when (Platform.Current)`). Invented API — remove the row or rewrite to reflect there is no public SPI.

- OK — ProGuard rules (lines 108-113) match `dev.nucleusframework.nativessl.mac.NativeSslBridge` and `...windows.WindowsSslBridge` exactly (verified class FQNs).
- OK — Logging: `allowNucleusRuntimeLogging` import path `dev.nucleusframework.core.runtime.tools` matches `Logger.kt:3`; log tags `NativeCertificateProvider`, `NativeSslBridge`, `WindowsCertificateProvider`, `LinuxCertificateProvider` all match `TAG` constants.
- OK — Linux path table (lines 71-80) matches `LinuxCertificateProvider.BUNDLE_FILES` + `CERT_DIRS` exactly, including distro labels and file-vs-dir split.
- OK — Windows fallback keystores `Windows-ROOT`, `Windows-CA`, `Windows-MY` match `WindowsCertificateProvider.WINDOWS_STORES`.
- Not verifiable from Kotlin (native C/ObjC): SHA-1/`CERT_HASH_PROP_ID` dedup, five Windows store locations, `SecTrust*` macOS trust-settings logic. These live in `src/main/native/*` (out of Kotlin scope). Note: the Kotlin fallback dedups by Base64 of full DER, not SHA-1 — the SHA-1 claim only applies to the native bridge.

### performance/native-http.mdx

- OK across the board. `NativeHttpClient.create()`, `HttpClient.Builder.withNativeSsl()`, `NativeOkHttpClient.create()`, `OkHttpClient.Builder.withNativeSsl()`, and `HttpClientConfig<T>.installNativeSsl()` all match source names, packages, and behavior.
- OK — Ktor engine table (lines 92-97) matches `tryConfigureCio/Java/OkHttp/Apache5` in `NativeSslKtorExtension.kt`.
- OK — artifacts (lines 17-19), transitive `api(project(":native-ssl"))`, and `compileOnly` engines match build files.
- Minor/no-op — import shown is `import dev.nucleusframework.nativehttp.NativeHttpClient` (line 30) while `withNativeSsl` is a member extension of that object; calling `HttpClient.newBuilder().withNativeSsl()` (line 37) requires the extension to be in scope (import `NativeHttpClient.withNativeSsl` or dispatch through the object). Cosmetic; behavior is correct.

### performance/linux-hidpi.mdx

- **H1 (minor-fix) — TL;DR line 11 and How-it-works table (lines 65-73).** Doc enumerates five detection sources and omits the **Mutter DBus** source (`org.gnome.Mutter.DisplayConfig`, GNOME fractional scale), which the source KDoc lists as priority 3 (`LinuxHiDpi.kt:11`). Priority numbering is also shifted: doc puts `GDK_SCALE` at priority 3, source puts Mutter at 3 and `GDK_SCALE` at 4. Add Mutter DBus and renumber.
- OK — `getLinuxNativeScaleFactor(): Double` and `applyLinuxHiDpiScale()` signatures, package `dev.nucleusframework.hidpi`, and no-op-on-non-Linux / `0.0` fallback behavior all match.
- OK — ProGuard rule `dev.nucleusframework.hidpi.HiDpiLinuxBridge` matches the class FQN.
- OK — native lib name `libnucleus_linux_hidpi_jni.so` matches `LIBRARY_NAME = "nucleus_linux_hidpi_jni"` and the `buildNativeLinux` output paths in build.gradle.kts (`linux-x64`, `linux-aarch64`).
- OK — `applyLinuxHiDpiScale` behavior: doc "sets `sun.java2d.uiScale` if unset and scale > 0" matches; source additionally calls `nativeApplyScaleToEnv` (GDK_SCALE) and sets `sun.java2d.uiScale.enabled=true` — doc under-describes but is not wrong.

### performance/native-access.mdx — OUT OF CLUSTER

This page documents the GraalVM reflection-metadata pipeline. **None of its APIs come from the five assigned modules.** The referenced symbols live elsewhere and do exist:
- `runWithNativeAgent`, `analyzeGraalvmStaticMetadata`, `cleanupGraalvmMetadata` → `plugin-build/plugin/.../configureGraalvmApplication.kt` (+ `CleanupGraalvmMetadataTask.kt`).
- `GraalVmInitializer` → `graalvm-runtime/.../GraalVmInitializer.kt`.
- `nucleus.graalvm-runtime`, `dev.nucleusframeworknativeaccess` (external plugin), `NucleusNativeAccess` — external repo, not in this monorepo (expected).

Not stale, but should be fact-checked under the GraalVM cluster, not performance-native. No action taken here.

---

## Undocumented modules

Within this cluster, all five source modules are documented (okhttp/ktor adapters are covered inside `performance/native-http.mdx`). No missing pages inside the cluster.

Cross-cluster suspects that have real Kotlin sources but no dedicated doc page (belong to other clusters — noted for the owning cluster's recon):
- `fs-watcher` — has `src/main/kotlin`; only referenced in `roadmap.mdx`, no dedicated page. Suggested page: `lifecycle/fs-watcher`.

Other suspects already have pages: `sf-symbols` (`os/menu-macos.mdx`, `concepts/modules.mdx`), `scheduler-testing` (`lifecycle/scheduler.mdx`), `taskbar-progress-tao` (`lifecycle/taskbar-progress.mdx`). These are out of this cluster's scope regardless.

## Stale pages

None. No doc page in this cluster references a feature with no backing source (the invented `isAvailable()` and `interface NativeCertificateProvider` are individual API rows to fix, not whole stale pages).
