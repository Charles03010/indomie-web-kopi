"use client";
import { ChevronLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import CardLineChart from './chart';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const dummyTips = [
  {
    title: 'Undang Pengguna',
    content:
      'Mulai undang pengguna menggunakan tautan untuk datang ke UMKM anda.',
    link: '/dashboard/overview',
    linkText: 'Copy Link',
    icons: <ExternalLink />,
  },
  {
    title: 'Kepuasan Pelanggan',
    content:
      'Langkah langkah meningkatkan kepuasan pelanggan agar masuk dalam rekomendasi',
    link: '/dashboard/overview',
    linkText: 'Pelajari  Selengkapnya',
    icons: <ExternalLink />,
  },
];
export default function Overview() {
  const [formData, setFormData] = useState({
    namaUMKM: '',
    cafeImage: '',
    updatedAt: null as Timestamp | null,
  });
  console.log(formData);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      
      try {
        const q = query(
          collection(db, 'umkm'),
          where('idpemilik', '==', user!.uid)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return ;
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data() as any;

          setFormData({
            namaUMKM: data.nama || '',
            cafeImage: data.imageUrl || '',
            updatedAt: data.updatedAt || null,
          });
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsub();
  }, []);
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
        <div className="flex items-start justify-start my-15">
          <Image
            src={formData.cafeImage || "https://placehold.co/200x200/png"}
            alt="Cafe Image"
            width={200}
            height={200}
            className="rounded-xl aspect-square object-cover"
          />
          <div className="ml-10">
            <h2 className="text-(--dashboard-text) text-xl mb-2">
              {formData.namaUMKM}
            </h2>
            <span className="text-(--dashboard-text) text-sm">
              Updated{' '}
              
              {formData.updatedAt && new Timestamp(formData.updatedAt.seconds, 0)
                .toDate()
                .toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                .replace(/\./g, ':')}
            </span>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-(--dashboard-text) text-2xl">
          Cek tips untuk dapatkan pengunjung !
        </h2>
        <div className="flex space-x-5">
          {dummyTips.map((tip, index) => (
            <div
              key={index}
              className="flex w-1/4 text-(--dashboard-text) bg-(--dashboard-card-bg) p-5 rounded-4xl my-5"
            >
              <div className="w-max mr-4">{tip.icons}</div>
              <div className="flex flex-col justify-around">
                <h3 className="text-lg font-extrabold mb-1">{tip.title}</h3>
                <p className="text-sm mb-4">{tip.content}</p>
                <Link href={tip.link} className="cursor-pointer font-semibold">
                  {tip.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className='mt-10'>
        <h2 className="text-(--dashboard-text) text-2xl">
          Undang Pengguna
        </h2>
        <CardLineChart />
      </section>
    </>
  );
}
