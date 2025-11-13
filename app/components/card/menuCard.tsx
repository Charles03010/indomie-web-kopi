import { Star } from 'lucide-react';
import Image from 'next/image';

export default function MenuCard({
  title,
  description,
  imageUrl,
  rating,
  price,
}: {
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  price: number;
}) {
  return (
    <>
      <div className="relative flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 pl-4">
        <div className="border rounded-xl w-3/4 shadow-lg overflow-hidden m-4">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover shadow-xl"
            />
          </div>
          <div className="py-2 px-3">
            <h3 className="text-(--head-text) font-extrabold">{title}</h3>
            <p className="my-1 text-sm text-justify line-clamp-3">
              {description}
            </p>
            <div className="flex items-center space-x-2 my-2">
              {Array.from({ length: rating }, () => (
                <Star fill="#FFE311" strokeWidth={0} />
              ))}
            </div>
            <span className="text-(--secondary-text) text-sm">
              Harga:{' '}
              {price.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
