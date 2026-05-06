import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (!type || !amount || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: date ? new Date(date) : new Date(),
      }
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction Error:', error);
    return NextResponse.json({ error: 'Failed to save transaction' }, { status: 500 });
  }
}
