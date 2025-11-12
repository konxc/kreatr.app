'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface OnboardingContextType {
  isOnboarding: boolean
  currentStep: number
  steps: OnboardingStep[]
  startOnboarding: () => void
  completeStep: (stepId: string) => void
  skipOnboarding: () => void
  nextStep: () => void
  previousStep: () => void
  progress: number
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to kreatr.app! 👋',
    description: 'Let\'s get you started with AI-powered content creation',
    completed: false,
  },
  {
    id: 'connect-social',
    title: 'Connect Social Media',
    description: 'Link your TikTok, Instagram, or Twitter account',
    completed: false,
  },
  {
    id: 'create-content',
    title: 'Create Your First Content',
    description: 'Use AI to generate your first post',
    completed: false,
  },
  {
    id: 'schedule-post',
    title: 'Schedule a Post',
    description: 'Plan your content calendar',
    completed: false,
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'Start creating amazing content',
    completed: false,
  },
]

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS)

  // Check if user needs onboarding
  useEffect(() => {
    if (session?.user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
      if (!hasCompletedOnboarding) {
        setIsOnboarding(true)
      }
    }
  }, [session])

  const startOnboarding = () => {
    setIsOnboarding(true)
    setCurrentStep(0)
    setSteps(ONBOARDING_STEPS)
  }

  const completeStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    )
  }

  const skipOnboarding = () => {
    setIsOnboarding(false)
    localStorage.setItem('onboarding_completed', 'true')
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      completeStep(steps[currentStep].id)
      setCurrentStep((prev) => prev + 1)
    } else {
      // Complete onboarding
      skipOnboarding()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        steps,
        startOnboarding,
        completeStep,
        skipOnboarding,
        nextStep,
        previousStep,
        progress,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
