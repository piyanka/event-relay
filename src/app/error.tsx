'use client';

import { useEffect } from 'react';
import type * as React from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Something went wrong</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">We hit a snag while loading this page.</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Please try again. If the problem keeps happening, refresh the page or come back in a moment.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
