import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Nucleus — the Kotlin framework for native desktop apps';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(1200px 600px at 20% 30%, rgba(91,141,239,0.35), transparent 60%), radial-gradient(900px 500px at 80% 70%, rgba(155,123,255,0.28), transparent 60%), #0a0d14',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.6, marginBottom: 24, letterSpacing: 2 }}>
          NUCLEUS · 2.0
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
          The Kotlin framework for{' '}
          <span
            style={{
              background: 'linear-gradient(90deg,#5B8DEF,#9B7BFF)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            cross-platform native
          </span>{' '}
          desktop apps.
        </div>
        <div style={{ marginTop: 36, fontSize: 28, opacity: 0.7 }}>{SITE.url.replace(/^https?:\/\//, '')}</div>
      </div>
    ),
    size,
  );
}
