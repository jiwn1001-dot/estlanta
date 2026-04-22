import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'site.json');

export async function GET() {
  let siteSettings;
  try {
    siteSettings = await kv.get('site');
  } catch (e) {
    console.warn('KV not configured, using fallback');
  }

  if (!siteSettings) {
    try {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      siteSettings = JSON.parse(fileData);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load site settings' }, { status: 500 });
    }
  }
  return NextResponse.json(siteSettings || {});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await kv.set('site', body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to save site settings' }, { status: 500 });
  }
}
