import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { DashboardNav } from '@/components/dashboard/nav'
import { DashboardHeader } from '@/components/dashboard/header'
import { OnboardingProvider } from '@/contexts/onboarding-context'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
        <OnboardingWizard />
      </div>
    </OnboardingProvider>
  )
}
