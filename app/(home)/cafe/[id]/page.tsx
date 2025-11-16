'use client';

import Image from 'next/image';
import Menu from './menu';
import Foto from './foto';
import Ulasan from './ulasan';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, FormEvent } from 'react';
import { auth, db } from '../../../../lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { Star, X, OctagonAlert } from 'lucide-react';

// --- Helper Types ---
interface UmkmData {
  nama: string;
  deskripsi: string;
  imageUrl: string;
}

interface MenuItem {
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  price: number;
}

interface FotoItem {
  imageUrl: string;
  alt: string;
}

export interface UlasanItem {
  id: string;
  userId: string;
  user: string;
  comment: string;
  rating: number;
  profilepic: string;
  createdAt: Timestamp;
}

// --- Star Rating Component for Modal ---
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <div className="flex space-x-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-10 h-10 cursor-pointer ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

// --- Main Page Component ---
export default function Cafe() {
  const params = useParams();
  const id = params.id as string;

  // --- State for Data ---
  const [umkmData, setUmkmData] = useState<UmkmData | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [fotoData, setFotoData] = useState<FotoItem[]>([]);
  const [ulasanData, setUlasanData] = useState<UlasanItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- State for Auth and Review ---
  const [user, setUser] = useState<User | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- Effect for Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- Effect for Data Fetching ---
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch UMKM main data
        const umkmRef = doc(db, 'umkm', id);
        const umkmSnap = await getDoc(umkmRef);

        if (!umkmSnap.exists()) {
          notFound();
          return;
        }
        setUmkmData(umkmSnap.data() as UmkmData);

        // 2. Fetch sub-collections
        const [menuSnap, fotoSnap, ulasanSnap] = await Promise.all([
          getDocs(collection(db, 'umkm', id, 'menu')),
          getDocs(collection(db, 'umkm', id, 'foto')),
          getDocs(query(collection(db, 'umkm', id, 'ulasan'))),
        ]);

        // 3. Map and set data
        setMenuData(
          menuSnap.docs.map((d) => ({
            title: d.data().nama || 'Menu Item',
            description: d.data().deskripsi || 'Deskripsi tidak tersedia.',
            imageUrl: d.data().imageUrl || 'https://placehold.co/300x200/png',
            rating: d.data().rating || 0,
            price: d.data().harga || 0,
          }))
        );

        setFotoData(
          fotoSnap.docs.map((d) => ({
            imageUrl: d.data().imageUrl || 'https://placehold.co/400x300/png',
            alt: d.data().alt || 'Foto Kafe',
          }))
        );

        setUlasanData(
          ulasanSnap.docs.map((d) => ({
            id: d.id,
            userId: d.data().userId,
            user: d.data().user || 'Pengguna',
            comment: d.data().comment || 'Tidak ada komentar.',
            rating: d.data().rating || 0,
            profilepic:
              d.data().profilepic || 'https://placehold.co/100x100/png',
            createdAt: d.data().createdAt,
          }))
        );
      } catch (error) {
        console.error('Error fetching cafe data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- Effect to Check if User Has Reviewed ---
  useEffect(() => {
    if (user && ulasanData.length > 0) {
      const userReview = ulasanData.find(
        (ulasan) => ulasan.userId === user.uid
      );
      setHasReviewed(!!userReview);
    }
  }, [user, ulasanData]);

  // --- Handle Review Submission ---
  const handleSubmitUlasan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setModalError('Anda harus login untuk memberi ulasan.');
      return;
    }
    if (rating === 0) {
      setModalError('Rating bintang tidak boleh kosong.');
      return;
    }
    if (comment.trim() === '') {
      setModalError('Komentar tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const newUlasanData = {
        userId: user.uid,
        user: user.displayName || 'Pengguna Anonim',
        profilepic: user.photoURL || 'https://placehold.co/100x100/png',
        rating,
        comment,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, 'umkm', id, 'ulasan'),
        newUlasanData
      );

      // Optimistically update UI
      const newUlasanForState: UlasanItem = {
        ...newUlasanData,
        id: docRef.id,
        createdAt: new Timestamp(Date.now() / 1000, 0), // Approximate timestamp
      };
      setUlasanData((prev) => [newUlasanForState, ...prev]);
      setHasReviewed(true);
      setIsModalOpen(false);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error adding review:', error);
      setModalError('Gagal menyimpan ulasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading State ---
  if (loading || !umkmData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-(--head-text) text-2xl">
        Loading Cafe...
      </div>
    );
  }

  // --- Main Render ---
  const mainImageUrl =
    umkmData.imageUrl ||
    (fotoData.length > 0
      ? fotoData[0].imageUrl
      : 'https://placehold.co/1200x400/png');
  const mainImageAlt = umkmData.nama || 'Gambar Kafe';

  return (
    <>
      <section>
        <div className="relative w-3/4 aspect-3/1 overflow-hidden mx-auto mt-25">
          <Image
            src={mainImageUrl}
            className="rounded-xl"
            alt={mainImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </section>
      <section className="my-10 mx-20">
        <h2 className="text-6xl text-(--head-text) font-extrabold">
          {umkmData.nama || 'Nama Kafe'}
        </h2>
        <p className="text-(--head-text) font-light mt-3">
          {umkmData.deskripsi || 'Deskripsi kafe tidak tersedia.'}
        </p>
      </section>

      {menuData.length > 0 && <Menu data={menuData} />}
      {fotoData.length > 0 && <Foto data={fotoData} />}

      {/* Pass new props to Ulasan component */}
      <Ulasan
        data={ulasanData}
        user={user}
        hasReviewed={hasReviewed}
        onAddReviewClick={() => {
          setModalError(null);
          setRating(0);
          setComment('');
          setIsModalOpen(true);
        }}
      />

      {/* --- Review Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-(--head-text) text-center mb-6">
              Beri Ulasan
            </h2>

            <form onSubmit={handleSubmitUlasan} className="space-y-6">
              {modalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <OctagonAlert className="inline-block mr-2" />
                  {modalError}
                </div>
              )}

              <StarRating rating={rating} setRating={setRating} />

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-(--head-text) mb-2"
                >
                  Komentar Anda:
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-(--secondary-text)"
                  placeholder="Bagaimana pengalaman Anda di sini?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 rounded-full bg-(--button-primary) text-(--primary-white) text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
