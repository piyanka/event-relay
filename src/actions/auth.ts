'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { flattenZodErrors, isDuplicateKeyError } from '@/lib/errors';
import { hostSignupSchema } from '@/lib/schemas';
import { UserModel } from '@/models/User';
import type { FormState } from '@/types/forms';

const emailKey = (email: string): string => email.trim().toLowerCase();

export async function hostSignupAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawPayload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = hostSignupSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the form for errors.',
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  await connectToDatabase();
  const normalizedEmail = emailKey(parsed.data.email);
  const existing = await UserModel.findOne({ email: normalizedEmail });

  if (existing) {
    return {
      status: 'error',
      message: 'An account with this email already exists.',
    };
  }

  const hashedPassword = await hashPassword(parsed.data.password);

  try {
    await UserModel.create({
      name: parsed.data.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'HOST',
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        status: 'error',
        message: 'An account with this email already exists.',
      };
    }

    throw error;
  }

  revalidatePath('/');
  revalidatePath('/login');

  return {
    status: 'success',
    message: 'Host account created. You can log in now.',
  };
}
