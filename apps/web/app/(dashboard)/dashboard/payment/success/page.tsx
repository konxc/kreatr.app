'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const { data: paymentStatus } = trpc.payment.getPaymentStatus.useQuery(
    { orderId: orderId || '' },
    { enabled: !!orderId }
  )

  useEffect(() => {
    // Redirect to credits page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/credits?status=success')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your credits have been added to your account
          </p>

          {/* Payment Details */}
          {paymentStatus && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {paymentStatus.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Credits Purchased</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    {paymentStatus.creditAmount} Credits
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(paymentStatus.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {paymentStatus.paymentType}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Creating Content</p>
                  <p className="text-sm text-gray-600">
                    Use AI Lab to generate ideas and content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Schedule Your Posts</p>
                  <p className="text-sm text-gray-600">
                    Plan your content calendar across platforms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Track Your Performance</p>
                  <p className="text-sm text-gray-600">
                    Monitor analytics and optimize your strategy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/dashboard/ai-lab" className="flex-1">
              <Button className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
            <Link href="/dashboard/credits" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                View Credits
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Redirecting to dashboard in 5 seconds...
          </p>
        </div>
      </Card>
    </div>
  )
}
