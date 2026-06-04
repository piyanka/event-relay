import type * as React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PageShell } from '@/components/layout/page-shell';
import { EventForm } from '@/components/forms/event-form';

export default async function NewEventPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'HOST') {
    redirect('/login');
  }

  return (
    <PageShell className="py-10">
      <EventForm />
    </PageShell>
  );
}
