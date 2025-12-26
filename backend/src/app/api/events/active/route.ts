import { NextResponse } from 'next/server';
import { getActiveEvents } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const events = await getActiveEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching active events:', error);
    return NextResponse.json({ error: 'Failed to fetch active events' }, { status: 500 });
  }
}
