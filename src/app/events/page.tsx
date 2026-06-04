import type * as React from "react";
import Link from "next/link";
import { getPublicEvents } from "@/lib/data";
import { formatDate, formatTime, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { CalendarDays, MapPin } from "lucide-react";

export default async function EventsPage(): Promise<React.JSX.Element> {
  const events = await getPublicEvents();

  return (
    <PageShell className="pb-16 pt-8 sm:pt-10">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl mt-10 font-semibold tracking-tight text-slate-950 sm:text-6xl">
          Active Events
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Discover active events and register fast from one clean dashboard.
        </p>
      </section>

      <section className="mt-14">
        {/* <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Active events</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Open now</h2>
          </div> */}

        {/* </div> */}

        {events.length === 0 ? (
          <EmptyState
            title="No active events yet"
            description="Published events will appear here."
            action={{ label: "Create host account", href: "/signup" }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant={event.isClosed ? "destructive" : "success"}>
                      {event.isClosed ? "Closed" : "Open"}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {event.attendeeCount} attendees
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                    {event.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>
                  <div className="mt-6 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </p>
                    {event.registrationDeadline ? (
                      <p className="text-xs text-slate-500">
                        Registration closes{" "}
                        {formatDateTime(event.registrationDeadline)}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href={`/events/${event.slug}`}>View event</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-20 flex justify-center">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/">Back home</Link>
        </Button>
        </div>
        
      </section>
    </PageShell>
  );
}
