# Event Registration & Management System

Production-ready Next.js 15 app for hosts and attendees.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- MongoDB Atlas with Mongoose
- NextAuth.js Credentials provider
- bcryptjs
- json2csv

## Roles

- **Host**: sign up, log in, create events, manage registrations, export CSV
- **Attendee**: register for public events, create an account during registration, log in, view and cancel registrations

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy environment variables

   ```bash
   cp .env.example .env.local
   ```

3. Set values for:

   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. Start the app

   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables above in the Vercel dashboard.
4. Ensure `NEXTAUTH_URL` matches your production domain.
5. Deploy.

## Notes

- Passwords are hashed with bcrypt before storing.
- Passwords are never shown in dashboards or exports.
- All authorization checks are enforced server-side.

## Demo seed for local testing only

You can load sample data into MongoDB for local testing with:

```bash
SEED_DEMO_CONFIRM=YES npm run seed:demo
```

This seed is intentionally idempotent and meant for test data only. It creates a demo host, demo attendees, sample events, and sample registrations.
