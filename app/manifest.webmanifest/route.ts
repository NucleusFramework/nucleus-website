import { NextResponse } from 'next/server';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return NextResponse.json({
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0d14',
    theme_color: '#0a0d14',
    icons: [{ src: '/assets/logo.png', sizes: 'any', type: 'image/png' }],
  });
}
