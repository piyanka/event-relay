'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { flattenZodErrors, isDuplicateKeyError } from '@/lib/errors';
import { getHostEventOrThrow, getSessionUser, isValidObjectId } from '@/lib/guards';
import { slugify } from '@/lib/slug';
import { eventSchema } from '@/lib/schemas';
import { EventModel } from '@/models/Event';
import { RegistrationModel } from '@/models/Registration';
import type { FormState } from '@/types/forms';

async function buildUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  let candidate = baseSlug;
  let suffix = 2;

  // Keep slugs human-friendly while avoiding collisions.
  while (await EventModel.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createEventAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawPayload = {
    title: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    time: formData.get('time'),
    location: formData.get('location'),
    capacity: formData.get('capacity'),
    registrationDeadline: formData.get('registrationDeadline'),
  };

  const parsed = eventSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please correct the highlighted fields.',
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const host = await getSessionUser('HOST');
  await connectToDatabase();
  const slug = await buildUniqueSlug(parsed.data.title);

  try {
    await EventModel.create({
      title: parsed.data.title,
      description: parsed.data.description,
      date: parsed.data.date,
      time: parsed.data.time,
      location: parsed.data.location,
      slug,
      hostId: host.id,
      isClosed: false,
      capacity: parsed.data.capacity,
      registrationDeadline: parsed.data.registrationDeadline,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        status: 'error',
        message: 'That event title already exists. Please try a slightly different title.',
      };
    }

    throw error;
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  return {
    status: 'success',
    message: 'Event created successfully.',
  };
}

export async function closeEventAction(eventId: string): Promise<FormState> {
  try {
    const host = await getSessionUser('HOST');
    if (!isValidObjectId(eventId)) {
      return { status: 'error', message: 'Event not found.' };
    }
    await connectToDatabase();
    const event = await getHostEventOrThrow(eventId, host.id);

    if (event.isClosed) {
      return { status: 'success', message: 'Event is already closed.' };
    }

    event.isClosed = true;
    await event.save();

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/events/${eventId}`);
    revalidatePath(`/events/${event.slug}`);

    return {
      status: 'success',
      message: 'Registration closed.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}

export async function closeEventFormAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const eventId = String(formData.get('eventId') ?? '');
  return closeEventAction(eventId);
}

export async function deleteEventAction(eventId: string): Promise<FormState> {
  try {
    const host = await getSessionUser('HOST');
    if (!isValidObjectId(eventId)) {
      return { status: 'error', message: 'Event not found.' };
    }
    await connectToDatabase();
    const event = await getHostEventOrThrow(eventId, host.id);

    await RegistrationModel.deleteMany({ eventId: event._id });
    await EventModel.deleteOne({ _id: event._id });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/events/${eventId}`);
    revalidatePath(`/events/${event.slug}`);
    revalidatePath('/my-events');

    return {
      status: 'success',
      message: 'Event deleted successfully.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}

export async function deleteEventFormAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const eventId = String(formData.get('eventId') ?? '');
  return deleteEventAction(eventId);
}
