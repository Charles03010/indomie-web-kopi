import Image from 'next/image';
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className="bg-white px-5 py-10">
      <div className="flex items-center justify-between">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="ml-4"
        />
        <div className="flex mr-10 text-(--head-text) text-lg items-center justify-between w-1/4 font-medium">
          <Link href="#">FAQ</Link>
          <Link href="#">Terms and regulations</Link>
          <Link href="#">About</Link>
        </div>
      </div>
      <hr className="my-4 border-(--divider-primary)" />
      <h5 className="text-(--head-text) ml-10 mt-10 font-medium">© 2025 UMKMin. All Rights Reserved.</h5>
    </footer>
  );
};
export default Footer;
