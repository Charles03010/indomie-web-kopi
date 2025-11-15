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

export default function MenuForm() {
  const { id } = useParams(); // 'add' or 'menu-item-id'
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: 0,
    cafeImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [umkmDocId, setUmkmDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isAddMode = id === 'add';

  // Effect to check auth and load UMKM data / existing menu item data
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

        // 2. If in "edit" mode, fetch the menu item's data
        if (!isAddMode) {
          const menuDocRef = doc(db, 'umkm', umkmId, 'menu', id as string);
          const menuDocSnap = await getDoc(menuDocRef);
          if (menuDocSnap.exists()) {
            const menuData = menuDocSnap.data();
            setFormData({
              nama: menuData.nama || '',
              deskripsi: menuData.deskripsi || '',
              harga: menuData.harga || 0,
              cafeImage: menuData.imageUrl || '',
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
      uploadForm.append('folder', 'umkmin/menu');

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
      const menuData = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        harga: formData.harga || 0,
        imageUrl: formData.cafeImage,
        updatedAt: serverTimestamp(),
      };

      if (isAddMode) {
        // Create new menu item
        await addDoc(collection(db, 'umkm', umkmDocId, 'menu'), {
          ...menuData,
          createdAt: serverTimestamp(),
        });
      } else {
        // Update existing menu item
        const ref = doc(db, 'umkm', umkmDocId, 'menu', id as string);
        await updateDoc(ref, menuData);
      }

      // Success, go back to config page
      router.push('/dashboard/configurations');
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError('Gagal menyimpan menu. Silakan coba lagi.');
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

      // Delete the menu item document from Firestore
      const menuDocRef = doc(db, 'umkm', umkmDocId, 'menu', id as string);
      await deleteDoc(menuDocRef);

      // Redirect on success
      router.push('/dashboard/configurations');
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Gagal menghapus menu. Silakan coba lagi.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-(--dashboard-text) p-10">Memuat data menu...</div>
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
            {isAddMode ? 'Tambahkan Menu' : 'Edit Menu'}
          </h2>
          <span className="font-light">
            Menu yang anda tambahkan akan muncul pada UMKMin.
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
            label="Nama Menu"
            type="text"
            name="nama"
            placeholder="Masukkan nama menu"
            value={formData.nama}
            onChange={handleChange}
          />
          <InputDashboard
            label="Deskripsi Menu"
            type="text"
            name="deskripsi"
            placeholder="Masukkan deskripsi menu"
            value={formData.deskripsi}
            onChange={handleChange}
          />
          <InputDashboard
            label="Harga Menu"
            type="number"
            name="harga"
            placeholder="Masukkan harga menu"
            value={String(formData.harga)}
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
