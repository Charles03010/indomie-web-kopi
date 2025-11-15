'use client';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import MenuDashboardCard from '@/app/components/card/menuDashboardCard';
import { useRouter } from 'next/navigation';

export default function Configurations() {
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<DocumentData[]>([]);
  const [fotoItems, setFotoItems] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        const q = query(
          collection(db, 'umkm'),
          where('idpemilik', '==', currentUser.uid)
        );
        const umkmSnapshot = await getDocs(q);

        if (umkmSnapshot.empty) {
          router.push('/dashboard/settings');
          return;
        }

        const umkmDoc = umkmSnapshot.docs[0];
        const umkmId = umkmDoc.id;

        const menuQuery = query(collection(db, 'umkm', umkmId, 'menu'));
        const menuSnapshot = await getDocs(menuQuery);

        const items = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
        const fotoQuery = query(collection(db, 'umkm', umkmId, 'foto'));
        const fotoSnapshot = await getDocs(fotoQuery);

        const fotoItems = fotoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFotoItems(fotoItems);
      } catch (err) {
        console.error('Error fetching data: ', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);
  console.log(menuItems);
  return (
    <>
      <Link
        href="/"
        className="text-(--dashboard-text) flex items-center justify-start my-10"
      >
        <ChevronLeft />
        Kembali ke Homepage
      </Link>
      <section>
        <div className="text-(--dashboard-text)">
          <h2 className="font-semibold text-2xl mb-3">Atur UMKM</h2>
          <span className="font-light">
            Anda dapat menambahkan, mengedit, meghapus
          </span>
        </div>
      </section>
      <section className="mt-10">
        <div className="text-(--dashboard-text) flex items-center">
          <h2 className="font-semibold text-2xl mr-3">Menu UMKM</h2>
          <Link href="/dashboard/configurations/menu/add" className="p-2 bg-(--dashboard-card-bg) rounded-full cursor-pointer">
            <Plus className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {loading ? (
            <p className="text-(--dashboard-text)">Loading menu...</p>
          ) : menuItems.length === 0 ? (
            <p className="text-(--dashboard-text)">
              Belum ada menu. Silakan tambahkan menu baru.
            </p>
          ) : (
            menuItems.map((item) => (
              <MenuDashboardCard
                key={item.id}
                title={item.nama || 'Tanpa Judul'}
                description={item.deskripsi || ''}
                imageUrl={item.imageUrl || 'https://placehold.co/300x200'}
                price={item.harga || 0}
                link={`/dashboard/configurations/menu/${item.id}`}
              />
            ))
          )}
        </div>
      </section>
      <section className="my-10">
        <div className="text-(--dashboard-text) flex items-center">
          <h2 className="font-semibold text-2xl mr-3">Foto UMKM</h2>
          <Link href="/dashboard/configurations/foto/add" className="p-2 bg-(--dashboard-card-bg) rounded-full cursor-pointer">
            <Plus className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {loading ? (
            <p className="text-(--dashboard-text)">Loading foto...</p>
          ) : fotoItems.length === 0 ? (
            <p className="text-(--dashboard-text)">
              Belum ada foto. Silakan tambahkan foto baru.
            </p>
          ) : (
            fotoItems.map((item) => (
              <Link
                href={`/dashboard/configurations/foto/${item.id}`}
                key={item.id}
                className="relative aspect-video w-full"
              >
                <Image
                  key={item.id}
                  src={item.imageUrl}
                  alt={item.nama || 'Tanpa Judul'}
                  className="rounded-xl"
                  fill
                />
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
