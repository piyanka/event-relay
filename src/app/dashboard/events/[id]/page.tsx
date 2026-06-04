import type * as React from 'react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getEventRegistrations } from '@/lib/data';
import { getHostEventOrThrow } from '@/lib/guards';
import { formatDate, formatTime, formatDateTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/layout/page-shell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { Search } from 'lucide-react';

export default async function EventRegistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'HOST') {
    redirect('/login');
  }

  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const searchQuery = typeof resolvedSearchParams?.q === 'string' ? resolvedSearchParams.q : undefined;

  const event = await getHostEventOrThrow(id, session.user.id).catch(() => null);
  if (!event) {
    notFound();
  }

  const { registrations, totalCount, filteredCount } = await getEventRegistrations(id, searchQuery);

  return (
    <PageShell className="py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant={event.isClosed ? 'destructive' : 'success'}>
            {event.isClosed ? 'Closed' : 'Open'}
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{event.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{event.description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Date</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(event.date)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Time</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{formatTime(event.time)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Registrations</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{totalCount}</p>
            {searchQuery ? <p className="mt-2 text-xs text-slate-500">Showing {filteredCount} filtered results</p> : null}
            {event.registrationDeadline ? (
              <p className="mt-2 text-xs text-slate-500">Deadline {formatDateTime(event.registrationDeadline.toString())}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
          <CardDescription>Search attendees by name or email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input name="q" defaultValue={searchQuery ?? ''} placeholder="Search by name or email" className="pl-11" />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {registrations.length === 0 ? (
            <EmptyState
              title="No registrations found"
              description={searchQuery ? 'Try a different search term.' : 'No one has registered for this event yet.'}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium text-slate-950">{registration.name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
