import type * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/page-shell';
import { HeroPreview } from '@/components/home/hero-preview';

export default async function HomePage(): Promise<React.JSX.Element> {
  return (
    <PageShell className="pb-16 pt-6 sm:pt-8">
      <section className="grid min-h-[calc(100vh-7rem)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-6">
        <div className="max-w-2xl">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Simple events, smooth registrations.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover active events and register fast from one clean dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/events">See events</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Create host account</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Want to browse public events first?{" "}
            <Link href="/events" className="font-medium text-slate-900 underline underline-offset-4">
              Open the event list
            </Link>
            .
          </p>
        </div>

        <HeroPreview />
      </section>
    </PageShell>
  );
}
