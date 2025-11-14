'use client';
import { Button } from '@/app/components/button';
import { Input, InputProfile } from '@/app/components/input';
import { BadgeCheck, ChevronLeft, OctagonAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { auth, db } from '@/lib/firebase/client';
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  profilePicture: File | null;
  photoURL: string;
  photoPublicId: string | null;
};
const DEFAULT_AVATAR = 'https://placehold.co/100x100/png';

export default function Settings() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    profilePicture: null,
    photoURL: DEFAULT_AVATAR,
    photoPublicId: null,
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as any;

          setForm((prev) => ({
            ...prev,
            username: data.username ?? user.displayName ?? '',
            email: data.email ?? user.email ?? '',
            phoneNumber: data.phoneNumber ?? '',
            photoURL: data.photoURL ?? user.photoURL ?? DEFAULT_AVATAR,
            photoPublicId: data.photoPublicId ?? null,
          }));
        } else {
          // kalau belum ada dokumen di Firestore, pakai data dari Auth
          setForm((prev) => ({
            ...prev,
            username: user.displayName ?? '',
            email: user.email ?? '',
            phoneNumber: '',
            photoURL: user.photoURL ?? DEFAULT_AVATAR,
            photoPublicId: null,
          }));
        }
      } catch (err) {
        console.error('[Settings] Error load user data:', err);
        setErrorMsg('Gagal memuat data akun.');
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsub();
  }, [router]);

  // === HANDLER INPUT TEKS ===
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // === HANDLER FILE FOTO PROFIL ===
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        profilePicture: file,
        photoURL: previewUrl, // hanya untuk preview di UI
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        profilePicture: null,
      }));
    }
  };

  // === SUBMIT & UPDATE KE FIREBASE ===
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      const { username, email, password, confirmPassword, phoneNumber } = form;

      if (!username || !email) {
        setErrorMsg('Username dan email wajib diisi.');
        setSaving(false);
        return;
      }

      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          setErrorMsg('Password baru dan konfirmasinya tidak sama.');
          setSaving(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password baru minimal 6 karakter.');
          setSaving(false);
          return;
        }
      }

      const user = auth.currentUser;
      if (!user) {
        setErrorMsg('User tidak ditemukan. Silakan login ulang.');
        setSaving(false);
        return;
      }

      // 1. Kalau ada foto baru → upload ke Cloudinary
      let finalPhotoURL = form.photoURL;
      let uploadedPublicId: string | null = null;
      const oldPhotoPublicId = form.photoPublicId;

      if (form.profilePicture && form.profilePicture.size > 0) {
        const uploadForm = new FormData();
        uploadForm.set('file', form.profilePicture);
        uploadForm.set('folder', 'umkmin/profile_pictures');

        const uploadRes = await fetch('/api/upload-profile', {
          method: 'POST',
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          throw new Error('UPLOAD_CLOUDINARY_FAILED');
        }

        const uploadData = await uploadRes.json();
        finalPhotoURL = uploadData.url as string;
        uploadedPublicId = uploadData.public_id as string;
        if (oldPhotoPublicId) {
          try {
            await fetch('/api/delete-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ publicId: oldPhotoPublicId }),
            });
          } catch (delErr) {
            console.error(
              '[Settings] gagal hapus foto lama:',
              delErr
            );
            // tidak menggagalkan update utama, hanya log
          }
        }
      }

      

      // 2. Update Firebase Auth: displayName, photoURL, email, password
      const profileUpdates: { displayName?: string; photoURL?: string } = {};

      if (username !== (user.displayName ?? '')) {
        profileUpdates.displayName = username;
      }

      if (finalPhotoURL && finalPhotoURL !== (user.photoURL ?? '')) {
        profileUpdates.photoURL = finalPhotoURL;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(user, profileUpdates);
      }

      if (email !== (user.email ?? '')) {
        await updateEmail(user, email);
      }

      if (password) {
        await updatePassword(user, password);
      }

      // 3. Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          username,
          email,
          phoneNumber,
          photoURL: finalPhotoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccessMsg('Data akun berhasil diperbarui.');
      setForm((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
        profilePicture: null,
        photoURL: finalPhotoURL || prev.photoURL,
      }));
    } catch (error: any) {
      console.error('[Settings] Update error:', error);

      let msg = 'Terjadi kesalahan saat memperbarui data.';

      if (error?.code === 'auth/requires-recent-login') {
        msg =
          'Untuk mengubah email atau password, silakan login ulang terlebih dahulu.';
      } else if (error?.code === 'auth/invalid-email') {
        msg = 'Format email tidak valid.';
      } else if (error?.code === 'auth/email-already-in-use') {
        msg = 'Email sudah digunakan akun lain.';
      } else if (error?.message === 'UPLOAD_CLOUDINARY_FAILED') {
        msg = 'Gagal upload foto. Coba lagi dengan file lain.';
      }

      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-dvh text-(--head-text)">
        Loading account settings...
      </div>
    );
  }
  return (
    <>
      <Link
        href="/"
        className="text-(--head-text) absolute flex items-center justify-start m-10"
      >
        <ChevronLeft />
        Kembali ke Homepage
      </Link>
      <div className="flex justify-center py-10 items-center max-w-dvw min-h-dvh">
        <div className="w-1/4">
          <div className="flex items-start justify-center">
            <h1 className="text-(--head-text) mt-8 font-extrabold text-5xl">
              Account Settings
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 mt-10">
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <OctagonAlert className="inline-block mr-2" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-100 border border-green-400 text-green-500 px-4 py-3 rounded relative">
                <BadgeCheck className="inline-block mr-2" />
                {successMsg}
              </div>
            )}
            <label
              className="font-extrabold text-(--head-text) block text-center mb-1"
              htmlFor="profile"
            >
              Profile Picture
            </label>
            <InputProfile
              name="profile"
              url={form.photoURL || DEFAULT_AVATAR}
              onChange={handleFileChange}
            />
            {inputData.map((input, index) => (
              <Input
                key={index}
                label={input.label}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                value={(form as any)[input.name] || ''}
                onChange={handleChange}
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
