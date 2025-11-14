'use client'; 
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User as UserIcon } from 'lucide-react'; 
import { useState, useEffect } from 'react'; 
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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
      
      <div className="hidden md:flex items-center relative">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            >
              <UserIcon />              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon />
              )}

            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <Link href="/dashboard/overview" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login" 
            className="
              text-(--primary-white) 
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
        )}
      </div>
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
        
        {user ? (
          <>
            <Link href="/dashboard/overview" className="text-(--primary-white) hover:text-gray-200" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link href="/logout" className="text-(--primary-white) hover:text-gray-200" onClick={() => setIsOpen(false)}>
              Logout
            </Link>
          </>
        ) : (
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
        )}
      </nav>
    </header>
  );
};
export default Navbar;