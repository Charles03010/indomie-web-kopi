import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { message: 'ID token is required' },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const expiresIn = 1000 * 60 * 60 * 24 * 1;

    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    const res = NextResponse.json({ message: 'Logged in', uid: decoded.uid });

    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn / 1000,
      sameSite: 'lax',
    });

    return res;
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
