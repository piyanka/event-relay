'use client';

import type * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export function SubmitButton({
  children,
  className,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
}): React.JSX.Element {
  const { pending } = useFormStatus();

  return (
    <Button className={className} type="submit" disabled={pending} variant={variant}>
      {pending ? <Spinner /> : null}
      {children}
    </Button>
  );
}
