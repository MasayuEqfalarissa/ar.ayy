import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { type, amount, category, description, date } = body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
