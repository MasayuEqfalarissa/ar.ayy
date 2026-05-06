import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(memories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dateStr = formData.get('date') as string;
    const file = formData.get('file') as File;

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-');
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(uploadPath, buffer);

    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const date = dateStr ? new Date(dateStr) : new Date();

    const memory = await prisma.memory.create({
      data: {
        title,
        description,
        mediaUrl: `/uploads/${filename}`,
        mediaType,
        date,
      }
    });

    return NextResponse.json(memory);
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
  }
}
