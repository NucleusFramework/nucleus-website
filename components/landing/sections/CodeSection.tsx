import * as React from 'react';
import { CodeBlock } from '@/components/landing/CodeBlock';
import { SectionHeading } from '@/components/landing/SectionHeading';

function CodeFeature({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="cf">
      <div className="cf-bullet" />
      <div>
        <div className="cf-label">{label}</div>
        <div className="cf-desc">{desc}</div>
      </div>
    </div>
  );
}

export function CodeSection() {
  const buildGradle = `plugins {
    id("dev.nucleusframework") version "2.0.0"
}

nucleus.application {
    mainClass = "com.example.MainKt"

    nativeDistributions {
        targetFormats(
            TargetFormat.Dmg,
            TargetFormat.Nsis,
            TargetFormat.Deb,
        )
        packageName = "MyApp"
        packageVersion = "1.0.0"
    }

    // New in 2.0 — Tao backend for native window decorations
    decoratedWindow {
        backend = WindowBackend.Tao
        useNativeTitleBar = true
    }
}`;

  const mainKt = `package com.example

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import dev.nucleusframework.application.NucleusApplication
import dev.nucleusframework.darkmodedetector.isSystemInDarkMode
import dev.nucleusframework.notification.notify
import dev.nucleusframework.window.DecoratedWindow

fun main() = NucleusApplication {
    val dark = isSystemInDarkMode()

    DecoratedWindow(title = "MyApp") {
        Greeting(dark)
    }
}

@Composable
fun Greeting(dark: Boolean) {
    Text("Hello, native desktop. (dark = " + dark + ")")
    notify("Welcome", "Running on Nucleus 2.0")
}`;

  const installSh = `# macOS — detects Apple Silicon or Intel
curl -fsSL https://nucleusframework.dev/install.sh | bash

# Linux — detects deb / rpm and your architecture
curl -fsSL https://nucleusframework.dev/install-linux.sh | bash

# Or build it yourself, on any platform
./gradlew packageDistributionForCurrentOS`;

  return (
    <section className="code-section" id="code">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Quick start"
          title={<>One Gradle DSL.<br />Eighteen installer formats.</>}
          subtitle="Add a plugin, declare your distributions, and ship to every desktop. No CMake, no native build scripts, no platform-specific maintainers."
        />
        <div className="code-section-grid">
          <div className="code-section-codecol">
            <CodeBlock
              tabs={[
                { filename: 'build.gradle.kts', lang: 'kotlin', code: buildGradle },
                { filename: 'Main.kt', lang: 'kotlin', code: mainKt },
                { filename: 'install.sh', lang: 'bash', code: installSh },
              ]}
            />
          </div>
          <div className="code-section-aside">
            <CodeFeature label="18 packaging formats" desc="DMG, PKG, Exe, MSI, NSIS, NSIS Web, Portable, AppX, DEB, RPM, AppImage, RawAppImage, Pacman, Snap, Flatpak, ZIP, TAR, 7Z." />
            <CodeFeature label="Store-ready" desc="Mac App Store, Microsoft Store, Snapcraft, Flathub — one build, every store." />
            <CodeFeature label="Code signing + notarization" desc="Built into the build pipeline for Windows and macOS." />
            <CodeFeature label="Auto-update" desc="Check, download, verify, install — without third-party services." />
          </div>
        </div>
      </div>
    </section>
  );
}
