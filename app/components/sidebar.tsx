'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarLink = [
  { name: 'Overview', href: '/overview' },
  { name: 'Configurations', href: '/configurations' },
  { name: 'Advertisement', href: '/advertisement' },
  { name: 'Settings', href: '/settings' },
  { name: 'Logout', href: '/logout' },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-90 border-r px-5 py-10 min-h-screen border-(--dashboard-border)">
      <div className="flex items-center justify-start">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className=""
        />
        <h2 className="text-(--dashboard-text) text-2xl m-4">Dashboard</h2>
      </div>
      <div className="flex items-center mt-10 justify-start">
        <Image
          src="/images/upload/cafe1.png"
          alt="Logo"
          width={70}
          height={70}
          className="rounded-xl aspect-square object-cover"
        />
        <h2 className="text-(--dashboard-text) m-4 font-light">
          Kafe Enny Itje Sela putri megawati
        </h2>
      </div>
      <div className="flex flex-col mt-10">
        {SidebarLink.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={
              'block w-full py-3 px-4 rounded-lg hover:bg-(--head-text) transition-colors' +
              (link.name === 'Logout' ? ' text-red-700' : ' text-(--dashboard-text)') +
              (pathname === link.href ? ' font-extrabold' : '') 
            }
          >
            {link.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
