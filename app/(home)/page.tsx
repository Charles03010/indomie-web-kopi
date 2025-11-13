'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback } from 'react';
import RecomendCard from '../components/card/recomendCard';

const SAMPLE_CARDS = [
  {
    title: 'Anggap Aja ini Kafe',
    description:
      'ini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopi',
    imageUrl: '/images/upload/Cafe1.png',
    address: 'Sodong, Genting, Kec Jambu.......',
    distance: '2.5 KM',
    link: '/detail/1',
  },
  {
    title: 'Anggap Aja ini Kafe',
    description:
      'ini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopi',
    imageUrl: '/images/upload/Cafe1.png',
    address: 'Sodong, Genting, Kec Jambu.......',
    distance: '2.5 KM',
    link: '/detail/1',
  },
  {
    title: 'Anggap Aja ini Kafe',
    description:
      'ini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopiini kopi',
    imageUrl: '/images/upload/Cafe1.png',
    address: 'Sodong, Genting, Kec Jambu.......',
    distance: '2.5 KM',
    link: '/detail/1',
  },
];

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
              mb-6 lg:mb-10 
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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
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
              {SAMPLE_CARDS.map((card, index) => (
                <RecomendCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  address={card.address}
                  distance={card.distance}
                  link={card.link}
                />
              ))}
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

      <section id="search" className="py-16 md:py-20 px-4 md:px-10 lg:px-14">
        <div className="text-center text-(--head-text) max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            Udah tau mau ngopi dimana ?
          </h2>
          <h3 className="mt-3 md:mt-4 text-lg sm:text-xl lg:text-3xl font-light">
            gas, langsung cari lokasi favorit kamu.
          </h3>
        </div>
        <form
          action=""
          className="
            w-full md:w-3/4 lg:w-2/3 xl:w-1/2 
            my-10 py-3 md:py-4 mx-auto 
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
          />
          <button type="submit" className="text-(--primary-white) ml-4 p-2">
            <Search strokeWidth={1.5} className="w-6 h-6" />
          </button>
        </form>
      </section>

      <section
        id="join"
        className="
        relative 
        flex flex-col // Container vertikal untuk Judul dan Konten Utama
        items-center justify-start // Judul di atas, Konten Utama di bawah
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
          flex flex-col lg:flex-row // Vertikal di mobile, Horizontal di desktop
          items-center lg:items-center // Pusatkan secara vertikal
          justify-center 
          gap-8 lg:gap-16
        "
        >
          <div
            className="
            relative 
            w-full lg:w-1/2 
            aspect-square max-w-xs sm:max-w-sm lg:max-w-none // Kontrol ukuran gambar agar tidak terlalu besar di mobile
            flex justify-center lg:justify-start 
          "
          >
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/upload/coffee.png"
                alt="Coffee"
                fill
                style={{ objectFit: 'contain' }}
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
              href="#search"
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
