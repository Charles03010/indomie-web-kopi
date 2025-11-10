import Image from 'next/image';
import Link from 'next/link';
const Navbar = () => {
  return (
    <header className="w-3/4 z-2 sticky top-10 mt-10 mx-auto rounded-full flex items-center justify-between px-8 py-3 bg-linear-to-r to-[#1C2022] from-[#352B1B]">
      <Image src="/images/logo.png" className='ml-4' alt="Logo" width={50} height={50} />
      <div className="flex items-center justify-between w-sm">
        <Link href="#recomend" className="text-(--primary-white) mx-4">
          Rekomendasi
        </Link>
        <Link href="#search" className="text-(--primary-white) mx-4">
          Cari
        </Link>
        <Link href="#join" className="text-(--primary-white) mx-4">
          Gabung UMKM
        </Link>
      </div>
      <Link href="/login" className="text-(--primary-white) mx-4">
        Login
      </Link>
    </header>
  );
};
export default Navbar;
