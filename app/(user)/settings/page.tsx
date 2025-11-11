'use client';
import { Button } from '@/app/components/button';
import { Input, InputProfile } from '@/app/components/input';
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
    label: 'Phone Number',
    type: 'text',
    name: 'phoneNumber',
    placeholder: 'Masukkan nomor telepon Anda',
  },
];

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="flex justify-center py-10 items-center max-w-dvw min-h-dvh">
        <div className="w-1/4">
          <div className="flex items-start justify-center">
            <h1 className="text-(--head-text) mt-8 font-extrabold text-5xl">
              Account Settings
            </h1>
          </div>
          <form action="" className="space-y-5 mt-10">
            <label
              className="font-extrabold text-(--head-text) block text-center mb-1"
              htmlFor="profile"
            >
              Profile Picture
            </label>
            <InputProfile name="profile" url="https://placehold.co/100x100/png" />
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
            <div className="w-1/3 mx-auto my-10">
              <Button type="submit" name="Ubah" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
