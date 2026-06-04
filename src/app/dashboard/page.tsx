import type * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getHostDashboardData } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { EventManagementActions } from "@/components/event/event-management-actions";
import { ShareLinkButton } from "@/components/event/share-link-button";
import { CalendarDays, MapPin, Plus } from "lucide-react";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOST") {
    redirect("/login");
  }

  const { stats, events } = await getHostDashboardData(session.user.id);

  return (
    <PageShell className="pb-16 pt-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="secondary">Host dashboard</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Manage your events from one place.
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="h-4 w-4" />
            Create event
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard
          label="Total events"
          value={String(stats.totalEvents)}
          // hint="All events created by your host account"
        />
        <StatCard
          label="Total registrations"
          value={String(stats.totalRegistrations)}
          // hint="All registrations across your events"
        />
        <StatCard
          label="Unique attendees"
          value={String(stats.totalAttendees)}
          // hint="Distinct people across your hosted events"
        />
      </div>

      <section className="mt-12">

        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Create your first event to start collecting registrations."
            action={{ label: "Create event", href: "/dashboard/events/new" }}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>{event.title}</CardTitle>
                    <Badge variant={event.isClosed ? "destructive" : "success"}>
                      {event.isClosed ? "Closed" : "Open"}
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Schedule
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {formatDate(event.date)} at {formatTime(event.time)}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Registrations
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {event.registrationCount} attendees
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </span>
                    {event.capacity ? (
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" /> Capacity:{" "}
                        {event.capacity}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/events/${event.id}`}>
                        View registrations
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/api/events/${event.id}/export`}>
                        Export CSV
                      </Link>
                    </Button>
                    <ShareLinkButton
                      path={`/events/${event.slug}`}
                      label="Share link"
                    />
                    <EventManagementActions
                      eventId={event.id}
                      isClosed={event.isClosed}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
