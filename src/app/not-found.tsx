import type * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">We could not find that page.</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The link may be outdated or the event may have been removed.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
