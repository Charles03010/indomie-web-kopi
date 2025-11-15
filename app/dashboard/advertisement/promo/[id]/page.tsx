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
  Timestamp,
} from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import {
  InputCafeDashboard,
  InputDashboard,
} from '@/app/components/inputDashboard';
import { extractPublicIdFromUrl } from '@/lib/cloudinary/public_id';

export default function PromoForm() {
  const { id } = useParams(); // 'add' or 'foto-item-id'
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    kode: '',
    stok: 0,
    berlaku: null as Timestamp | null,
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
          const promoDocRef = doc(db, 'umkm', umkmId, 'promo', id as string);
          const promoDocSnap = await getDoc(promoDocRef);
          if (promoDocSnap.exists()) {
            const promoData = promoDocSnap.data();
            setFormData({
              nama: promoData.nama || '',
              deskripsi: promoData.deskripsi || '',
              kode: promoData.kode || '',
              stok: promoData.stok || 0,
              berlaku: promoData.berlaku || null,
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
    if (name === 'berlaku' && type === 'date') {
      const date = new Date(value);
      const timestamp = Timestamp.fromDate(date);
      setFormData((prev) => ({ ...prev, berlaku: timestamp }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
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
      const promoData = {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        kode: formData.kode,
        stok: formData.stok,
        berlaku: formData.berlaku,
        updatedAt: serverTimestamp(),
      };

      if (isAddMode) {
        // Create new promo item
        await addDoc(collection(db, 'umkm', umkmDocId, 'promo'), {
          ...promoData,
          createdAt: serverTimestamp(),
        });
      } else {
        // Update existing promo item
        const ref = doc(db, 'umkm', umkmDocId, 'promo', id as string);
        await updateDoc(ref, promoData);
      }

      // Success, go back to config page
      router.push('/dashboard/advertisement');
    } catch (err) {
      console.error('Error saving promo item:', err);
      setError('Gagal menyimpan promo. Silakan coba lagi.');
      setSaving(false);
    }
    // No need for finally { setSaving(false) } because we navigate on success
  };

  const handleDelete = async () => {
    if (isAddMode || !umkmDocId || !user) {
      setError(
        'Tidak dapat menghapus. Data tidak lengkap atau sesi tidak valid.'
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Delete the promo item document from Firestore
      const promoDocRef = doc(db, 'umkm', umkmDocId, 'promo', id as string);
      await deleteDoc(promoDocRef);

      // Redirect on success
      router.push('/dashboard/advertisement');
    } catch (err) {
      console.error('Error deleting promo item:', err);
      setError('Gagal menghapus promo. Silakan coba lagi.');
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
        href="/dashboard/advertisement"
        className="text-(--dashboard-text) flex items-center justify-start my-10"
      >
        <ChevronLeft />
        Kembali ke Advertisement
      </Link>
      <section>
        <div className="text-(--dashboard-text)">
          <h2 className="font-semibold text-2xl mb-3">
            {isAddMode ? 'Tambahkan Promo' : 'Edit Promo'}
          </h2>
          <span className="font-light">
            Promo yang anda tambahkan akan muncul pada UMKMin.
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
          <InputDashboard
            label="Nama Promo"
            type="text"
            name="nama"
            placeholder="Masukkan nama promo"
            value={formData.nama}
            onChange={handleChange}
          />
          <InputDashboard
            label="Deskripsi Promo"
            type="text"
            name="deskripsi"
            placeholder="Masukkan deskripsi promo"
            value={formData.deskripsi}
            onChange={handleChange}
          />
          <InputDashboard
            label="Kode Promo"
            type="text"
            name="kode"
            placeholder="Masukkan kode promo"
            value={formData.kode}
            onChange={handleChange}
          />
          <InputDashboard
            label="Stok Promo"
            type="number"
            name="stok"
            placeholder="Masukkan stok promo"
            value={formData.stok.toString()}
            onChange={handleChange}
          />
          <InputDashboard
            label="Berlaku Promo"
            type="date"
            name="berlaku"
            placeholder="Masukkan berlaku promo"
            value={
              formData.berlaku
                ? new Date(formData.berlaku.seconds * 1000)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
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
