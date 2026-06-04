import type * as React from 'react';
export function Spinner(): React.JSX.Element {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" className="fill-none stroke-current opacity-20" strokeWidth="4" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        className="fill-none stroke-current"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
