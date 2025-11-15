'use client';

import { ChevronLeft, OctagonAlert } from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import {
  InputCafeDashboard,
  InputDashboard,
} from '@/app/components/inputDashboard';
import { extractPublicIdFromUrl } from '@/lib/cloudinary/public_id';

export default function FotoForm() {
  const { id } = useParams(); // 'add' or 'foto-item-id'
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    deskripsi: '',
    cafeImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [umkmDocId, setUmkmDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isAddMode = id === 'add';

  // Effect to check auth and load UMKM data / existing foto item data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        // 1. Find user's UMKM
        const q = query(
          collection(db, 'umkm'),
          where('idpemilik', '==', currentUser.uid)
        );
        const umkmSnapshot = await getDocs(q);

        if (umkmSnapshot.empty) {
          // If no UMKM profile, redirect to create one
          router.push('/dashboard/settings');
          return;
        }

        const umkmDoc = umkmSnapshot.docs[0];
        const umkmId = umkmDoc.id;
        setUmkmDocId(umkmId);

        // 2. If in "edit" mode, fetch the foto item's data
        if (!isAddMode) {
          const fotoDocRef = doc(db, 'umkm', umkmId, 'foto', id as string);
          const fotoDocSnap = await getDoc(fotoDocRef);
          if (fotoDocSnap.exists()) {
            const fotoData = fotoDocSnap.data();
            setFormData({
              deskripsi: fotoData.alt || '',
              cafeImage: fotoData.imageUrl || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching data: ', err);
        setError('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, id, isAddMode]);

  // Handles text/number input changes and updates state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handles image file changes
  const handleCafeImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setError(null);

    try {
      // 1. Delete old image from Cloudinary if it exists
      const oldUrl = formData.cafeImage;
      if (oldUrl) {
        const publicId = extractPublicIdFromUrl(oldUrl);
        if (publicId) {
          await fetch('/api/delete-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
        }
      }

      // 2. Upload new image to Cloudinary
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('folder', 'umkmin/foto');

      const uploadRes = await fetch('/api/upload-photo', {
        method: 'POST',
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        throw new Error('Gagal upload foto ke Cloudinary');
      }

      const uploadData = await uploadRes.json();
      const newImageUrl = uploadData.url as string;

      // 3. Update local state with the new image URL
      setFormData((prev) => ({
        ...prev,
        cafeImage: newImageUrl,
      }));
    } catch (err) {
      console.error('Error when updating image:', err);
      setError('Terjadi kesalahan saat mengupdate gambar.');
    } finally {
      setSaving(false);
    }
  };

  // Handles the main form submission (Save/Edit)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !umkmDocId) {
      setError('User or UMKM not found. Please relogin.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const fotoData = {
        alt: formData.deskripsi,
        imageUrl: formData.cafeImage,
        updatedAt: serverTimestamp(),
      };

      if (isAddMode) {
        // Create new foto item
        await addDoc(collection(db, 'umkm', umkmDocId, 'foto'), {
          ...fotoData,
          createdAt: serverTimestamp(),
        });
      } else {
        // Update existing foto item
        const ref = doc(db, 'umkm', umkmDocId, 'foto', id as string);
        await updateDoc(ref, fotoData);
      }

      // Success, go back to config page
      router.push('/dashboard/configurations');
    } catch (err) {
      console.error('Error saving foto item:', err);
      setError('Gagal menyimpan foto. Silakan coba lagi.');
      setSaving(false);
    }
    // No need for finally { setSaving(false) } because we navigate on success
  };

  const handleDelete = async () => {
    if (isAddMode || !umkmDocId || !user) {
      setError('Tidak dapat menghapus. Data tidak lengkap atau sesi tidak valid.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Delete image from Cloudinary
      if (formData.cafeImage) {
        const publicId = extractPublicIdFromUrl(formData.cafeImage);
        if (publicId) {
          await fetch('/api/delete-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
        }
      }

      // Delete the foto item document from Firestore
      const fotoDocRef = doc(db, 'umkm', umkmDocId, 'foto', id as string);
      await deleteDoc(fotoDocRef);

      // Redirect on success
      router.push('/dashboard/configurations');
    } catch (err) {
      console.error('Error deleting foto item:', err);
      setError('Gagal menghapus foto. Silakan coba lagi.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-(--dashboard-text) p-10">Memuat data foto...</div>
    );
  }

  return (
    <>
      <Link
        href="/dashboard/configurations"
        className="text-(--dashboard-text) flex items-center justify-start my-10"
      >
        <ChevronLeft />
        Kembali ke Konfigurasi
      </Link>
      <section>
        <div className="text-(--dashboard-text)">
          <h2 className="font-semibold text-2xl mb-3">
            {isAddMode ? 'Tambahkan Foto' : 'Edit Foto'}
          </h2>
          <span className="font-light">
            Foto yang anda tambahkan akan muncul pada UMKMin.
          </span>
        </div>
      </section>
      <section className="pb-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 w-1/2 mt-10 text-(--dashboard-text)"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <OctagonAlert className="inline-block mr-2" />
              {error}
            </div>
          )}

          <InputCafeDashboard
            name="cafeImage"
            url={formData.cafeImage}
            onChange={handleCafeImageChange}
          />
          <InputDashboard
            label="Deskripsi Foto"
            type="text"
            name="deskripsi"
            placeholder="Masukkan deskripsi foto"
            value={formData.deskripsi}
            onChange={handleChange}
          />
          <div className="space-x-5">
            <button
              type="submit"
              className="py-2 px-5 bg-[#1D214B] cursor-pointer rounded-xl text-white disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : isAddMode ? 'Tambah' : 'Edit'}
            </button>
            {!isAddMode && (
              <button
                type="button"
                className="py-2 px-5 bg-red-600 cursor-pointer rounded-xl text-white disabled:opacity-50"
                onClick={handleDelete}
                disabled={saving}
              >
                Hapus
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
