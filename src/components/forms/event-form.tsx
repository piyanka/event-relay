'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEventAction } from '@/actions/events';
import { FormAlert } from '@/components/forms/form-alert';
import { SubmitButton } from '@/components/forms/submit-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/providers/toast-provider';
import type { FormState } from '@/types/forms';
import { initialFormState } from '@/types/forms';

export function EventForm(): ReactTypes.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useActionState<FormState, FormData>(createEventAction, initialFormState);
  const previousStatus = React.useRef(state.status);

  useEffect(() => {
    if (previousStatus.current !== state.status && state.status === 'success') {
      toast({
        title: 'Event created',
        description: state.message,
        variant: 'default',
      });
      router.push('/dashboard');
    }

    previousStatus.current = state.status;
  }, [router, state.message, state.status, toast]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Create event</CardTitle>
        <CardDescription>Publish a public event with optional capacity and registration cutoff.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Byamn Dev Meetup 2026" />
            {state.fieldErrors?.title ? <p className="text-sm text-rose-600">{state.fieldErrors.title}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the event, agenda, and who should attend." />
            {state.fieldErrors?.description ? <p className="text-sm text-rose-600">{state.fieldErrors.description}</p> : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" />
              {state.fieldErrors?.date ? <p className="text-sm text-rose-600">{state.fieldErrors.date}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" />
              {state.fieldErrors?.time ? <p className="text-sm text-rose-600">{state.fieldErrors.time}</p> : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Venue</Label>
            <Input id="location" name="location" placeholder="Bengaluru, India or Zoom" />
            {state.fieldErrors?.location ? <p className="text-sm text-rose-600">{state.fieldErrors.location}</p> : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" min="1" placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Registration deadline</Label>
              <Input id="registrationDeadline" name="registrationDeadline" type="datetime-local" />
            </div>
          </div>

          <FormAlert status={state.status} message={state.message} />

          <div className="flex items-center justify-end gap-3">
            <SubmitButton>Create event</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
