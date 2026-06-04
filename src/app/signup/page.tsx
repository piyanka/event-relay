import type * as React from 'react';
import { SignupForm } from '@/components/forms/signup-form';
import { PageShell } from '@/components/layout/page-shell';

export default function SignupPage(): React.JSX.Element {
  return (
    <PageShell className="grid place-items-center py-16">
      <SignupForm />
    </PageShell>
  );
}
