import type * as React from 'react';
import { cn } from '@/lib/utils';

export function PageShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return <main className={cn('mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8', className)}>{children}</main>;
}
