import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import { EventModel } from '@/models/Event';
import { UserModel } from '@/models/User';
import type { SessionUser, UserRole } from '@/types/domain';
import mongoose from 'mongoose';

export class AuthorizationError extends Error {
  constructor(message = 'You are not allowed to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function isValidObjectId(value: string): boolean {
  return mongoose.Types.ObjectId.isValid(value);
}

export async function getSessionUser(requiredRole?: UserRole): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthorizationError('Please log in to continue.');
  }

  if (requiredRole && session.user.role !== requiredRole) {
    throw new AuthorizationError('You do not have permission to access this resource.');
  }

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role: session.user.role,
    name: session.user.name ?? '',
  };
}

export async function getHostEventOrThrow(eventId: string, hostId: string) {
  if (!isValidObjectId(eventId)) {
    throw new Error('Event not found.');
  }

  await connectToDatabase();
  const event = await EventModel.findById(eventId);

  if (!event) {
    throw new Error('Event not found.');
  }

  if (event.hostId.toString() !== hostId) {
    throw new AuthorizationError('You can only manage your own events.');
  }

  return event;
}

export async function getUserByEmail(email: string) {
  await connectToDatabase();
  return UserModel.findOne({ email }).select('+password');
}
