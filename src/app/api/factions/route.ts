import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'factions.json');

export async function GET() {
  let factions;
  try {
    factions = await kv.get('factions');
  } catch (e) {
    console.warn('KV not configured, using fallback');
  }

  if (!factions) {
    try {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      factions = JSON.parse(fileData);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to load factions' }, { status: 500 });
    }
  }
  return NextResponse.json(factions || {});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await kv.set('factions', body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to save factions' }, { status: 500 });
  }
}
