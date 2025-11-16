'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState, useRef } from 'react';
import RecomendCard from '../components/card/recomendCard';

import { db } from '@/lib/firebase/client';
import { collection, getDocs, query, DocumentData } from 'firebase/firestore';

interface RecomendCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  address: string;
  distance: string;
  link: string;
}

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  });

  const [recommendations, setRecommendations] = useState<RecomendCardProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // --- New state for search ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<RecomendCardProps[]>(
    []
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // --- End new state ---

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Effect to fetch UMKM data (existing)
  useEffect(() => {
    const fetchUmkmData = async () => {
      try {
        const q = query(collection(db, 'umkm'));
        const snapshot = await getDocs(q);

        const fetchedCards: RecomendCardProps[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.nama || 'Nama Kafe',
            description: data.deskripsi || 'Deskripsi tidak tersedia.',
            imageUrl: data.imageUrl || 'https://placehold.co/300x200/png',
            address: data.alamat || 'Alamat tidak diisi',
            distance: data.distance || 'N/A',
            link: `/cafe/${doc.id}`,
          };
        });

        setRecommendations(fetchedCards);
      } catch (error) {
        console.error('Error fetching recommendations: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUmkmData();
  }, []);

  // --- New effect for filtering results ---
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const filtered = recommendations.filter((rec) =>
      rec.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
    setIsDropdownVisible(filtered.length > 0);
  }, [searchTerm, recommendations]);

  // --- New effect to handle "click outside" ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <>
      <section
        className="
        relative 
        flex flex-col lg:flex-row 
        items-center justify-center 
        min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-120px)]
        px-4 md:px-10 lg:px-14 
        py-10 lg:py-0
        overflow-hidden
      "
      >
        <div
          className="
          w-full max-w-7xl 
          flex flex-col-reverse lg:flex-row 
          items-center justify-between 
          text-center lg:text-left
          gap-8 lg:gap-16
        "
        >
          <div className="w-full lg:w-1/2 relative z-1 mt-10 lg:mt-0">
            <h1
              className="
              whitespace-pre-line 
              font-extrabold 
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
              leading-tight sm:leading-snug lg:leading-[1.1] 
              mb-6 lg:mb-10 xl:w-max
              text-(--head-text) 
            "
            >
              <span className="block">
                JELAJAHI{' '}
                <span className="bg-clip-text bg-[url('/images/upload/effect.gif')] text-transparent">
                  DUNIA
                </span>
                MU
              </span>
              <span className="block">DALAM SECANGKIR</span>
              <span className="text-transparent bg-clip-text bg-[url('/images/upload/effect.gif')] block">
                KOPI
              </span>
            </h1>
            <Link
              href="#search"
              className="
                inline-block 
                px-8 py-3 rounded-full 
                bg-(--button-primary) text-(--primary-white) 
                text-lg font-medium hover:opacity-90 transition-opacity
              "
            >
              mulai cari <span className="font-extrabold">kopimu</span>
            </Link>
          </div>

          <div className="relative w-full lg:w-1/2 aspect-3/2 max-w-[500px] lg:max-w-none">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/upload/hero.png"
                alt="Coffee Beans"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="recomend"
        className="px-4 md:px-10 lg:px-14 py-12 md:py-16 flex flex-col items-center justify-between"
      >
        <div className="text-center text-(--head-text) max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold xl:w-max">
            Bingung mau ngopi dimana ?
          </h2>
          <h3 className="mt-3 md:mt-4 text-lg sm:text-xl lg:text-3xl font-light whitespace-pre-line">
            {`nih, UMKMin rekomendasiin tempat ngopi \ndengan cita rasa yang otentik.`}
          </h3>
        </div>

        <div className="w-full relative my-10 md:my-16 flex items-center justify-center">
          <button
            onClick={scrollPrev}
            className="
              hidden md:block 
              absolute cursor-pointer 
              left-0 md:left-4 lg:left-8 
              z-10 p-3 rounded-full 
              transition-all duration-200  
              bg-(--carousel-button-bg) text-(--primary-white) 
              shadow-md hover:scale-105 
            "
            aria-label="Previous image"
          >
            <ArrowLeft strokeWidth={3} className="w-5 h-5" />
          </button>

          <div className="overflow-hidden w-full max-w-6xl" ref={emblaRef}>
            <div className="flex pl-4 md:pl-6 lg:pl-8">
              {loading ? (
                <div className="flex-[0_0_100%] min-w-0 text-center text-(--head-text)">
                  Loading recommendations...
                </div>
              ) : recommendations.length === 0 ? (
                <div className="flex-[0_0_100%] min-w-0 text-center text-(--head-text)">
                  No recommendations found.
                </div>
              ) : (
                recommendations.map((card) => (
                  <RecomendCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    imageUrl={card.imageUrl}
                    address={card.address}
                    distance={card.distance}
                    link={card.link}
                  />
                ))
              )}
            </div>
          </div>

          <button
            onClick={scrollNext}
            className="
              hidden md:block 
              absolute cursor-pointer 
              right-0 md:right-4 lg:right-8 
              z-10 p-3 rounded-full 
              transition-all duration-200  
              bg-(--carousel-button-bg) text-(--primary-white) 
              shadow-md hover:scale-105
            "
            aria-label="Next image"
          >
            <ArrowRight strokeWidth={3} className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-4 md:space-y-6 mt-4">
          <h4 className="text-xl text-(--head-text)">masih belum nemu ?</h4>
          <Link
            href="#search"
            className="
              text-lg 
              text-(--button-secondary) font-extrabold 
              hover:text-opacity-80 transition-opacity
            "
          >
            lihat semua yuk
          </Link>
        </div>
      </section>

      {/* --- MODIFIED SEARCH SECTION --- */}
      <section id="search" className="py-16 md:py-20 px-4 md:px-10 lg:px-14">
        <div className="text-center text-(--head-text) max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold xl:w-max">
            Udah tau mau ngopi dimana ?
          </h2>
          <h3 className="mt-3 md:mt-4 text-lg sm:text-xl lg:text-3xl font-light">
            gas, langsung cari lokasi favorit kamu.
          </h3>
        </div>

        {/* This wrapper is now relative and has the ref */}
        <div
          ref={searchContainerRef}
          className="relative w-full md:w-3/4 lg:w-2/3 xl:w-1/2 my-10 mx-auto"
        >
          <form
            onSubmit={(e) => e.preventDefault()} // Prevent form submission
            className="
              w-full py-3 md:py-4 
              rounded-full flex items-center 
              justify-between 
              px-4 md:px-8 
              bg-linear-to-r to-[#1C2022] from-[#352B1B] 
              shadow-xl
            "
          >
            <input
              className="
                w-full 
                outline-none border-none 
                text-(--primary-white) 
                font-light text-base md:text-lg 
                bg-transparent 
                placeholder-gray-400
              "
              placeholder="enaknya ngopi dimana ya?"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() =>
                setIsDropdownVisible(
                  filteredResults.length > 0 && searchTerm.length > 0
                )
              }
              autoComplete="off"
            />
            <button type="submit" className="text-(--primary-white) ml-4 p-2">
              <Search strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </form>

          {/* --- NEW DROPDOWN UI --- */}
          {isDropdownVisible && (
            <div
              className="
                absolute top-full left-0 right-0 z-20 
                mt-2 bg-linear-to-r to-[#1C2022] from-[#352B1B] 
                rounded-xl shadow-lg 
                overflow-hidden border border-gray-200
              "
            >
              <ul className="max-h-60 overflow-y-auto divide-gray-900 divide-y">
                {filteredResults.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={result.link}
                      className="
                        block px-5 py-3 
                        text-(--primary-white) hover:bg-gray-900 
                        transition-colors text-lg
                        truncate
                      "
                      onClick={() => {
                        setSearchTerm(result.title); // Fill input on click
                        setIsDropdownVisible(false); // Hide dropdown
                      }}
                    >
                      {result.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- END NEW DROPDOWN UI --- */}
        </div>
      </section>
      {/* --- END MODIFIED SEARCH SECTION --- */}

      <section
        id="join"
        className="
        relative 
        flex flex-col
        items-center justify-start 
        min-h-[70vh] lg:min-h-[80vh]
        py-12 md:py-20 
        px-4 md:px-10 lg:px-14 
        overflow-hidden
      "
      >
        <div
          className="
          text-center text-(--head-text) 
          max-w-4xl mx-auto mb-10
        "
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[4rem]  font-extrabold">
            Mulai gabung UMKMin
          </h2>

          <h3 className="mt-1 md:mt-2 text-sm sm:text-base lg:text-xl font-light">
            Mulai menjadi cita rasa kopi terbaik bareng UMKMin.
          </h3>
        </div>

        <div
          className="
          w-full max-w-7xl 
          flex flex-col lg:flex-row 
          items-center lg:items-center
          justify-center 
          gap-8 lg:gap-16
        "
        >
          <div
            className="
            relative 
            w-full lg:w-1/2 
            aspect-square max-w-xs sm:max-w-sm lg:max-w-none 
            flex justify-center lg:justify-start 
          "
          >
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/upload/coffee.png"
                alt="Coffee"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          <div
            className="
            w-full lg:w-1/2 
            relative z-1 
            mt-10 lg:mt-0 
            text-center lg:text-right 
            lg:pl-10
          "
          >
            <h2
              className="
              mb-6 lg:mb-10 
              font-extrabold 
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
              leading-tight sm:leading-snug lg:leading-20 
              text-(--head-text) 
            "
            >
              <span className="block">
                SUDAH{' '}
                <span className="bg-clip-text bg-[url('/images/upload/effect.gif')] text-transparent">
                  19 JUTA
                </span>
              </span>
              <span className="block">UMKM YANG BERGABUNG</span>
              <span className="block">BERSAMA UMKMin</span>
            </h2>
            <Link
              href="/login"
              className="
                inline-block 
                px-8 py-3 
                rounded-full 
                bg-(--button-primary) text-(--primary-white) 
                text-lg font-medium 
                hover:opacity-90 transition-opacity
              "
            >
              daftar <span className="font-extrabold">UMKMin</span> sekarang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
