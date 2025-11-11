import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            AI-Powered Social Media Lab
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Laboratorium Digital untuk{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Ide Konten Tanpa Batas
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform AI yang membantu kreator konten, marketer, dan UMKM menemukan ide, 
            membuat konten, dan mempublikasikannya secara otomatis — semuanya dalam satu tempat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-6 text-lg">
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Lihat Demo
              </Button>
            </Link>
          </div>

          {/* Microcopy */}
          <p className="text-sm text-gray-500">
            ✨ Gratis selamanya untuk fitur dasar • Tanpa kartu kredit • Siap dalam 2 menit
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Kreator Konten Menghadapi Tantangan yang Sama Setiap Hari
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Tapi bagaimana jika ada cara yang lebih baik?
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3">Kehabisan Ide Konten</h3>
              <p className="text-gray-600">
                Setiap hari terasa seperti memeras otak. Apa yang harus diposting? 
                Topik apa yang sedang tren? Audiens suka yang mana?
              </p>
            </div>

            {/* Problem 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">😓</div>
              <h3 className="text-xl font-bold mb-3">Burnout dan Tidak Konsisten</h3>
              <p className="text-gray-600">
                Membuat konten setiap hari itu melelahkan. Akibatnya, jadwal posting berantakan, 
                engagement turun, dan algoritma tidak berpihak.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📉</div>
              <h3 className="text-xl font-bold mb-3">Algoritma Terus Berubah</h3>
              <p className="text-gray-600">
                Apa yang viral kemarin belum tentu berhasil hari ini. Sulit mengikuti 
                perubahan platform tanpa data yang jelas.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🔀</div>
              <h3 className="text-xl font-bold mb-3">Terlalu Banyak Tools</h3>
              <p className="text-gray-600">
                Riset di satu aplikasi, desain di aplikasi lain, jadwal posting di tempat berbeda. 
                Prosesnya lambat dan membingungkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-purple-600 to-orange-500 rounded-3xl my-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Kenalkan: kreatr.app
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Social Media Lab yang Bekerja untuk Anda
          </p>
          <p className="text-lg opacity-80 mb-8">
            Bayangkan sebuah ruang kerja digital di mana Anda bisa menemukan ide konten, 
            membuat caption dan visual dengan AI, menjadwalkan posting otomatis, 
            melihat performa real-time, dan berkolaborasi dengan tim — semuanya dalam satu platform.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg">
              Mulai Eksperimen Hari Ini
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Semua yang Anda butuhkan untuk konten yang konsisten dan berkualitas
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🧪</div>
              <h3 className="text-xl font-bold mb-3">AI Content Lab</h3>
              <p className="text-gray-600 mb-4">
                Masukkan topik, pilih persona audiens, dan dapatkan puluhan ide konten yang relevan dan siap dieksekusi.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Trend Discovery Engine
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Persona-Based Ideation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Content Remix
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3">Smart Scheduler</h3>
              <p className="text-gray-600 mb-4">
                Posting konten di waktu yang tepat, tanpa harus online 24/7. Atur jadwal dan biarkan AI yang mengelola.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Auto-Posting Multi-Platform
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Best Time to Post
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Content Calendar View
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Insight Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Lihat performa setiap postingan, pelajari pola engagement, dan dapatkan saran konten berikutnya.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Performance Analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  AI Recommendations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Competitor Benchmarking
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Collaboration Space</h3>
              <p className="text-gray-600 mb-4">
                Undang tim untuk memberikan feedback, approve konten, atau brainstorming ide baru bersama.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Shared Workspace
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Comment & Approval Flow
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Role Management
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Boost Credit System</h3>
              <p className="text-gray-600 mb-4">
                Gunakan Boost Credit untuk unlock fitur premium seperti AI visual generation dan advanced analytics.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Flexible Credits
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Premium Features
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  No Subscription Lock-in
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">AI Generator</h3>
              <p className="text-gray-600 mb-4">
                Generate caption, hashtag, visual, bahkan voice-over dengan AI yang paham brand voice Anda.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Caption Generator
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Hashtag Research
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Visual Creation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl my-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Pilih Paket yang Sesuai
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Mulai gratis, upgrade kapan saja tanpa ribet
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-600 text-sm mb-4">Untuk Memulai</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Gratis</span>
                  <span className="text-gray-600"> selamanya</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">10 AI-generated ideas/bulan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">5 scheduled posts/bulan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">1 social account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">50 Boost Credits/bulan</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full" variant="outline">
                  Mulai Gratis
                </Button>
              </Link>
            </div>

            {/* Boost Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-purple-600 shadow-xl relative scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Paling Populer
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Boost</h3>
                <p className="text-gray-600 text-sm mb-4">Untuk Berkembang</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Rp 199.000</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Unlimited AI ideas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">50 scheduled posts/bulan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">5 social accounts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Collaboration (3 members)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">500 Boost Credits/bulan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Priority support</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                  Coba 14 Hari Gratis
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-600 text-sm mb-4">Untuk Profesional</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Rp 499.000</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Semua fitur Boost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Unlimited posts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Unlimited accounts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Unlimited collaboration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">2000 Boost Credits/bulan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">White-label reporting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-600">API access</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full" variant="outline">
                  Hubungi Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Apa Kata Kreator yang Sudah Mencoba?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4">👩‍💼</div>
              <p className="text-gray-700 mb-4 italic">
                &ldquo;Dulu saya butuh 3 jam untuk riset dan bikin konten. Sekarang cukup 30 menit. 
                kreatr.app benar-benar game changer.&rdquo;
              </p>
              <div>
                <p className="font-semibold">Rina</p>
                <p className="text-sm text-gray-600">Content Creator & Digital Marketer</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4">👨‍💼</div>
              <p className="text-gray-700 mb-4 italic">
                &ldquo;Sebagai UMKM, kami tidak punya tim khusus untuk social media. 
                kreatr.app seperti punya asisten marketing yang kerja 24/7.&rdquo;
              </p>
              <div>
                <p className="font-semibold">Budi</p>
                <p className="text-sm text-gray-600">Founder Kopi Nusantara</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-5xl mb-4">👩‍🎨</div>
              <p className="text-gray-700 mb-4 italic">
                &ldquo;Fitur kolaborasinya memudahkan saya dan tim untuk approve konten klien 
                tanpa bolak-balik chat. Efisien banget!&rdquo;
              </p>
              <div>
                <p className="font-semibold">Sarah</p>
                <p className="text-sm text-gray-600">Creative Agency Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap untuk Konten yang Lebih Konsisten?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Bergabunglah dengan 1000+ kreator yang sudah berkembang bersama kreatr.app
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-6 text-lg">
              Mulai Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 kreatr.app. Dibuat dengan ❤️ untuk kreator Indonesia dan global.</p>
            <p className="text-sm">Kreativitas tanpa batas. Konten tanpa drama.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
