import { Parser } from 'json2csv';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEventRegistrations } from '@/lib/data';
import { getHostEventOrThrow } from '@/lib/guards';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'HOST') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await getHostEventOrThrow(id, session.user.id);
    const { registrations } = await getEventRegistrations(id);
    const parser = new Parser({
      fields: [
        { label: 'name', value: 'name' },
        { label: 'email', value: 'email' },
      ],
    });
    const csv = parser.parse(registrations.map((registration) => ({ name: registration.name, email: registration.email })));

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="event-attendees-${id}.csv"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed.';
    return NextResponse.json(
      { message },
      { status: message === 'Event not found.' ? 404 : 403 },
    );
  }
}
