'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const errorMessage = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-8">
            {errorMessage || 'There was an issue processing your payment'}
          </p>

          {/* Error Details */}
          {orderId && (
            <div className="bg-red-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-900">{orderId}</p>
            </div>
          )}

          {/* Common Issues */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Common Issues
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <p>Insufficient balance in your account</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <p>Payment was cancelled or timed out</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <p>Card details were incorrect</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <p>Bank declined the transaction</p>
              </div>
            </div>
          </div>

          {/* What to Do */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">What You Can Do</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Try Again</p>
                  <p className="text-sm text-gray-600">
                    Double-check your payment details and try again
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Use Different Payment Method</p>
                  <p className="text-sm text-gray-600">
                    Try using a different card or payment method
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-600">
                    If the issue persists, contact our support team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/dashboard/credits" className="flex-1">
              <Button className="w-full" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <a
              href="mailto:support@kreatr.app"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
