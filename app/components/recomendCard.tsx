import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecomendCard({
  title,
  description,
  imageUrl,
  address,
  distance,
  link,
}: {
  title: string;
  description: string;
  imageUrl: string;
  address: string;
  distance: string;
  link: string;
}) {
  return (
    <>
      <Link href={link} className='relative flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 pl-4'>
        <div className="border rounded-xl w-3/4 shadow-lg overflow-hidden m-4">
          <div className="relative w-full aspect-video">
            <Image src={imageUrl} alt={title} fill />
          </div>
          <div className="py-1 px-3">
            <h3 className="text-(--head-text) font-extrabold">{title}</h3>
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
