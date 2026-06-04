import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function PostLoginPage(): Promise<never> {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'HOST') {
    redirect('/dashboard');
  }

  redirect('/my-events');
}
