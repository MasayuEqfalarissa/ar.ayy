import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moods = await prisma.mood.findMany({
      where: {
        date: {
          gte: today,
        },
      },
    });
    return NextResponse.json(moods);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, emoji } = body;

    // Delete existing mood for today for this user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.mood.deleteMany({
      where: {
        name,
        date: {
          gte: today,
        },
      },
    });

    const mood = await prisma.mood.create({
      data: {
        name,
        emoji,
      },
    });

    return NextResponse.json(mood);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create mood' }, { status: 500 });
  }
}
