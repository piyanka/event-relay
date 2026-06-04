import type * as React from 'react';

export function HeroVisual(): React.JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-slate-950 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.6)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.16),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(148,163,184,0.12),transparent_26%),linear-gradient(180deg,#0f172a_0%,#111827_50%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_40%,transparent_68%)]" />

      <div className="relative flex min-h-[460px] flex-col justify-between p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            Featured event
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            Open now
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Next up</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">Design meetup 2026</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                A clean public event preview with clear registration and shareable details.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Seats</p>
              <p className="mt-1 text-lg font-semibold">128</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Date</p>
              <p className="mt-1 text-sm font-medium">12 Jun</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Time</p>
              <p className="mt-1 text-sm font-medium">6:30 PM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/30 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Venue</p>
              <p className="mt-1 text-sm font-medium">Virtual / Delhi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-4 text-white/90 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Public</p>
            <p className="mt-2 text-2xl font-semibold text-white">All active events</p>
            <p className="mt-2 text-sm text-white/65">Browse without logging in.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/8 p-4 text-white/90 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Host</p>
            <p className="mt-2 text-2xl font-semibold text-white">Own dashboard</p>
            <p className="mt-2 text-sm text-white/65">Manage registrations and exports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
