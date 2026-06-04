import type { FieldErrors } from '@/lib/errors';

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors?: FieldErrors;
};

export const initialFormState: FormState = {
  status: 'idle',
  message: '',
};
