import { ChevronLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

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
export default function Configurations() {
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
      </section>
    </>
  );
}
