import type * as React from 'react';
import Link from 'next/link';

const footerLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Host signup', href: '/signup' },
  { label: 'Log in', href: '/login' },
];

export function Footer(): React.JSX.Element {
  return (
    <footer className="relative border-t border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-slate-950">Event Relay</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Modern event registration and management for hosts and attendees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pb-6 text-xs text-slate-400 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Event Relay</p>
        <p>Built for smooth event discovery and registration</p>
      </div>
    </footer>
  );
}
