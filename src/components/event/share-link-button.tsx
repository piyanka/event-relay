'use client';

import * as React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/providers/toast-provider';

export function ShareLinkButton({ path, label = 'Share' }: { path: string; label?: string }): React.JSX.Element {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleShare(): Promise<void> {
    const shareUrl = new URL(path, window.location.origin).toString();

    if (navigator.share) {
      try {
        setPending(true);
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
        toast({
          title: 'Link ready',
          description: 'Event link shared successfully.',
          variant: 'default',
        });
      } catch {
        // User cancelled sharing, fall back to copy if possible.
      } finally {
        setPending(false);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link copied',
        description: 'Event link copied to clipboard.',
        variant: 'default',
      });
    } catch {
      toast({
        title: 'Could not copy link',
        description: 'Your browser blocked clipboard access.',
        variant: 'error',
      });
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare} disabled={pending}>
      <Share2 className="h-4 w-4" />
      {pending ? 'Sharing...' : label}
    </Button>
  );
}
