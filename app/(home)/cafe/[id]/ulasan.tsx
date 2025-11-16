'use client';
import UlasanCard from '@/app/components/card/ulasanCard';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';
import { User } from 'firebase/auth';
import { UlasanItem } from './page'; // Import the shared type

export default function Ulasan({
  data,
  user,
  hasReviewed,
  onAddReviewClick,
}: {
  data: UlasanItem[];
  user: User | null;
  hasReviewed: boolean;
  onAddReviewClick: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: data.length > 2, // Only loop if there are enough items
    align: 'start',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Sort ulasan by date, newest first
  const sortedData = [...data].sort(
    (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
  );

  const renderReviewButton = () => {
    if (!user) {
      return (
        <Link
          href="/login"
          className="ml-4 text-sm font-medium text-(--secondary-text) hover:underline"
        >
          Login untuk memberi ulasan
        </Link>
      );
    }
    if (hasReviewed) {
      return (
        <button
          disabled
          className="ml-4 px-4 py-2 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
        >
          Anda sudah memberi ulasan
        </button>
      );
    }
    return (
      <button
        onClick={onAddReviewClick}
        className="ml-4 px-5 py-2 cursor-pointer rounded-full bg-(--button-primary) text-(--primary-white) text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Tulis Ulasan
      </button>
    );
  };

  return (
    <>
      <section className="my-10 mx-20">
        <div className="flex items-center mb-4">
          <h2 className="text-6xl text-(--head-text) font-extrabold">Ulasan</h2>
          {/* Add Review Button Area */}
          <div className="grow flex items-center justify-start">
            {renderReviewButton()}
          </div>
        </div>

        {data.length === 0 ? (
          <p className="text-(--head-text) font-light">
            Belum ada ulasan untuk kafe ini. Jadilah yang pertama!
          </p>
        ) : (
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
                {sortedData.map((card) => (
                  <UlasanCard
                    key={card.id}
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
        )}
      </section>
    </>
  );
}