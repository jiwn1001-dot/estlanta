import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'factions.json');

export async function GET() {
  try {
    let factions = await kv.get('factions');
    if (!factions) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      factions = JSON.parse(fileData);
    }
    return NextResponse.json(factions || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load factions' }, { status: 500 });
  }
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
