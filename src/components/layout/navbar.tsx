import type * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/user-menu';
import { safeAuth } from '@/lib/safe-auth';

export async function Navbar(): Promise<React.JSX.Element> {
  const session = await safeAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/20">
            ER
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">Event Relay</p>
          
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline">
            <Link href="/events">See events</Link>
          </Button>
          {session?.user ? (
            <>
              {session.user.role === 'HOST' ? (
                <Button asChild variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/my-events">My events</Link>
                </Button>
              )}
              <UserMenu userName={session.user.name ?? 'Account'} />
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Host signup</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/events">See events</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={session.user.role === 'HOST' ? '/dashboard' : '/my-events'}>
                  {session.user.role === 'HOST' ? 'Dashboard' : 'My events'}
                </Link>
              </Button>
              <UserMenu userName={session.user.name ?? 'Account'} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/events">See events</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
