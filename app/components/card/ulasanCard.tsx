import { Star } from 'lucide-react';
import Image from 'next/image';

export default function UlasanCard({
  user,
  comment,
  profilepic,
  rating,
}: {
  user: string;
  comment: string;
  profilepic: string;
  rating: number;
}) {
  return (
    <>
      <div className="relative flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 pl-4">
        <div className="bg-white p-2 flex rounded-xl w-3/4 overflow-hidden">
          <div className="w-1/4 flex items-center justify-center">
          <div className="relative aspect-square w-full">
            <Image
              src={profilepic}
              alt={user}
              fill
              className="object-cover shadow-xl rounded-full"
              />
              </div>
          </div>
          <div className="py-2 px-3">
            <h3 className="font-extrabold">{user}</h3>
            <div className="flex items-center space-x-2">
              {Array.from({ length: rating }, (_, index) => (
                <Star key={index} fill="#FFE311" className='w-5 h-5' strokeWidth={0} />
              ))}
            </div>
            <p className="my-1 text-sm text-justify line-clamp-3">{comment}</p>
          </div>
        </div>
      </div>
    </>
  );
}
