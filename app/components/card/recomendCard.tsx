import { MapPin, Star } from 'lucide-react'; // Import Star
import Image from 'next/image';
import Link from 'next/link';

export default function RecomendCard({
  title,
  description,
  imageUrl,
  address,
  distance,
  link,
  rating, // Add rating prop
}: {
  title: string;
  description: string;
  imageUrl: string;
  address: string;
  distance: string;
  link: string;
  rating: number; // Define rating prop
}) {
  return (
    <>
      <Link
        href={link}
        className="relative flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 pl-4"
      >
        <div className="border rounded-xl w-3/4 shadow-lg overflow-hidden m-4">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={title}
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="py-2 px-3">
            <h3 className="text-(--head-text) font-extrabold">{title}</h3>

            {/* --- New Star Rating Display --- */}
            <div className="flex items-center space-x-1 my-2">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  strokeWidth={index < rating ? 0 : 2}
                />
              ))}
              {rating === 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  Belum ada rating
                </span>
              )}
            </div>
            {/* --- End Star Rating Display --- */}

            <p className="my-1 text-sm text-justify line-clamp-3">
              {description}
            </p>
            <div className="flex items-center space-x-2 mt-5 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm line-clamp-1">{address}</span>
            </div>
            <span className="text-(--secondary-text) text-sm">
              Jarak: {distance}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}
