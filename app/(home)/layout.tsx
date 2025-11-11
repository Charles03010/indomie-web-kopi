import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-linear-to-t to-[#FFF5EF] from-[#FAF7F5] bg-no-repeat">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
