import type * as ReactTypes from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}): ReactTypes.JSX.Element {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {action ? (
        <div className="mt-6">
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
