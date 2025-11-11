import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login - kreatr.app',
  description: 'Login ke akun kreatr.app Anda',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
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
            AI-Powered Social Media Lab
          </h2>
          
          <p className="text-xl text-white/90">
            Tempat ide berevolusi menjadi pengaruh
          </p>

          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Content Generator</h3>
                <p className="text-white/80 text-sm">Generate ide, caption, dan visual dengan AI</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Smart Scheduler</h3>
                <p className="text-white/80 text-sm">Auto-posting ke TikTok, Instagram, dan X</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-white/80 text-sm">Workspace kolaboratif seperti Notion</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-sm text-white/70">
              "kreatr.app menghemat 3 jam waktu saya setiap hari untuk riset dan membuat konten!"
            </p>
            <p className="text-sm font-semibold mt-2">— Sarah, Content Creator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
