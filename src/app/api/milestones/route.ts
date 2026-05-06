import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const milestones = await prisma.milestone.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(milestones);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date } = body;

    const milestone = await prisma.milestone.create({
      data: {
        title,
        date: new Date(date),
      },
    });

    return NextResponse.json(milestone);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
