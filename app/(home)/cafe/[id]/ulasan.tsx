'use client';
import UlasanCard from '@/app/components/card/ulasanCard';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

export default function Ulasan({
  data,
}: {
  data: {
    user: string;
    comment: string;
    rating: number;
    profilepic: string;
  }[];
}) {
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
      <section className="my-10 mx-20">
        <h2 className="text-6xl text-(--head-text) font-extrabold">Ulasan</h2>
        <div className="w-full relative my-1 flex items-center justify-center">
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
              {data.map((card, index) => (
                <UlasanCard
                  key={index}
                  user={card.user}
                  comment={card.comment}
                  profilepic={card.profilepic}
                  rating={card.rating}
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
      </section>
    </>
  );
}
