# Event Registration & Management System

An event platform for hosts and attendees. Hosts can create and manage events, while attendees can browse public events, register, and manage their own registrations.

## Implementation Summary

- Built with Next.js 15 App Router, React 19, and TypeScript.
- Uses MongoDB Atlas with Mongoose for event, user, and registration data.
- Uses NextAuth credentials login for secure host and attendee authentication.
- Protects dashboard and attendee pages with server-side role checks.
- Supports event creation, public event browsing, registration, cancellation, and CSV export.

## Approach

- Keep the public side simple so visitors can quickly discover active events.
- Keep the host side separate so only authenticated hosts can manage their own events.
- Store sensitive data safely by hashing passwords with bcrypt before saving.
- Enforce authorization on the server instead of relying only on the UI.
- Use reusable UI components and server-rendered pages for a clean, fast experience.

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

- **Host**: sign up, log in, create events, manage registrations, export CSV.
- **Attendee**: register for public events, create an account during registration, log in, view and cancel registrations.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Set these values in `.env.local`:

   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. Start the app:

   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push the latest code to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `AUTH_URL`
   - `AUTH_SECRET`
4. Set `NEXTAUTH_URL` to the production URL after Vercel creates it, for example:

   ```bash
   https://your-project.vercel.app
   ```
5. AUTH_URL and NEXTAUTH_URL should point to the same application URL.
   Example:
   AUTH_URL=https://event-relay-five.vercel.app
   NEXTAUTH_URL=https://event-relay-five.vercel.app

6. AUTH_SECRET and NEXTAUTH_SECRET should contain the same secret value if both are defined.
   Example:
   AUTH_SECRET=your-long-random-secret
   NEXTAUTH_SECRET=your-long-random-secret 
7. Redeploy after saving the environment variables.

## Notes

- Passwords are hashed with bcrypt before storing.
- Passwords are never shown in dashboards or exports.
- All authorization checks are enforced server-side.
- The app is designed to build cleanly on Vercel without external font downloads.

## Demo Seed

You can load sample data into MongoDB for local testing with:

```bash
SEED_DEMO_CONFIRM=YES npm run seed:demo
```

This seed is idempotent and intended only for test data. It creates a demo host, demo attendees, sample events, and sample registrations.
