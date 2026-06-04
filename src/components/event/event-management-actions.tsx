'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEventFormAction, closeEventFormAction } from '@/actions/events';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/forms/form-alert';
import { useToast } from '@/components/providers/toast-provider';
import { initialFormState, type FormState } from '@/types/forms';

export function EventManagementActions({
  eventId,
  isClosed,
}: {
  eventId: string;
  isClosed: boolean;
}): ReactTypes.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [closeState, closeAction] = useActionState<FormState, FormData>(closeEventFormAction, initialFormState);
  const [deleteState, deleteAction] = useActionState<FormState, FormData>(deleteEventFormAction, initialFormState);
  const previousCloseStatus = React.useRef(closeState.status);
  const previousDeleteStatus = React.useRef(deleteState.status);

  useEffect(() => {
    if (previousCloseStatus.current !== closeState.status && closeState.status === 'success') {
      toast({
        title: 'Event updated',
        description: closeState.message,
        variant: 'default',
      });
      router.refresh();
    }

    previousCloseStatus.current = closeState.status;
  }, [closeState.message, closeState.status, router, toast]);

  useEffect(() => {
    if (previousDeleteStatus.current !== deleteState.status && deleteState.status === 'success') {
      toast({
        title: 'Event deleted',
        description: deleteState.message,
        variant: 'default',
      });
      router.push('/dashboard');
    }

    previousDeleteStatus.current = deleteState.status;
  }, [deleteState.message, deleteState.status, router, toast]);

  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <form action={closeAction}>
          <input type="hidden" name="eventId" value={eventId} />
          <Button type="submit" variant="outline" disabled={isClosed}>
            {isClosed ? 'Closed' : 'Close Event'}
          </Button>
        </form>
        <div className="mt-3">
          <FormAlert status={closeState.status} message={closeState.message} />
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
            <DialogDescription>
              This removes the event and all of its registrations. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <form action={deleteAction} className="mt-6 space-y-4">
            <input type="hidden" name="eventId" value={eventId} />
            <FormAlert status={deleteState.status} message={deleteState.message} />
            <div className="flex items-center justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive">
                Delete permanently
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
