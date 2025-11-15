import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MenuDashboardCard({
  title,
  description,
  imageUrl,
  price,
  link,
}: {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="relative cursor-pointer flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0">
        <div className="border bg-(--dashboard-card-bg) rounded-xl w-full shadow-lg overflow-hidden">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover shadow-xl"
            />
          </div>
          <div className="py-2 px-3">
            <h3 className="text-(--dashboard-text) font-semibold">{title}</h3>
            <p className="my-1 text-(--dashboard-text) font-light text-sm text-justify line-clamp-3">
              {description}
            </p>
            <br />
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
    </Link>
  );
}
