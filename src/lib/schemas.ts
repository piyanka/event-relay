import { z } from 'zod';

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
}, z.number().int().positive().optional());

const optionalDateTime = z.preprocess((value) => {
  if (value === '' || value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || value instanceof Date) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }

  return value;
}, z.date().optional());

function parseEventDateTime(date: string, time: string): Date | null {
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const hostSignupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(100),
});

export const eventSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(4000),
    date: z.string().trim().min(1),
    time: z.string().trim().min(1),
    location: z.string().trim().min(2).max(200),
    capacity: optionalNumber,
    registrationDeadline: optionalDateTime,
  })
  .superRefine((value, context) => {
    if (!value.registrationDeadline) {
      return;
    }

    const eventDateTime = parseEventDateTime(value.date, value.time);
    if (!eventDateTime) {
      return;
    }

    if (value.registrationDeadline.getTime() > eventDateTime.getTime()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registrationDeadline'],
        message: 'Registration deadline must be on or before the event date and time.',
      });
    }
  });

export const publicRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(100),
  eventId: z.string().trim().min(1),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(100),
});

export const searchParamsSchema = z.object({
  q: z.string().trim().max(200).optional(),
});

export type HostSignupInput = z.infer<typeof hostSignupSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
