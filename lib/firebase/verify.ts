import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch (error) {
    console.error('[VERIFY_SESSION_ERROR]', error);
    return null;
  }
}
