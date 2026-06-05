'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/providers/toast-provider';

export function LoginForm(): ReactTypes.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: searchParams.get('callbackUrl') ?? '/post-login',
    });

    setPending(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    toast({
      title: 'Welcome back',
      description: 'You have been logged in successfully.',
      variant: 'default',
    });

    router.push(result?.url ?? searchParams.get('callbackUrl') ?? '/post-login');
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Use your host or attendee credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@company.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {searchParams.get('registered') ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              Your host account is ready. Log in to continue.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">{error}</div>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in...' : 'Log in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
