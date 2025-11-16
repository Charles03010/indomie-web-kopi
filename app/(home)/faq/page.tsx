import Accordion from '@/app/components/accordion';

// Dummy data for the FAQ
const faqData = [
  {
    question: 'Apa itu UMKMin?',
    answer:
      'UMKMin adalah sebuah platform digital yang didedikasikan untuk membantu Usaha Mikro, Kecil, dan Menengah (UMKM), khususnya yang bergerak di bidang kopi, untuk berkembang. Kami menyediakan sarana promosi, manajemen usaha, dan jembatan antara pemilik UMKM dengan para penikmat kopi.',
  },
  {
    question: 'Bagaimana cara mendaftarkan UMKM kopi saya di UMKMin?',
    answer:
      'Anda dapat mendaftarkan UMKM Anda dengan menekan tombol "Gabung UMKM" atau "Daftar" di halaman utama. Anda akan diminta untuk membuat akun dan mengisi data-data terkait UMKM Anda, seperti nama, deskripsi, alamat, dan foto.',
  },
  {
    question: 'Apakah ada biaya untuk bergabung dengan UMKMin?',
    answer:
      'Pendaftaran dasar untuk UMKM di platform UMKMin saat ini gratis. Kami mungkin menawarkan fitur-fitur premium berbayar di masa depan untuk membantu promosi dan manajemen yang lebih lanjut, namun fitur dasar akan tetap dapat diakses.',
  },
  {
    question: 'Bagaimana cara menemukan kedai kopi terdekat?',
    answer:
      'Anda dapat menggunakan fitur "Cari" di halaman utama kami. Masukkan lokasi Anda atau nama kedai kopi yang Anda cari, dan sistem kami akan menampilkan rekomendasi kedai kopi terdekat beserta informasi lokasinya.',
  },
  {
    question: 'Saya pelanggan, bagaimana saya bisa memberikan ulasan?',
    answer:
      'Anda dapat mengunjungi halaman detail dari kedai kopi yang ingin Anda ulas. Di sana, akan ada bagian "Ulasan" di mana Anda dapat memberikan rating bintang dan menulis komentar mengenai pengalaman Anda.',
  },
  {
    question: 'Bagaimana UMKMin menentukan rekomendasi kedai kopi?',
    answer:
      'Rekomendasi kami didasarkan pada berbagai faktor, termasuk popularitas, rating dari pengguna lain, jarak dari lokasi Anda (jika Anda membagikan lokasi), dan keaktifan UMKM tersebut di platform kami.',
  },
];

export default function FAQPage() {
  return (
    <section className="bg-(--primary-bg) py-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-5xl font-extrabold text-(--head-text) text-center mb-12">
          Frequently Asked Questions
        </h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {faqData.map((item, index) => (
            <Accordion key={index} title={item.question}>
              <p>{item.answer}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}