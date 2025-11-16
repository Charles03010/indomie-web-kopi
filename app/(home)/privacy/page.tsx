// app/(home)/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <section className="bg-(--primary-bg) py-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-3xl mx-auto px-4 text-(--head-text)">
        <h1 className="text-5xl font-extrabold text-center mb-12">
          Kebijakan Privasi
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-bold">1. Informasi yang Kami Kumpulkan</h2>
            <p className="font-light leading-relaxed">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami
              saat Anda mendaftar, seperti nama, alamat email, dan foto profil.
              Saat Anda mendaftar sebagai pemilik UMKM, kami juga mengumpulkan
              informasi terkait bisnis Anda, termasuk nama UMKM, alamat,
              deskripsi, dan foto-foto yang Anda unggah.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p className="font-light leading-relaxed">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc list-inside font-light pl-4 space-y-1">
              <li>Menyediakan, memelihara, dan meningkatkan Layanan kami.</li>
              <li>Mempersonalisasi pengalaman Anda di platform kami.</li>
              <li>
                Menampilkan profil Anda dan ulasan Anda kepada pengguna lain.
              </li>
              <li>
                Menampilkan informasi UMKM Anda kepada calon pelanggan.
              </li>
              <li>
                Mengirimkan komunikasi terkait layanan, seperti pembaruan akun
                atau pemberitahuan keamanan.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">3. Berbagi Informasi</h2>
            <p className="font-light leading-relaxed">
              Kami tidak akan membagikan informasi pribadi Anda kepada pihak
              ketiga tanpa persetujuan Anda, kecuali dalam situasi berikut:
            </p>
            <ul className="list-disc list-inside font-light pl-4 space-y-1">
              <li>
                Informasi yang bersifat publik, seperti nama pengguna, foto
                profil, dan ulasan Anda, akan dapat dilihat oleh pengguna lain.
              </li>
              <li>
                Informasi UMKM (nama, alamat, menu) dirancang untuk dibagikan
                secara publik.
              </li>
              <li>
                Jika diwajibkan oleh hukum atau untuk menanggapi proses hukum
                yang sah.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">4. Keamanan Data</h2>
            <p className="font-light leading-relaxed">
              Kami mengambil langkah-langkah yang wajar untuk melindungi informasi
              Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tidak sah.
              Ini termasuk penggunaan layanan otentikasi yang aman dan penyimpanan
              data di server yang terproteksi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">5. Kontrol Anda</h2>
            <p className="font-light leading-relaxed">
              Anda dapat meninjau dan memperbarui informasi akun Anda kapan saja
              melalui halaman "Account Settings" (untuk pelanggan) atau
              "Dashboard Settings" (untuk UMKM). Anda juga dapat menghapus akun
              Anda, yang akan menghapus data pribadi Anda dari sistem kami
              sesuai dengan Ketentuan Layanan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">6. Perubahan Kebijakan Ini</h2>
            <p className="font-light leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Kami akan memberi tahu Anda tentang perubahan apa pun dengan
              memposting kebijakan baru di halaman ini.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}