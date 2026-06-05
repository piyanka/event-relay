import type * as React from 'react';
import { redirect } from 'next/navigation';
import { PageShell } from '@/components/layout/page-shell';
import { EventForm } from '@/components/forms/event-form';
import { safeAuth } from '@/lib/safe-auth';

export const dynamic = 'force-dynamic';

export default async function NewEventPage(): Promise<React.JSX.Element> {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== 'HOST') {
    redirect('/login');
  }

  return (
    <PageShell className="py-10">
      <EventForm />
    </PageShell>
  );
}
