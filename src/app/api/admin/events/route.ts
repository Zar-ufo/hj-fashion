import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '@/lib/db-queries';

// GET all events
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST create new event
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, discount_percent, start_date, end_date, applies_to, category_id, min_price, max_price } = body;

    if (!name || !discount_percent || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await createEvent({
      name,
      description,
      discount_percent: parseFloat(discount_percent),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      applies_to: applies_to || 'ALL',
      category_id: category_id || undefined,
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PATCH update event
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, ...updateData } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    // Parse dates and numbers if present
    if (updateData.start_date) updateData.start_date = new Date(updateData.start_date);
    if (updateData.end_date) updateData.end_date = new Date(updateData.end_date);
    if (updateData.discount_percent) updateData.discount_percent = parseFloat(updateData.discount_percent);
    if (updateData.min_price) updateData.min_price = parseFloat(updateData.min_price);
    if (updateData.max_price) updateData.max_price = parseFloat(updateData.max_price);

    const event = await updateEvent(eventId, updateData);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    await deleteEvent(eventId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
