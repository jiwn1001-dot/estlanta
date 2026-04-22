import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'site.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const siteSettings = JSON.parse(fileData);
    return NextResponse.json(siteSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load site settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), 'utf8');
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save site settings' }, { status: 500 });
  }
}
