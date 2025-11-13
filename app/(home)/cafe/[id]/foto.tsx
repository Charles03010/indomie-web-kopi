'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';

export default function Foto({
  data,
}: {
  data: {
    imageUrl: string;
    alt: string;
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
        <h2 className="text-6xl text-(--head-text) font-extrabold">Foto</h2>
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
                <div className="relative overflow-hidden w-1/3 mx-5 aspect-video">
                <Image
                  key={index}
                  src={card.imageUrl}
                  alt={card.alt}
                  fill
                  className="rounded-xl shadow-xl object-cover"
                  />
                  </div>
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
