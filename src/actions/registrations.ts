'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { flattenZodErrors, isDuplicateKeyError } from '@/lib/errors';
import { getSessionUser, isValidObjectId } from '@/lib/guards';
import { hashPassword, verifyPassword } from '@/lib/password';
import { publicRegistrationSchema } from '@/lib/schemas';
import { EventModel } from '@/models/Event';
import { RegistrationModel } from '@/models/Registration';
import { UserModel } from '@/models/User';
import type { FormState } from '@/types/forms';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

function isRegistrationOpen(event: {
  isClosed: boolean;
  capacity?: number;
  registrationDeadline?: Date;
  _id: unknown;
}): { open: boolean; message?: string } {
  if (event.isClosed) {
    return { open: false, message: 'Registration Closed' };
  }

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return { open: false, message: 'Registration deadline has passed.' };
  }

  return { open: true };
}

export async function registerForEventAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawPayload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    eventId: formData.get('eventId'),
  };

  const parsed = publicRegistrationSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fill in the form correctly.',
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  await connectToDatabase();
  if (!isValidObjectId(parsed.data.eventId)) {
    return { status: 'error', message: 'Event not found.' };
  }

  const event = await EventModel.findById(parsed.data.eventId);
  if (!event) {
    return { status: 'error', message: 'Event not found.' };
  }

  const registrationStatus = isRegistrationOpen(event);
  if (!registrationStatus.open) {
    return {
      status: 'error',
      message: registrationStatus.message ?? 'Registration is closed.',
    };
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  let attendee = await UserModel.findOne({ email: normalizedEmail }).select('+password');

  if (attendee) {
    if (attendee.role !== 'ATTENDEE') {
      return {
        status: 'error',
        message: 'This email belongs to a host account. Use an attendee email instead.',
      };
    }

    const passwordMatches = await verifyPassword(parsed.data.password, attendee.password);
    if (!passwordMatches) {
      return {
        status: 'error',
        message: 'Invalid credentials for this attendee account.',
      };
    }

    const alreadyRegistered = await RegistrationModel.findOne({
      eventId: event._id,
      attendeeId: attendee._id,
    });

    if (alreadyRegistered) {
      return {
        status: 'error',
        message: 'You are already registered for this event.',
      };
    }

    const attendeeCount = await RegistrationModel.countDocuments({ eventId: event._id });
    if (typeof event.capacity === 'number' && attendeeCount >= event.capacity) {
      return {
        status: 'error',
        message: 'Registration Closed. This event is at capacity.',
      };
    }
  } else {
    const attendeeCount = await RegistrationModel.countDocuments({ eventId: event._id });
    if (typeof event.capacity === 'number' && attendeeCount >= event.capacity) {
      return {
        status: 'error',
        message: 'Registration Closed. This event is at capacity.',
      };
    }

    attendee = await UserModel.create({
      name: parsed.data.name,
      email: normalizedEmail,
      password: await hashPassword(parsed.data.password),
      role: 'ATTENDEE',
    });
  }

  try {
    await RegistrationModel.create({
      eventId: event._id,
      attendeeId: attendee._id,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        status: 'error',
        message: 'You are already registered for this event.',
      };
    }

    throw error;
  }

  revalidatePath('/');
  revalidatePath(`/events/${event.slug}`);
  revalidatePath('/my-events');

  return {
    status: 'success',
    message: 'Registration confirmed.',
  };
}

export async function cancelRegistrationAction(registrationId: string): Promise<FormState> {
  try {
    const attendee = await getSessionUser('ATTENDEE');
    await connectToDatabase();

    if (!isValidObjectId(registrationId)) {
      return { status: 'error', message: 'Registration not found.' };
    }

    const registration = await RegistrationModel.findById(registrationId);
    if (!registration) {
      return { status: 'error', message: 'Registration not found.' };
    }

    if (registration.attendeeId.toString() !== attendee.id) {
      return {
        status: 'error',
        message: 'You can only cancel your own registrations.',
      };
    }

    const event = await EventModel.findById(registration.eventId);
    await RegistrationModel.deleteOne({ _id: registration._id });

    if (event) {
      revalidatePath(`/events/${event.slug}`);
    }

    revalidatePath('/my-events');

    return {
      status: 'success',
      message: 'Registration cancelled.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}

export async function cancelRegistrationFormAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const registrationId = String(formData.get('registrationId') ?? '');
  return cancelRegistrationAction(registrationId);
}
