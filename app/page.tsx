'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/dist/client/link';
import Image from 'next/image';
import { useCallback } from 'react';
import RecomendCard from './components/recomendCard';
import { link } from 'fs';

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
    align: 'center',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <>
      <section className="flex px-14 items-center justify-between relative">
        <div className="w-1/2 relative z-1 ">
          <h1 className="whitespace-pre mb-10 font-extrabold text-8xl text-(--head-text) ">
            <span className=" ">
              JELAJAHI{' '}
              <span className="bg-clip-text bg-[url('/images/upload/effect.gif')] text-transparent">
                DUNIA
              </span>
              MU
            </span>
            {`\nDALAM SECANGKIR\n`}
            <span className="text-transparent bg-clip-text bg-[url('/images/upload/effect.gif')]">
              KOPI
            </span>
          </h1>
          <Link
            href="#search"
            className="px-6 py-3 rounded-full bg-(--button-primary) text-(--primary-white)"
          >
            mulai cari <span className="font-extrabold">kopimu</span>
          </Link>
        </div>
        <div className="relative w-1/2 aspect-3/2 my-32">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full aspect-3/2">
            <Image src="/images/upload/hero.png" alt="Coffee Beans" fill />
          </div>
        </div>
      </section>
      <section className="px-14 h-screen flex flex-col items-center justify-between">
        <div className="text-center text-(--head-text)">
          <h2 className="text-6xl font-extrabold">
            Bingung mau ngopi dimana ?
          </h2>
          <h3 className="whitespace-pre mt-4 text-3xl">{`nih, UMKMin rekomendasiin tempat ngopi \ndengan cita rasa yang otentik.`}</h3>
        </div>
        <div className="w-full relative flex items-center justify-center">
          <button
            onClick={scrollPrev}
            className="absolute cursor-pointer left-0 z-1 p-3 rounded-full transition-all duration-200  bg-(--carousel-button-bg) text-(--primary-white)"
            aria-label="Previous image"
          >
            <ArrowLeft strokeWidth={3} />
          </button>
          <div className="overflow-hidden w-full max-w-4/5" ref={emblaRef}>
            <div className="flex">
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
            className="absolute cursor-pointer right-0 z-1 p-3 rounded-full transition-all duration-200  bg-(--carousel-button-bg) text-(--primary-white)"
            aria-label="Next image"
          >
            <ArrowRight strokeWidth={3} />
          </button>
        </div>
        <div className="text-center space-y-6">
          <h4 className="text-(--head-text)">masih belum nemu ?</h4>
          <Link
            href="#search"
            className="text-(--button-secondary) font-extrabold"
          >
            lihat semua yuk
          </Link>
        </div>
      </section>
    </>
  );
}
