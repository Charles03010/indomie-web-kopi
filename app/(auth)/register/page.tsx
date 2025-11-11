'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const inputData = [
  {
    label: 'Username',
    type: 'text',
    name: 'username',
    placeholder: 'Masukkan username Anda',
  },
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
  {
    label: 'Confirm Password',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'Konfirmasi password Anda',
  },
  {
    label: 'Profile Picture',
    type: 'file',
    name: 'profilePicture',
    placeholder: 'Unggah foto profil Anda',
  },
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex justify-center py-10 items-center max-w-dvw min-h-dvh">
        <div className="w-1/4">
          <div className="flex items-start justify-center">
            <h1 className="text-(--head-text) mt-8 font-extrabold text-6xl">
              Daftar
            </h1>
            <Image
              src="/images/logo.png"
              alt="Logo Image"
              width={200}
              height={200}
              loading="eager"
            />
          </div>
          <form action="" className="space-y-5 mt-10">
            {inputData.map((input, index) => (
              <Input
                key={index}
                label={input.label}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            ))}
            <div className="relative flex items-center justify-start cursor-pointer">
              <input type="radio" name="agree" id="agree" />
              <span className="checkmark cursor-pointer mr-3"></span>
              <label
                htmlFor="agree"
                className="w-full cursor-pointer text-(--head-text) font-light text-sm)"
              >
                I have read and agree to the{' '}
                <Link className="underline" href="/terms">
                  Terms of Service
                </Link>{' '}
                &{' '}
                <Link className="underline" href="/privacy">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <div className="w-1/3 mx-auto my-10">
              <Button type="submit" name="Daftar" />
            </div>
            <h3 className="text-center text-(--head-text) ">
              Sudah punya akun ?{' '}
              <Link href="/login" className="font-bold">
                Login disini
              </Link>
            </h3>
          </form>
        </div>
      </div>
    </>
  );
}
