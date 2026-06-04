import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'success' | 'destructive' }): React.JSX.Element {
  const styles: Record<typeof variant, string> = {
    default: 'bg-slate-950 text-white',
    secondary: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    destructive: 'bg-rose-50 text-rose-700',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', styles[variant], className)}
      {...props}
    />
  );
}
