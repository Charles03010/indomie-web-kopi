'use client';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const SidebarLink = [
  { name: 'Overview', href: '/dashboard/overview' },
  { name: 'Configurations', href: '/dashboard/configurations' },
  { name: 'Advertisement', href: '/dashboard/advertisement' },
  { name: 'Settings', href: '/dashboard/settings' },
  { name: 'Logout', href: '/logout' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    namaUMKM: '',
    cafeImage: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      
      try {
        const q = query(
          collection(db, 'umkm'),
          where('idpemilik', '==', user!.uid)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          if (pathname !== '/dashboard/settings'){
            redirect('/dashboard/settings');
          }
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data() as any;

          setFormData({
            namaUMKM: data.nama || '',
            cafeImage: data.imageUrl || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsub();
  }, []);
  return (
    <aside className="w-90 sticky top-0 border-r px-5 py-10 max-h-screen border-(--dashboard-border)">
      <div className="flex items-center justify-start">
        <Image
          src={"/images/logo.png"}
          alt="Logo"
          width={50}
          height={50}
          className=""
        />
        <h2 className="text-(--dashboard-text) text-2xl m-4">Dashboard</h2>
      </div>
      <div className="flex items-center mt-10 justify-start">
        <Image
          src={formData.cafeImage || "https://placehold.co/100x100/png"}
          alt="Logo"
          width={70}
          height={70}
          className="rounded-xl aspect-square object-cover"
        />
        <h2 className="text-(--dashboard-text) m-4 font-light">
          {formData.namaUMKM || "Nama UMKM"}
        </h2>
      </div>
      <div className="flex flex-col mt-10">
        {SidebarLink.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={
              'block w-full py-3 px-4 rounded-lg hover:bg-(--head-text) transition-colors' +
              (link.name === 'Logout' ? ' text-red-700' : ' text-(--dashboard-text)') +
              (pathname === link.href ? ' font-extrabold' : '') 
            }
          >
            {link.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
