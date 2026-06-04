import type * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-9 w-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
