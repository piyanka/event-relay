import type * as React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormAlert({
  status,
  message,
}: {
  status: 'idle' | 'success' | 'error';
  message: string;
}): React.JSX.Element | null {
  if (status === 'idle' || !message) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 text-sm',
        status === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
          : 'border-rose-200 bg-rose-50 text-rose-950',
      )}
    >
      {status === 'success' ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
}
