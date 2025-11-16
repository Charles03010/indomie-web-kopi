// app/(home)/terms/page.tsx

export default function TermsPage() {
  return (
    <section className="bg-(--primary-bg) py-20 min-h-[calc(100vh-200px)]">
      <div className="max-w-3xl mx-auto px-4 text-(--head-text)">
        <h1 className="text-5xl font-extrabold text-center mb-12">
          Syarat dan Ketentuan
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-bold">1. Pendahuluan</h2>
            <p className="font-light leading-relaxed">
              Selamat datang di UMKMin. Syarat dan Ketentuan ("Ketentuan") ini
              mengatur penggunaan Anda atas platform, situs web, dan layanan
              kami ("Layanan"). Dengan mengakses atau menggunakan Layanan kami,
              Anda setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju
              dengan Ketentuan ini, Anda tidak boleh menggunakan Layanan kami.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">2. Penggunaan Layanan</h2>
            <p className="font-light leading-relaxed">
              Anda setuju untuk menggunakan Layanan hanya untuk tujuan yang sah
              dan sesuai dengan Ketentuan ini. Anda bertanggung jawab penuh atas
              semua konten yang Anda unggah, kirim, atau tampilkan ("Konten
              Pengguna") di platform kami.
            </p>
            <ul className="list-disc list-inside font-light pl-4 space-y-1">
              <li>
                Anda tidak boleh menggunakan Layanan untuk aktivitas ilegal atau
                melanggar hukum.
              </li>
              <li>
                Anda tidak boleh mengunggah Konten Pengguna yang melanggar hak
                cipta, merek dagang, atau hak kekayaan intelektual lainnya.
              </li>
              <li>
                Anda tidak boleh mencoba mengganggu keamanan atau integritas
                Layanan.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">3. Akun UMKM dan Pelanggan</h2>
            <p className="font-light leading-relaxed">
              Untuk mendaftar sebagai pemilik UMKM atau pelanggan, Anda harus
              memberikan informasi yang akurat dan lengkap. Anda bertanggung
              jawab untuk menjaga kerahasiaan kata sandi akun Anda dan atas semua
              aktivitas yang terjadi di bawah akun Anda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">4. Konten dan Ulasan</h2>
            <p className="font-light leading-relaxed">
              Pemilik UMKM bertanggung jawab atas keakuratan informasi yang
              diberikan (menu, harga, foto, deskripsi). Pelanggan dapat
              memberikan ulasan dan rating. Ulasan harus jujur, tidak
              menyesatkan, dan tidak mengandung ujaran kebencian. UMKMin berhak
              menghapus ulasan atau konten yang dianggap melanggar Ketentuan ini
              tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">5. Pembatasan Tanggung Jawab</h2>
            <p className="font-light leading-relaxed">
              Layanan UMKMin disediakan "sebagaimana adanya". Kami tidak membuat
              jaminan apa pun terkait keakuratan, kelengkapan, atau keandalan
              konten yang disediakan oleh pengguna (UMKM atau pelanggan). UMKMin
              tidak bertanggung jawab atas kerugian atau kerusakan apa pun yang
              timbul dari penggunaan Anda atas Layanan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-bold">6. Perubahan Ketentuan</h2>
            <p className="font-light leading-relaxed">
              Kami dapat mengubah Ketentuan ini dari waktu ke waktu. Jika kami
              melakukan perubahan materi, kami akan memberi tahu Anda melalui
              email atau pemberitahuan di platform kami. Dengan terus
              menggunakan Layanan setelah perubahan tersebut, Anda setuju untuk
              terikat oleh Ketentuan yang telah direvisi.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}