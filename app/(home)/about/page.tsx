// app/(home)/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="bg-(--primary-bg) py-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-4xl mx-auto px-4 text-(--head-text)">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Tentang UMKMin
          </h1>
          <p className="text-xl lg:text-2xl font-light">
            Menghubungkan Anda dengan cita rasa kopi lokal terbaik.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold border-b border-(--divider-primary) pb-2">
              Misi Kami
            </h2>
            <p className="font-light leading-relaxed text-lg">
              Di UMKMin, kami percaya bahwa setiap cangkir kopi memiliki cerita.
              Misi kami adalah untuk menjadi jembatan antara para penikmat kopi
              dengan Usaha Mikro, Kecil, dan Menengah (UMKM) kopi lokal yang
              luar biasa di seluruh Indonesia. Kami ingin "Jelajahi Dunia Mu
              dalam Secangkir Kopi" bukan hanya slogan, tapi sebuah pengalaman
              yang nyata.
            </p>
            <p className="font-light leading-relaxed text-lg">
              Kami berdedikasi untuk memberdayakan UMKM lokal dengan memberi
              mereka platform untuk bersinar, menjangkau audiens yang lebih
              luas, dan mengelola bisnis mereka dengan lebih efisien.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold border-b border-(--divider-primary) pb-2">
              Apa yang Kami Tawarkan?
            </h2>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-(--secondary-text)">
                Untuk Penikmat Kopi
              </h3>
              <p className="font-light leading-relaxed text-lg">
                Bingung mau ngopi di mana? Kami hadir untuk Anda. Jelajahi
                berbagai kedai kopi, temukan tempat-tempat baru yang tersembunyi,
                baca ulasan jujur dari komunitas, dan lihat menu sebelum Anda
                berangkat. Fitur pencarian kami membantu Anda menemukan kopi yang
                tepat sesuai keinginan Anda.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-2xl font-semibold text-(--secondary-text)">
                Untuk Pemilik UMKM
              </h3>
              <p className="font-light leading-relaxed text-lg">
                UMKMin adalah partner digital Anda. Dengan bergabung bersama
                kami, Anda mendapatkan dashboard khusus untuk mengelola profil
                kedai Anda, mengunggah menu dan foto, serta meluncurkan promosi.
                Jangkau ribuan penikmat kopi yang sedang mencari cita rasa
                otentik seperti yang Anda tawarkan.
              </p>
            </div>
          </section>

          <section className="text-center pt-6">
            <h2 className="text-3xl font-bold mb-4">
              Bergabunglah dengan Komunitas Kami
            </h2>
            <p className="font-light leading-relaxed text-lg mb-8">
              Baik Anda seorang pemilik UMKM yang ingin berkembang atau seorang
              penikmat kopi yang haus akan petualangan rasa baru, kami mengundang
              Anda untuk menjadi bagian dari UMKMin.
            </p>
            <Link
              href="/register"
              className="
                inline-block 
                px-8 py-3 rounded-full 
                bg-(--button-primary) text-(--primary-white) 
                text-lg font-medium hover:opacity-90 transition-opacity
              "
            >
              Daftar Sekarang
            </Link>
          </section>
        </div>
      </div>
    </section>
  );
}