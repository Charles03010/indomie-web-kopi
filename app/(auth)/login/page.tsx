import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import Image from 'next/image';
import Link from 'next/link';

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
          <form action="" className="space-y-5 mt-10">
            {inputData.map((input, index) => (
              <Input
                key={index}
                label={input.label}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
              />
            ))}
            <div className="w-1/3 mx-auto my-10">
              <Button type="submit" name="Login" />
            </div>
            <h3 className='text-center text-(--head-text) '>
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
