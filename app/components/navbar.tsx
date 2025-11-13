'use client'; 
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; 
import { useState } from 'react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  
  const toggleMenu = () => { 
    setIsOpen(!isOpen);
  };

  const mobileMenuClasses = `
    md:hidden 
    absolute top-full left-0 right-0 
    bg-(--button-primary) 
    rounded-b-xl 
    shadow-lg 
    p-4 mt-1 
    flex flex-col space-y-4
    text-center
    overflow-hidden
    z-10  
    transition-all duration-500 ease-in-out 
    
    
    ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 p-0 m-0'} 
  `;

  return (
    <header className="
      w-11/12 md:w-3/4 
      z-20 sticky top-4 md:top-10 mx-auto 
      rounded-full flex items-center justify-between 
      px-4 py-2 md:px-8 md:py-3 
      bg-linear-to-r to-[#1C2022] from-[#352B1B] 
      shadow-xl  
    ">
      <Image src="/images/logo.png" className='ml-2 md:ml-4' alt="Logo" width={40} height={40} />
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="#recomend" className="text-(--primary-white) hover:text-gray-300 transition-colors">
          Rekomendasi
        </Link>
        <Link href="#search" className="text-(--primary-white) hover:text-gray-300 transition-colors">
          Cari
        </Link>
        <Link href="#join" className="text-(--primary-white) hover:text-gray-300 transition-colors">
          Gabung UMKM
        </Link>
      </nav>
      
      <Link 
        href="/login" 
        className="
          text-(--primary-white) 
          hidden md:block 
          mx-4 
          px-4 py-2 
          border border-(--primary-white) 
          rounded-full 
          hover:bg-white hover:text-black 
          transition-colors 
        "
      >
        Login
      </Link>
      
      <button 
        className="md:hidden text-(--primary-white) p-2 z-30" 
        onClick={toggleMenu} 
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} 
      </button>

      <nav 
        id="mobile-menu"
        className={mobileMenuClasses} 
      >
        <Link 
          href="#recomend" 
          className="text-(--primary-white) hover:text-gray-200 transition-colors"
          onClick={() => setIsOpen(false)} 
        >
          Rekomendasi
        </Link>
        <Link 
          href="#search" 
          className="text-(--primary-white) hover:text-gray-200 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Cari
        </Link>
        <Link 
          href="#join" 
          className="text-(--primary-white) hover:text-gray-200 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Gabung UMKM
        </Link>
        
        <hr className="border-gray-500 opacity-50" />
        
        <Link 
          href="/login" 
          className="
            text-(--button-secondary) 
            font-bold 
            px-4 py-2 
            border border-(--button-secondary) 
            rounded-full 
            hover:bg-(--button-secondary) hover:text-white 
            transition-colors 
          "
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
      </nav>
    </header>
  );
};
export default Navbar;