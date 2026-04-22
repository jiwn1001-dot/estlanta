import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'site.json');

export async function GET() {
  try {
    let siteSettings = await kv.get('site');
    if (!siteSettings) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      siteSettings = JSON.parse(fileData);
    }
    return NextResponse.json(siteSettings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load site settings' }, { status: 500 });
  }
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
