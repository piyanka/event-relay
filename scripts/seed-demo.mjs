import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const CONFIRM = process.env.SEED_DEMO_CONFIRM;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required.');
  process.exit(1);
}

if (CONFIRM !== 'YES') {
  console.error('Refusing to seed demo data. Set SEED_DEMO_CONFIRM=YES to continue.');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['HOST', 'ATTENDEE'] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isClosed: { type: Boolean, default: false },
    capacity: { type: Number },
    registrationDeadline: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

registrationSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });

const UserModel = mongoose.models.User ?? mongoose.model('User', userSchema);
const EventModel = mongoose.models.Event ?? mongoose.model('Event', eventSchema);
const RegistrationModel = mongoose.models.Registration ?? mongoose.model('Registration', registrationSchema);

const seedPassword = async (password) => bcrypt.hash(password, 12);

const demo = {
  host: {
    name: 'Demo Host',
    email: 'host.demo@example.com',
    password: 'DemoPass123!',
    role: 'HOST',
  },
  attendees: [
    { name: 'John Appleseed', email: 'john.demo@example.com', password: 'DemoPass123!' },
    { name: 'Sarah Chen', email: 'sarah.demo@example.com', password: 'DemoPass123!' },
    { name: 'Maya Patel', email: 'maya.demo@example.com', password: 'DemoPass123!' },
  ],
  events: [
    {
      title: 'Byamn Dev Meetup 2026',
      description: 'A small, energetic meetup for builders who like shipping useful things and meeting fellow engineers.',
      date: '2026-07-18',
      time: '18:30',
      location: 'Bengaluru, India',
      slug: 'byamn-dev-meetup-2026',
      isClosed: false,
      capacity: 100,
    },
    {
      title: 'Product Design Night',
      description: 'A talk-and-network evening about event UX, product storytelling, and shipping polished interfaces.',
      date: '2026-08-05',
      time: '19:00',
      location: 'Remote',
      slug: 'product-design-night',
      isClosed: false,
      capacity: 2,
    },
    {
      title: 'Closed Community Retro',
      description: 'An example event that is already closed so you can test the closed-state UI.',
      date: '2026-06-20',
      time: '17:00',
      location: 'Mumbai, India',
      slug: 'closed-community-retro',
      isClosed: true,
      capacity: 30,
    },
  ],
};

async function upsertUser(user) {
  const password = await seedPassword(user.password);
  return UserModel.findOneAndUpdate(
    { email: user.email.toLowerCase() },
    {
      $set: {
        name: user.name,
        email: user.email.toLowerCase(),
        password,
        role: user.role,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
}

async function upsertEvent(hostId, event) {
  return EventModel.findOneAndUpdate(
    { slug: event.slug },
    {
      $set: {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        slug: event.slug,
        hostId,
        isClosed: event.isClosed,
        capacity: event.capacity,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
}

async function upsertRegistration(eventId, attendeeId) {
  return RegistrationModel.findOneAndUpdate(
    { eventId, attendeeId },
    {
      $setOnInsert: {
        eventId,
        attendeeId,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  const host = await upsertUser({ ...demo.host });
  const attendeeUsers = [];
  for (const attendee of demo.attendees) {
    attendeeUsers.push(await upsertUser({ ...attendee, role: 'ATTENDEE' }));
  }

  const events = [];
  for (const event of demo.events) {
    events.push(await upsertEvent(host._id, event));
  }

  await upsertRegistration(events[0]._id, attendeeUsers[0]._id);
  await upsertRegistration(events[0]._id, attendeeUsers[1]._id);
  await upsertRegistration(events[1]._id, attendeeUsers[0]._id);
  await upsertRegistration(events[1]._id, attendeeUsers[2]._id);

  await mongoose.disconnect();

  console.log('Demo seed complete.');
  console.log('Host login: host.demo@example.com / DemoPass123!');
  console.log('Attendee login: john.demo@example.com / DemoPass123!');
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
