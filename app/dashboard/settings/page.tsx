'use client';
import { ChevronLeft, OctagonAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, ChangeEvent } from 'react';
import {
  InputCafeDashboard,
  InputDashboard,
} from '@/app/components/inputDashboard';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { extractPublicIdFromUrl } from '@/lib/cloudinary/public_id';

const inputData = [
  {
    label: 'Nama UMKM',
    type: 'text',
    name: 'namaUMKM',
    placeholder: 'Masukkan nama UMKM Anda',
  },
  {
    label: 'Deskripsi UMKM',
    type: 'text',
    name: 'deskripsiUMKM',
    placeholder: 'Masukkan deskripsi UMKM Anda',
  },
];

export default function Configurations() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    namaUMKM: '',
    deskripsiUMKM: '',
    cafeImage: '',
  });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [umkmDocId, setUmkmDocId] = useState<string | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('Anda harus login terlebih dahulu.');
        setLoading(false);
        return;
      }
      setCurrentUser(user);

      try {
        // ambil data UMKM di mana idpemilik == uid
        const q = query(
          collection(db, 'umkm'),
          where('idpemilik', '==', user.uid)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setUmkmDocId(null);
          setError('Data UMKM belum ditemukan. Silakan isi dulu.');
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data() as any;

          setUmkmDocId(doc.id);
          setFormData({
            namaUMKM: data.nama || '',
            deskripsiUMKM: data.deskripsi || '',
            cafeImage: data.imageUrl || '',
          });
        }
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data UMKM.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleCafeImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setSaving(true);
      const oldUrl = formData.cafeImage;
      if (oldUrl) {
        const publicId = extractPublicIdFromUrl(oldUrl);
        if (publicId) {
          await fetch('/api/delete-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
        } else {
          console.warn('Tidak bisa derive public_id dari URL:', oldUrl);
        }
      }

      const uploadForm = new FormData();
      const file = e.target.files?.[0];
      if (!file) {
        setSaving(false);
        return;
      }
      uploadForm.append('file', file);
      uploadForm.append('folder', 'umkmin/umkm');

      const uploadRes = await fetch('/api/upload-photo', {
        method: 'POST',
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        throw new Error('Gagal upload foto ke Cloudinary');
      }

      const uploadData = await uploadRes.json();
      const newImageUrl = uploadData.url as string;
      let targetId = umkmDocId;

      if (!targetId) {
        const newDoc = await addDoc(collection(db, 'umkm'), {
          idpemilik: currentUser!.uid,
          nama: formData.namaUMKM || '',
          deskripsi: formData.deskripsiUMKM || '',
          imageUrl: newImageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        targetId = newDoc.id;
        setUmkmDocId(newDoc.id);
      } else {
        const ref = doc(db, 'umkm', targetId);
        await updateDoc(ref, {
          imageUrl: newImageUrl,
          updatedAt: serverTimestamp(),
        });
      }

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

  const saveFieldToFirestore = async (
    field: 'namaUMKM' | 'deskripsiUMKM',
    value: string
  ) => {
    if (!currentUser) return;

    setSaving(true);

    try {
      let targetId = umkmDocId;

      // kalau belum ada dokumen, buat dulu
      if (!targetId) {
        const newDoc = await addDoc(collection(db, 'umkm'), {
          idpemilik: currentUser.uid,
          nama: field === 'namaUMKM' ? value : '',
          deskripsi: field === 'deskripsiUMKM' ? value : '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        targetId = newDoc.id;
        setUmkmDocId(newDoc.id);
      } else {
        // kalau sudah ada, update field yang berubah
        const ref = doc(db, 'umkm', targetId);
        await updateDoc(ref, {
          [field === 'namaUMKM' ? 'nama' : 'deskripsi']: value,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error update UMKM:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: 'namaUMKM' | 'deskripsiUMKM') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveFieldToFirestore(field, value);
      }, 500);
    };

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <Link
        href="/"
        className="text-(--dashboard-text) flex items-center justify-start my-10"
      >
        <ChevronLeft />
        Kembali ke Homepage
      </Link>
      <section className="mt-20">
        <h2 className="text-(--dashboard-text) text-2xl mb-5">Settings</h2>
        <InputCafeDashboard
          name="cafeImage"
          url={formData.cafeImage}
          onChange={handleCafeImageChange}
        />
      </section>
      <section className="pb-10">
        <form className="space-y-5 w-1/2 mt-10 text-(--dashboard-text)">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <OctagonAlert className="inline-block mr-2" />
              {error}
            </div>
          )}
          {inputData.map((input, index) => (
            <InputDashboard
              key={index}
              label={input.label}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name as 'namaUMKM' | 'deskripsiUMKM']}
              onChange={handleChange(
                input.name as 'namaUMKM' | 'deskripsiUMKM'
              )}
            />
          ))}
          <br />
          <label className="font-extrabold" htmlFor="hapus">
            Hapus UMKM
          </label>
          <p>
            Ketik "{formData.namaUMKM}" sebagai konfirmasi menghapus akun anda
          </p>
          <div className="flex bg-(--dashboard-card-bg) mt-2 w-1/2 rounded-xl items-center">
            <input
              type="text"
              id="hapus"
              name="hapus"
              autoComplete="hapus"
              className="w-full p-4 outline-0"
              placeholder="Masukkan nama UMKM Anda"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 cursor-pointer text-white px-8 py-2 rounded-xl"
          >
            HAPUS
          </button>
        </form>
      </section>
    </>
  );
}
