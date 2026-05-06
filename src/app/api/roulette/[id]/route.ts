import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    await prisma.rouletteOption.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}
