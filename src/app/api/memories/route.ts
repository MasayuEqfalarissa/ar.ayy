import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';

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

    // Upload to Vercel Blob
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    });

    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const date = dateStr ? new Date(dateStr) : new Date();

    const memory = await prisma.memory.create({
      data: {
        title,
        description,
        mediaUrl: blob.url,
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
