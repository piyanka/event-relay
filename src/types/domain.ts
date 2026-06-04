export type UserRole = 'HOST' | 'ATTENDEE';

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type EventSummary = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  slug: string;
  hostId: string;
  isClosed: boolean;
  capacity?: number;
  registrationDeadline?: string;
  attendeeCount: number;
  createdAt: string;
};
