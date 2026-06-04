import type * as React from 'react';

export function HeroPreview(): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white/90 shadow-[0_28px_80px_-55px_rgba(15,23,42,0.45)] backdrop-blur">
      <svg viewBox="0 0 720 840" className="block h-full w-full" role="img" aria-label="Modern event management illustration">
        <defs>
          <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="45%" stopColor="#eef2ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="heroPanel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="roseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="skyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.65" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect width="720" height="840" fill="url(#heroBg)" />

        <circle cx="588" cy="130" r="128" fill="#bfdbfe" fillOpacity="0.36" />
        <circle cx="122" cy="720" r="174" fill="#e2e8f0" fillOpacity="0.56" />
        <path
          d="M76 178C188 108 340 116 454 176C558 231 640 330 665 445C681 521 660 613 603 676C545 740 460 770 368 770C245 770 134 724 86 626C38 529 36 402 76 178Z"
          fill="#ffffff"
          fillOpacity="0.48"
        />

        <g filter="url(#softShadow)">
          <rect x="72" y="74" width="576" height="652" rx="36" fill="url(#heroPanel)" />
        </g>

        <g>
          <rect x="112" y="112" width="160" height="132" rx="28" fill="#0f172a" fillOpacity="0.8" />
          <rect x="132" y="132" width="120" height="22" rx="11" fill="#e2e8f0" fillOpacity="0.28" />
          <rect x="132" y="168" width="86" height="16" rx="8" fill="#cbd5e1" fillOpacity="0.75" />
          <rect x="132" y="194" width="104" height="16" rx="8" fill="#cbd5e1" fillOpacity="0.55" />
          <circle cx="228" cy="188" r="24" fill="#38bdf8" />
          <path d="M218 182h20v4h-20zM218 189h20v4h-20z" fill="#fff" />
          <path d="M231 179l10 9-10 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g filter="url(#softShadow)">
          <rect x="312" y="106" width="272" height="170" rx="28" fill="#ffffff" fillOpacity="0.5"/>
          <rect x="338" y="132" width="142" height="18" rx="9" fill="#0f172a" fillOpacity="0.82" />
          <rect x="338" y="164" width="198" height="14" rx="7" fill="#94a3b8" fillOpacity="0.6" />
          <rect x="338" y="186" width="154" height="14" rx="7" fill="#94a3b8" fillOpacity="0.45" />
          <rect x="338" y="222" width="86" height="30" rx="15" fill="#e2e8f0" />
          <rect x="432" y="222" width="108" height="30" rx="15" fill="#0f172a"  fillOpacity="0.82"/>
          <circle cx="548" cy="150" r="18" fill="url(#skyGlow)" />
          <path d="M540 150h16M548 142v16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g>
          <rect x="112" y="282" width="492" height="132" rx="28" fill="#f8fafc" />
          <rect x="132" y="304" width="150" height="16" rx="8" fill="#0f172a" fillOpacity="0.82" />
          <rect x="132" y="332" width="222" height="14" rx="7" fill="#94a3b8" fillOpacity="0.52" />
          <rect x="132" y="354" width="184" height="14" rx="7" fill="#94a3b8" fillOpacity="0.4" />

          <g transform="translate(420 304)">
            <path
              d="M24 0C11 0 0 10.6 0 23.7C0 42.3 24 72 24 72C24 72 48 42.3 48 23.7C48 10.6 37 0 24 0Z"
              fill="url(#roseGlow)"
            />
            <circle cx="24" cy="24" r="9" fill="#fff" fillOpacity="0.94" />
          </g>

          <g transform="translate(508 298)">
            <circle cx="18" cy="18" r="18" fill="#e2e8f0" />
            <circle cx="18" cy="18" r="11" fill="#94a3b8" />
          </g>
          <g transform="translate(550 308)">
            <circle cx="14" cy="14" r="14" fill="#cbd5e1" />
            <circle cx="14" cy="14" r="8" fill="#64748b" />
          </g>
        </g>

        <g filter="url(#softShadow)">
          <rect x="132" y="444" width="456" height="164" rx="30" fill="#ffffff" />
          <rect x="156" y="470" width="120" height="18" rx="9" fill="#0f172a" fillOpacity="0.86" />
          <rect x="156" y="498" width="184" height="13" rx="6.5" fill="#94a3b8" fillOpacity="0.52" />

          <rect x="156" y="532" width="110" height="78" rx="22" fill="#f8fafc" />
          <path d="M216 550c-12 0-22 9.6-22 21.5C194 588 216 606 216 606s22-18 22-34.5c0-11.9-10-21.5-22-21.5Z" fill="#38bdf8" fillOpacity="0.9" />
          <circle cx="216" cy="572" r="8" fill="#fff" />

          <rect x="280" y="532" width="110" height="78" rx="22" fill="#f8fafc" />
          <path d="M340 550c-12 0-22 9.6-22 21.5C318 588 340 606 340 606s22-18 22-34.5c0-11.9-10-21.5-22-21.5Z" fill="#fb7185" fillOpacity="0.9" />
          <circle cx="340" cy="572" r="8" fill="#fff" />

          <rect x="404" y="532" width="110" height="78" rx="22" fill="#f8fafc" />
          <path d="M464 550c-12 0-22 9.6-22 21.5C442 588 464 606 464 606s22-18 22-34.5c0-11.9-10-21.5-22-21.5Z" fill="#0f172a" fillOpacity="0.8" />
          <circle cx="464" cy="572" r="8" fill="#fff" />
        </g>

        <g filter="url(#softShadow)">
          <rect x="130" y="638" width="460" height="78" rx="24" fill="#0f172a" fillOpacity="0.82"/>
          <rect x="154" y="656" width="112" height="14" rx="7" fill="#e2e8f0" fillOpacity="0.88" />
          <rect x="154" y="679" width="202" height="11" rx="5.5" fill="#cbd5e1" fillOpacity="0.55" />
          <circle cx="530" cy="677" r="24" fill="url(#skyGlow)" />
          <path d="M520 677h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M530 667v20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g opacity="0.92">
          <rect x="592" y="290" width="76" height="140" rx="28" fill="#ffffff" />
          <rect x="610" y="312" width="40" height="10" rx="5" fill="#cbd5e1" />
          <rect x="610" y="330" width="32" height="10" rx="5" fill="#cbd5e1" fillOpacity="0.75" />
          <circle cx="630" cy="376" r="22" fill="#f8fafc" />
          <path d="M630 360c-7 0-13 5.8-13 13 0 10 13 28 13 28s13-18 13-28c0-7.2-6-13-13-13Z" fill="#fb7185" />
        </g>

        <g opacity="0.92">
          <rect x="46" y="334" width="58" height="110" rx="24" fill="#ffffff" />
          <rect x="60" y="354" width="30" height="10" rx="5" fill="#cbd5e1" />
          <rect x="60" y="372" width="18" height="10" rx="5" fill="#cbd5e1" fillOpacity="0.78" />
          <circle cx="75" cy="414" r="14" fill="#e2e8f0" />
          <circle cx="75" cy="409" r="6" fill="#94a3b8" />
        </g>
      </svg>
    </div>
  );
}
