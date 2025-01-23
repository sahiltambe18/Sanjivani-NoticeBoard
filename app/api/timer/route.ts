import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
  try {
    const timer = await prisma.timer.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(timer);
  } catch (error) {
    console.error('Timer GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch timer' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isEnabled, duration } = body;
    
    const endTime = isEnabled ? new Date(Date.now() + duration * 1000) : null;
    
    // Delete all existing timers first
    await prisma.timer.deleteMany({});
    
    const timer = await prisma.timer.create({
      data: {
        isEnabled,
        duration,
        endTime
      }
    });
    
    return NextResponse.json(timer);
  } catch (error) {
    console.error('Timer POST error:', error);
    return NextResponse.json({ error: 'Failed to create timer' }, { status: 500 });
  }
} 