'use client';

import * as React from 'react';
import type * as ReactTypes from 'react';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cancelRegistrationFormAction } from '@/actions/registrations';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/forms/form-alert';
import { useToast } from '@/components/providers/toast-provider';
import { initialFormState, type FormState } from '@/types/forms';

export function CancelRegistrationButton({ registrationId }: { registrationId: string }): ReactTypes.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action] = useActionState<FormState, FormData>(cancelRegistrationFormAction, initialFormState);
  const previousStatus = React.useRef(state.status);

  useEffect(() => {
    if (previousStatus.current !== state.status && state.status === 'success') {
      toast({
        title: 'Registration cancelled',
        description: state.message,
        variant: 'default',
      });
      router.refresh();
    }

    previousStatus.current = state.status;
  }, [router, state.message, state.status, toast]);

  return (
    <form action={action}>
      <input type="hidden" name="registrationId" value={registrationId} />
      <Button type="submit" variant="outline" size="sm">
        Cancel
      </Button>
      <div className="mt-3">
        <FormAlert status={state.status} message={state.message} />
      </div>
    </form>
  );
}
