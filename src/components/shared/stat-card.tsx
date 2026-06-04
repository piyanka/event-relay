import type * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm text-center">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-0.5 text-3xl font-semibold tracking-tight text-slate-900/80">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}