import { auth } from '@/auth';

export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Dynamic server usage') ||
        (error as Error & { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE')
    ) {
      return null;
    }

    console.error('Auth lookup failed.', error);
    return null;
  }
}
