'use client';

import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        // This clears the Firebase user from browser storage.
        router.push('/api/auth/logout'); // Continue to the server-side logout.
      } catch (error) {
        console.error('Error signing out: ', error);
        router.push('/'); // Redirect home on error.
      }
    };
    performLogout();
  }, [router]);

  return <div>Logging out...</div>;
}
