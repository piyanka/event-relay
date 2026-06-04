import type { Metadata } from 'next';
import type * as React from 'react';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { ToastProvider } from '@/components/providers/toast-provider';
import './globals.css';

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Event Relay',
  description: 'Host and attendee event registration platform inspired by Luma.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <ToastProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.75),_transparent_24%),radial-gradient(circle_at_80%_20%,_rgba(191,219,254,0.5),_transparent_20%)]" />
            <Navbar />
            <div className="relative">{children}</div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
