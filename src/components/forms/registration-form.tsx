'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerForEventAction } from '@/actions/registrations';
import { FormAlert } from '@/components/forms/form-alert';
import { SubmitButton } from '@/components/forms/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/providers/toast-provider';
import type { FormState } from '@/types/forms';
import { initialFormState } from '@/types/forms';

export function RegistrationForm({ eventId }: { eventId: string }): ReactTypes.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useActionState<FormState, FormData>(registerForEventAction, initialFormState);
  const previousStatus = React.useRef(state.status);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (previousStatus.current !== state.status && state.status === 'success') {
      toast({
        title: 'Registration complete',
        description: state.message,
        variant: 'default',
      });
      formRef.current?.reset();
      router.refresh();
    }

    previousStatus.current = state.status;
  }, [router, state.message, state.status, toast]);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        {/* <CardDescription>Join the event with a new attendee account or an existing attendee login.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-5">
          <input type="hidden" name="eventId" value={eventId} />
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="John Appleseed" />
            {state.fieldErrors?.name ? <p className="text-sm text-rose-600">{state.fieldErrors.name}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@gmail.com" />
            {state.fieldErrors?.email ? <p className="text-sm text-rose-600">{state.fieldErrors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" />
            {state.fieldErrors?.password ? <p className="text-sm text-rose-600">{state.fieldErrors.password}</p> : null}
          </div>

          <FormAlert status={state.status} message={state.message} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton className="w-full">Register now</SubmitButton>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Already registered?</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
