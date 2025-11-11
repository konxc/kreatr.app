import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Daftar - kreatr.app',
  description: 'Buat akun kreatr.app dan dapatkan 50 kredit gratis',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <RegisterForm />
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-orange-400 p-12 items-center justify-center">
        <div className="max-w-md text-white space-y-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <span className="text-2xl font-bold">kreatr.app</span>
            </div>
          </Link>

          <h2 className="text-4xl font-bold">
            Mulai Perjalanan Kreativitas Anda
          </h2>
          
          <p className="text-xl text-white/90">
            Bergabung dengan 1000+ kreator yang sudah berkembang bersama kreatr.app
          </p>

          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold">50 Kredit Gratis</h3>
                <p className="text-white/80 text-sm">Langsung bisa generate konten dengan AI</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold">Setup Cepat</h3>
                <p className="text-white/80 text-sm">Siap dalam 2 menit, tanpa kartu kredit</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">🚀</span>
              </div>
              <div>
                <h3 className="font-semibold">Gratis Selamanya</h3>
                <p className="text-white/80 text-sm">Fitur dasar gratis, upgrade kapan saja</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-white/70">Kreator</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/70">Konten</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-white/70">Puas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
