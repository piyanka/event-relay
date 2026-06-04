import type * as React from 'react';
import { LoginForm } from '@/components/forms/login-form';
import { PageShell } from '@/components/layout/page-shell';

export default function LoginPage(): React.JSX.Element {
  return (
    <PageShell className="grid place-items-center py-16">
      <LoginForm />
    </PageShell>
  );
}
