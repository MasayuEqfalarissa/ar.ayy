import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const memory = await prisma.memory.findUnique({ where: { id } });
    
    if (!memory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    try {
      if (memory.mediaUrl && memory.mediaUrl.includes('public.blob.vercel-storage.com')) {
        await del(memory.mediaUrl);
      }
    } catch (e) {
      console.warn('Failed to delete file, might already be deleted', e);
    }

    await prisma.memory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE MEMORY ERROR:", error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { title, description } = body;

    const memory = await prisma.memory.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(memory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}
