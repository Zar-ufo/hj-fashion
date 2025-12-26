import { NextResponse } from 'next/server';
import { getFeaturedEvent } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const event = await getFeaturedEvent();
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching featured event:', error);
    return NextResponse.json({ error: 'Failed to fetch featured event' }, { status: 500 });
  }
}
