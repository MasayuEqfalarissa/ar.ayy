import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.bucketItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    const item = await prisma.bucketItem.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
