import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = cookies();

  (await
    cookieStore).set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  if (!(await cookieStore).get('session')?.value) {
    return NextResponse.redirect(new URL('/login', 'http://localhost:3000'));
  }

  return NextResponse.json({ message: 'Logged out' });
}
