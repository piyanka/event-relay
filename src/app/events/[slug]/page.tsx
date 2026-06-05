import type * as React from 'react';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { getEventForRegistrationPage } from '@/lib/data';
import { formatDate, formatTime, formatDateTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageShell } from '@/components/layout/page-shell';
import { RegistrationForm } from '@/components/forms/registration-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShareLinkButton } from '@/components/event/share-link-button';

export const dynamic = 'force-dynamic';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const event = await getEventForRegistrationPage(slug);

  if (!event) {
    notFound();
  }

  return (
    <PageShell className="pb-16 pt-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={event.isOpenForRegistration ? 'success' : 'destructive'}>
                {event.isOpenForRegistration ? 'Registration open' : 'Registration closed'}
              </Badge>
              <span className="text-sm text-slate-500">{event.attendeeCount} registered</span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{event.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Date</p>
                <p className="mt-2 text-lg font-medium text-slate-950">{formatDate(event.date)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Time</p>
                <p className="mt-2 text-lg font-medium text-slate-950">{formatTime(event.time)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Venue</p>
                <p className="mt-2 text-lg font-medium text-slate-950">{event.location}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Registrations</p>
                <p className="mt-2 text-lg font-medium text-slate-950">{event.attendeeCount}</p>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/events">Back to events</Link>
                </Button>
                <ShareLinkButton path={`/events/${event.slug}`} label="Share event" />
              </div>
            </div>
          </CardContent>
        </Card>

        {event.isOpenForRegistration ? (
          <RegistrationForm eventId={event.id} />
        ) : (
          <Card className="sticky top-24">
            <CardContent className="p-8">
              <Badge variant="destructive">Registration closed</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">This event is no longer accepting registrations.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                It may be full, manually closed by the host, or past the registration deadline.
              </p>
              {event.registrationDeadline ? (
                <p className="mt-4 text-sm text-slate-500">Deadline: {formatDateTime(event.registrationDeadline)}</p>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
