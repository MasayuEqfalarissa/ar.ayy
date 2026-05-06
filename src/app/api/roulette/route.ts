import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const options = await prisma.rouletteOption.findMany();
    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const option = await prisma.rouletteOption.create({
      data: { text },
    });
    return NextResponse.json(option);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}
