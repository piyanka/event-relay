import { connectToDatabase } from '@/lib/db';
import { EventModel } from '@/models/Event';
import { RegistrationModel } from '@/models/Registration';
import type { EventSummary } from '@/types/domain';

export type DashboardEvent = EventSummary & {
  registrationCount: number;
  isOpenForRegistration: boolean;
};

export type RegistrationRow = {
  id: string;
  attendeeId: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AttendeeEventRow = {
  registrationId: string;
  eventId: string;
  title: string;
  date: string;
  location: string;
  slug: string;
  createdAt: string;
};

export type HostStats = {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendees: number;
};

function registrationWindowOpen(
  event: {
    isClosed: boolean;
    capacity?: number;
    registrationDeadline?: Date | null;
  },
  registrationCount: number,
): boolean {
  if (event.isClosed) {
    return false;
  }

  if (typeof event.capacity === 'number' && registrationCount >= event.capacity) {
    return false;
  }

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return false;
  }

  return true;
}

export async function getPublicEvents(): Promise<DashboardEvent[]> {
  await connectToDatabase();
  const events = await EventModel.find({}).sort({ createdAt: -1 }).lean();

  const summaries = await Promise.all(
    events.map(async (event) => {
      const registrationCount = await RegistrationModel.countDocuments({ eventId: event._id });
      const isOpenForRegistration = registrationWindowOpen(event, registrationCount);

      return {
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        slug: event.slug,
        hostId: event.hostId.toString(),
        isClosed: event.isClosed,
        capacity: event.capacity,
        registrationDeadline: event.registrationDeadline?.toISOString(),
        attendeeCount: registrationCount,
        createdAt: event.createdAt.toISOString(),
        registrationCount,
        isOpenForRegistration,
      };
    }),
  );

  return summaries.filter((event) => event.isOpenForRegistration);
}

export async function getEventBySlug(slug: string): Promise<DashboardEvent | null> {
  await connectToDatabase();
  const event = await EventModel.findOne({ slug }).lean();
  if (!event) {
    return null;
  }

  const registrationCount = await RegistrationModel.countDocuments({ eventId: event._id });
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    slug: event.slug,
    hostId: event.hostId.toString(),
    isClosed: event.isClosed,
    capacity: event.capacity,
    registrationDeadline: event.registrationDeadline?.toISOString(),
    attendeeCount: registrationCount,
    createdAt: event.createdAt.toISOString(),
    registrationCount,
    isOpenForRegistration: registrationWindowOpen(event, registrationCount),
  };
}

export async function getHostDashboardData(hostId: string): Promise<{
  stats: HostStats;
  events: DashboardEvent[];
}> {
  await connectToDatabase();
  const events = await EventModel.find({ hostId }).sort({ createdAt: -1 }).lean();

  const summaries = await Promise.all(
    events.map(async (event) => {
      const registrationCount = await RegistrationModel.countDocuments({ eventId: event._id });
      return {
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        slug: event.slug,
        hostId: event.hostId.toString(),
        isClosed: event.isClosed,
        capacity: event.capacity,
        registrationDeadline: event.registrationDeadline?.toISOString(),
        attendeeCount: registrationCount,
        createdAt: event.createdAt.toISOString(),
        registrationCount,
        isOpenForRegistration: registrationWindowOpen(event, registrationCount),
      };
    }),
  );

  const eventIds = events.map((event) => event._id);
  const totalRegistrations = eventIds.length
    ? await RegistrationModel.countDocuments({ eventId: { $in: eventIds } })
    : 0;
  const uniqueAttendees = eventIds.length
    ? await RegistrationModel.distinct('attendeeId', { eventId: { $in: eventIds } })
    : [];

  return {
    stats: {
      totalEvents: events.length,
      totalRegistrations,
      totalAttendees: uniqueAttendees.length,
    },
    events: summaries,
  };
}

export async function getEventRegistrations(
  eventId: string,
  search?: string,
): Promise<{
  registrations: RegistrationRow[];
  totalCount: number;
  filteredCount: number;
}> {
  await connectToDatabase();
  const registrations = (await RegistrationModel.find({ eventId })
    .populate('attendeeId', 'name email')
    .sort({ createdAt: -1 })
    .lean()) as Array<{
    _id: { toString(): string };
    attendeeId: { _id: { toString(): string }; name: string; email: string };
    createdAt: Date;
  }>;

  const normalizedSearch = search?.trim().toLowerCase();
  const filtered = normalizedSearch
    ? registrations.filter((registration) => {
        const name = registration.attendeeId.name.toLowerCase();
        const email = registration.attendeeId.email.toLowerCase();
        return name.includes(normalizedSearch) || email.includes(normalizedSearch);
      })
    : registrations;

  return {
    totalCount: registrations.length,
    filteredCount: filtered.length,
    registrations: filtered.map((registration) => ({
      id: registration._id.toString(),
      attendeeId: registration.attendeeId._id.toString(),
      name: registration.attendeeId.name,
      email: registration.attendeeId.email,
      createdAt: registration.createdAt.toISOString(),
    })),
  };
}

export async function getAttendeeDashboardData(attendeeId: string): Promise<{
  registrations: AttendeeEventRow[];
}> {
  await connectToDatabase();
  const registrations = (await RegistrationModel.find({ attendeeId })
    .populate('eventId', 'title date location slug')
    .sort({ createdAt: -1 })
    .lean()) as Array<{
    _id: { toString(): string };
    createdAt: Date;
    eventId: { _id: { toString(): string }; title: string; date: string; location: string; slug: string };
  }>;

  return {
    registrations: registrations.map((registration) => ({
      registrationId: registration._id.toString(),
      eventId: registration.eventId._id.toString(),
      title: registration.eventId.title,
      date: registration.eventId.date,
      location: registration.eventId.location,
      slug: registration.eventId.slug,
      createdAt: registration.createdAt.toISOString(),
    })),
  };
}

export async function getEventForRegistrationPage(slug: string): Promise<DashboardEvent | null> {
  return getEventBySlug(slug);
}
