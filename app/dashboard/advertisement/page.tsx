'use client';
import { BadgePercent, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import CardLineChart from './chart';

export default function Advertisement() {
  const [user, setUser] = useState<User | null>(null);
  const [promoItems, setPromoItems] = useState<any[]>([]);
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

        const promoQuery = query(collection(db, 'umkm', umkmId, 'promo'));
        const promoSnapshot = await getDocs(promoQuery);

        const items = promoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPromoItems(items);
      } catch (err) {
        console.error('Error fetching data: ', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);
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
          <h2 className="font-semibold text-2xl mb-3">
            Advertisement Settings
          </h2>
          <span className="font-light">
            Anda dapat menambahkan, mengedit, meghapus
          </span>
        </div>
      </section>
      <section className="my-10">
        <div className="text-(--dashboard-text) flex items-center">
          <h2 className="font-semibold text-2xl mr-3">Kode Promo</h2>
          <Link
            href="/dashboard/advertisement/promo/add"
            className="p-2 bg-(--dashboard-card-bg) rounded-full cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-5 mt-5">
          {loading ? (
            <p className="text-(--dashboard-text)">Loading promo...</p>
          ) : promoItems.length === 0 ? (
            <p className="text-(--dashboard-text)">No promo available.</p>
          ) : (
            promoItems.map((item) => {
              const remainingDays = Math.max(
                0,
                Math.ceil(
                  (item.berlaku.seconds * 1000 - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
              );
              const isExpired = remainingDays === 0;

              return (
                <Link
                  href={`/dashboard/advertisement/promo/${item.id}`}
                  key={item.id}
                  className={`p-4 flex flex-col justify-between bg-(--dashboard-card-bg) rounded-lg shadow-md ${
                    isExpired ? 'border border-red-500' : ''
                  }`}
                >
                  <div className="flex w-full">
                    <div className="text-(--dashboard-text) flex flex-col justify-between items-center mr-4">
                      <BadgePercent />
                      <span>{item.stok}</span>
                    </div>
                    <div className="">
                      <h3 className="text-lg text-(--dashboard-text) font-semibold">
                        {item.nama || 'Untitled'}
                      </h3>
                      <p className="text-(--dashboard-text) font-light mb-2">
                        {item.deskripsi || ''}
                      </p>
                      <p className="text-(--dashboard-text)">
                        Kode Promo: {item.kode || ''}
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-2">
                    <p className="text-(--dashboard-text) text-center font-light">
                      {isExpired
                        ? 'Expired'
                        : `Masa Berlaku: ${remainingDays} hari lagi`}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-(--dashboard-text) text-2xl">Statistik Kode Promo</h2>
        <CardLineChart />
      </section>
    </>
  );
}
