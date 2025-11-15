// @ts-nocheck
import Image from 'next/image';
import Menu from './menu';
import Foto from './foto';
import Ulasan from './ulasan';
import { adminDb } from '@/lib/firebase/admin';
import { DocumentData } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';

// Helper function to fetch sub-collections
async function getSubCollection(
  umkmId: string,
  collectionName: string
) {
  const collectionRef = adminDb
    .collection('umkm')
    .doc(umkmId)
    .collection(collectionName);
  const snapshot = await collectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export default async function Cafe({ params }: { params: { id: string } }) {
  const { id } = await params;

  // --- Start Firestore Data Fetching ---
  const umkmRef = adminDb.doc(`umkm/${id}`);
  const umkmSnap = await umkmRef.get();

  // If no UMKM document exists, show a 404 page
  if (!umkmSnap.exists) {
    notFound();
  }

  const umkmData = umkmSnap.data() as DocumentData;

  // Fetch all sub-collections in parallel
  const [menuItems, fotoItems, ulasanItems] = await Promise.all([
    getSubCollection(id, 'menu'),
    getSubCollection(id, 'foto'),
    getSubCollection(id, 'ulasan'),
  ]);

  // Map Firestore data to the structure expected by the components
  const menuData = menuItems.map((item) => ({
    title: item.nama || 'Menu Item',
    description: item.deskripsi || 'Deskripsi tidak tersedia.',
    imageUrl: item.imageUrl || 'https://placehold.co/300x200',
    rating: item.rating || 0, // Assuming rating might not exist
    price: item.harga || 0,
  }));

  const fotoData = fotoItems.map((item) => ({
    imageUrl: item.imageUrl || 'https://placehold.co/400x300',
    alt: item.alt || 'Foto Kafe',
  }));

  const ulasanData = ulasanItems.map((item) => ({
    user: item.user || 'Pengguna',
    comment: item.comment || 'Tidak ada komentar.',
    rating: item.rating || 0,
    profilepic: item.profilepic || 'https://placehold.co/100x100',
  }));
  // --- End Firestore Data Fetching ---

  // Determine the main image for the header
  const mainImageUrl =
    umkmData.imageUrl ||
    (fotoData.length > 0
      ? fotoData[0].imageUrl
      : 'https://placehold.co/1200x400');
  const mainImageAlt = umkmData.nama || 'Gambar Kafe';

  return (
    <>
      <section>
        <div className="relative w-3/4 aspect-3/1 overflow-hidden mx-auto mt-25">
          {/* Use the dynamically fetched main image */}
          <Image
            src={mainImageUrl}
            className="rounded-xl"
            alt={mainImageAlt}
            fill
            style={{ objectFit: 'cover' }}
            priority // Prioritize loading the main image
          />
        </div>
      </section>
      <section className="my-10 mx-20">
        {/* Use the dynamic name and description */}
        <h2 className="text-6xl text-(--head-text) font-extrabold">
          {umkmData.nama || 'Nama Kafe'}
        </h2>
        <p className="text-(--head-text) font-light mt-3">
          {umkmData.deskripsi || 'Deskripsi kafe tidak tersedia.'}
        </p>
      </section>
      {/* Pass the fetched data to the client components */}
      {menuData.length > 0 && <Menu data={menuData} />}
      {fotoData.length > 0 && <Foto data={fotoData} />}
      {ulasanData.length > 0 && <Ulasan data={ulasanData} />}
    </>
  );
}