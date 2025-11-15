'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import Image from 'next/image';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/lib/firebase/client';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { OctagonAlert } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    let uploadedPublicId: string | null = null;
    let createdUser: User | null = null;

    try {
      const formData = new FormData(e.currentTarget);

      const username = (formData.get('username') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const password = (formData.get('password') || '').toString();
      const confirmPassword = (
        formData.get('confirmPassword') || ''
      ).toString();
      const agree = formData.get('agree');
      const profilePicture = formData.get('profilePicture') as File | null;

      // Validasi dasar
      if (!username || !email || !password || !confirmPassword) {
        setErrorMsg('Semua field wajib diisi.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Password dan konfirmasi password tidak sama.');
        setLoading(false);
        return;
      }

      if (!agree) {
        setErrorMsg(
          'Anda harus menyetujui Terms of Service dan Privacy Policy.'
        );
        setLoading(false);
        return;
      }

      // 1. Upload ke Cloudinary (jika ada file)
      let photoURL: string | null = null;

      if (profilePicture && profilePicture.size > 0) {
        const uploadForm = new FormData();
        uploadForm.set('file', profilePicture);
        uploadForm.set('folder', 'umkmin/profile_pictures');

        const uploadRes = await fetch('/api/upload-photo', {
          method: 'POST',
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          throw new Error('Gagal upload foto ke Cloudinary');
        }

        const uploadData = await uploadRes.json();
        photoURL = uploadData.url as string;
        uploadedPublicId = uploadData.public_id as string;
      }

      // 2. Buat user Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      createdUser = user;
      // 3. Update profile Firebase Auth
      if (user) {
        await updateProfile(user, {
          displayName: username,
          photoURL: photoURL || undefined,
        });

        // 4. Simpan ke Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          username,
          email,
          photoURL: photoURL || null,
          createdAt: serverTimestamp(),
        });
      }

      // 5. Redirect ke login
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      try {
        // a. rollback user Firebase jika sudah terbuat tapi ada error setelahnya
        if (createdUser) {
          await deleteUser(createdUser);
        }

        // b. rollback gambar di Cloudinary jika sudah terupload
        if (uploadedPublicId) {
          await fetch('/api/delete-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicId: uploadedPublicId }),
          });
        }
      } catch (rollbackErr) {
        console.error('[Register] Rollback error:', rollbackErr);
      }
      let msg = 'Terjadi kesalahan saat registrasi.';

      if (error?.code === 'auth/email-already-in-use') {
        msg = 'Email sudah digunakan.';
      } else if (error?.code === 'auth/weak-password') {
        msg = 'Password terlalu lemah (minimal 6 karakter).';
      }

      if (error?.message?.includes('Cloudinary')) {
        msg = 'Gagal upload foto. Coba lagi atau gunakan foto lain.';
      }

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };
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
          <form onSubmit={handleSubmit} className="space-y-5 mt-10">
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <OctagonAlert className="inline-block mr-2" />
                {errorMsg}
              </div>
            )}
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
