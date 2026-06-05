import { auth } from '@/auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    console.error('Auth lookup failed.', error);
    return null;
  }
}
