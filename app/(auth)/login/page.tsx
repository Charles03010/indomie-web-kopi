'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { OctagonAlert } from 'lucide-react';

const inputData = [
  {
    label: 'Email',
    type: 'email',
    name: 'email',
    placeholder: 'Masukkan email Anda',
  },
  {
    label: 'Password',
    type: 'password',
    name: 'password',
    placeholder: 'Masukkan password Anda',
  },
];

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setError(null);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const token = await cred.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create session");
      }

      router.push('/dashboard/overview');
    } catch (err: any) {
      console.error('Error signing in:', err.code, err.message);

      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };
  return (
    <>
      <div className="flex justify-center items-center w-dvw h-dvh">
        <div className="w-1/4">
          <div className="flex items-start justify-center">
            <h1 className="text-(--head-text) mt-8 font-extrabold text-6xl">
              Login
            </h1>
            <Image
              src="/images/logo.png"
              alt="Logo Image"
              width={200}
              height={200}
              loading="eager"
            />
          </div>
          <form onSubmit={handleSignIn} className="space-y-5 mt-10">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <OctagonAlert className="inline-block mr-2" />
                {error}
              </div>
            )}
            {inputData.map((input, index) => (
              <Input
                key={index}
                label={input.label}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={formData[input.name as keyof typeof formData]}
                onChange={handleChange}
              />
            ))}
            <div className="w-1/3 mx-auto my-10">
              <Button type="submit" name="Login" />
            </div>
            <h3 className="text-center text-(--head-text) ">
              Belum punya akun ?{' '}
              <Link href="/register" className="font-bold">
                Daftar disini
              </Link>
            </h3>
          </form>
        </div>
      </div>
    </>
  );
}
