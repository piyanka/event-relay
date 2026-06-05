import { redirect } from 'next/navigation';
import { safeAuth } from '@/lib/safe-auth';

export const dynamic = 'force-dynamic';

export default async function PostLoginPage(): Promise<never> {
  const session = await safeAuth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'HOST') {
    redirect('/dashboard');
  }

  redirect('/my-events');
}
