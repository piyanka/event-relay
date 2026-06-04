'use client';

import type * as React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function UserMenu({ userName }: { userName: string }): React.JSX.Element {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signOut({ callbackUrl: '/' });
      }}
    >
      <LogOut className="h-4 w-4" />
      <span className="max-w-[120px] truncate">{userName}</span>
    </Button>
  );
}
