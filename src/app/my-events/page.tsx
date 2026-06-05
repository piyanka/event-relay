import type * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAttendeeDashboardData } from '@/lib/data';
import { safeAuth } from '@/lib/safe-auth';
import { formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/layout/page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { CancelRegistrationButton } from '@/components/event/cancel-registration-button';

export const dynamic = 'force-dynamic';

export default async function MyEventsPage(): Promise<React.JSX.Element> {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== 'ATTENDEE') {
    redirect('/login');
  }

  const { registrations } = await getAttendeeDashboardData(session.user.id);

  return (
    <PageShell className="py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="secondary">Attendee dashboard</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Your registered events.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Manage the events you joined and cancel registrations when your plans change.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/events">Browse more events</Link>
        </Button>
      </div>

      <div className="mt-8">
        {registrations.length === 0 ? (
          <EmptyState
            title="No registrations yet"
            description="Explore public events and register for one to see it here."
            action={{ label: 'Browse public events', href: '/events' }}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {registrations.map((registration) => (
              <Card key={registration.registrationId}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>{registration.title}</CardTitle>
                    <Badge variant="success">Registered</Badge>
                  </div>
                  <CardDescription>{registration.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{formatDate(registration.date)}</p>
                  <div className="mt-6">
                    <CancelRegistrationButton registrationId={registration.registrationId} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
