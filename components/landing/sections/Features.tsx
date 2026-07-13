import * as React from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';

interface FeatureItem {
  name: string;
  desc: string;
  icon: string;
  new?: boolean;
}

const ITEMS: FeatureItem[] = [
  { name: 'Decorated Window', desc: 'Custom title bar, native controls, theme-aware. Tao backend in 2.0.', icon: 'window', new: true },
  { name: 'Native Notifications', desc: 'macOS UserNotifications, Win Toast, freedesktop D-Bus. One Kotlin API.', icon: 'bell' },
  { name: 'System Tray', desc: 'Status icons with menus, badges, click handlers — across all three OSes.', icon: 'tray' },
  { name: 'Dock & Launcher', desc: 'Badges, jump lists, dock menus, Unity launcher entries.', icon: 'dock' },
  { name: 'Dark Mode Detector', desc: 'Reactive OS theme observation. Switch in real time.', icon: 'theme' },
  { name: 'System Color', desc: 'OS accent color + high-contrast — observed via JNI.', icon: 'color' },
  { name: 'Global Hotkey', desc: 'OS-level shortcuts, multi-modifier, work app-wide.', icon: 'key' },
  { name: 'Taskbar Progress', desc: 'Progress bars on Windows taskbar, macOS dock, Unity launcher.', icon: 'progress' },
  { name: 'Auto-Update', desc: 'Check, download, verify, install. With post-update events.', icon: 'update' },
  { name: 'Deep Links', desc: 'Protocol handlers + file associations on all platforms.', icon: 'link' },
  { name: 'Native HTTP / SSL', desc: 'OS trust store merged into JDK defaults.', icon: 'shield' },
  { name: 'Native Access', desc: 'Write Kotlin/Native and call from JVM. No C, no glue.', icon: 'chip' },
];

function FeatIcon({ name }: { name: string }) {
  const c = 'currentColor';
  const sw = 1.4;
  switch (name) {
    case 'window': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth={sw}/><path d="M3 9h18" stroke={c} strokeWidth={sw}/><circle cx="6" cy="7" r="0.6" fill={c}/><circle cx="8" cy="7" r="0.6" fill={c}/><circle cx="10" cy="7" r="0.6" fill={c}/></svg>;
    case 'bell': return <svg viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0v3l1.5 3h-15L6 12V9z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M10 18a2 2 0 004 0" stroke={c} strokeWidth={sw}/></svg>;
    case 'tray': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="16" width="18" height="4" rx="1" stroke={c} strokeWidth={sw}/><circle cx="7" cy="18" r="0.8" fill={c}/><circle cx="10" cy="18" r="0.8" fill={c}/><circle cx="13" cy="18" r="0.8" fill={c}/><path d="M9 12l3 3 3-3M12 4v11" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'dock': return <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="14" width="20" height="6" rx="2" stroke={c} strokeWidth={sw}/><circle cx="7" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><circle cx="12" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><circle cx="17" cy="17" r="1.2" stroke={c} strokeWidth={sw}/><path d="M12 4v6" stroke={c} strokeWidth={sw} strokeLinecap="round"/><circle cx="17" cy="6" r="2" fill={c}/></svg>;
    case 'theme': return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={c} strokeWidth={sw}/><path d="M12 4a8 8 0 000 16V4z" fill={c}/></svg>;
    case 'color': return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={c} strokeWidth={sw}/><circle cx="8" cy="9" r="1.2" fill={c}/><circle cx="15" cy="8" r="1.2" fill={c}/><circle cx="16" cy="14" r="1.2" fill={c}/><circle cx="10" cy="16" r="1.2" fill={c}/></svg>;
    case 'key': return <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke={c} strokeWidth={sw}/><path d="M6 10v0M10 10v0M14 10v0M18 10v0M6 14h12" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'progress': return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="4" rx="2" stroke={c} strokeWidth={sw}/><rect x="5" y="12" width="9" height="0" stroke={c} strokeWidth={sw}/><path d="M5 12h9" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>;
    case 'update': return <svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'link': return <svg viewBox="0 0 24 24" fill="none"><path d="M10 14l4-4M9 7l1-1a4 4 0 015.7 5.7l-1 1M15 17l-1 1a4 4 0 01-5.7-5.7l1-1" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    case 'shield': return <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chip': return <svg viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke={c} strokeWidth={sw}/><rect x="9" y="9" width="6" height="6" stroke={c} strokeWidth={sw}/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>;
    default: return null;
  }
}

export function Features() {
  return (
    <section className="features" id="features">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Runtime"
          title={<>40+ modules. <br/>Every OS feature, <span className="hero-grad">first-class</span>.</>}
          subtitle="Nucleus doesn't just expose native APIs — it makes them simpler than the originals. A clean Kotlin API per platform feature, same shape everywhere."
        />
        <div className="feat-grid">
          {ITEMS.map((f, i) => (
            <div key={i} className="feat-card">
              {f.new && <span className="feat-new">New in 2.0</span>}
              <div className="feat-icon"><FeatIcon name={f.icon} /></div>
              <div className="feat-name">{f.name}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="feat-cta">
          <a href="/docs/concepts/runtimes" className="btn btn-ghost">
            Browse all runtime modules
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
