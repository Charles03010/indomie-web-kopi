import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {

  await signOut(auth);

  redirect('/api/auth/logout');
}
