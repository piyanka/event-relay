'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hostSignupAction } from '@/actions/auth';
import { FormAlert } from '@/components/forms/form-alert';
import { SubmitButton } from '@/components/forms/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormState } from '@/types/forms';
import { initialFormState } from '@/types/forms';
import { useToast } from '@/components/providers/toast-provider';

export function SignupForm(): ReactTypes.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useActionState<FormState, FormData>(hostSignupAction, initialFormState);
  const previousStatus = React.useRef(state.status);

  useEffect(() => {
    if (previousStatus.current !== state.status && state.status === 'success') {
      toast({
        title: 'Account created',
        description: state.message,
        variant: 'default',
      });
      router.push('/login?registered=1');
    }

    previousStatus.current = state.status;
  }, [router, state.message, state.status, toast]);

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create your host account</CardTitle>
        <CardDescription>Set up your organizer profile and start publishing events.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Alex Morgan" />
            {state.fieldErrors?.name ? <p className="text-sm text-rose-600">{state.fieldErrors.name}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@company.com" />
            {state.fieldErrors?.email ? <p className="text-sm text-rose-600">{state.fieldErrors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" />
            {state.fieldErrors?.password ? <p className="text-sm text-rose-600">{state.fieldErrors.password}</p> : null}
          </div>

          <FormAlert status={state.status} message={state.message} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton className="w-full">Create host account</SubmitButton>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Already have an account</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
