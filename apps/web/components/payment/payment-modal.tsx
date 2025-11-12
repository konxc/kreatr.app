'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreditCard, Zap, Check, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const creditPackages = [
  {
    id: 'PACKAGE_50',
    credits: 50,
    price: 50000,
    popular: false,
    features: ['AI Brainstorm: 10x', 'Content Generator: 5x', 'TikTok Analyzer: 3x'],
  },
  {
    id: 'PACKAGE_150',
    credits: 150,
    price: 150000,
    popular: true,
    bonus: 10,
    features: ['AI Brainstorm: 30x', 'Content Generator: 15x', 'TikTok Analyzer: 10x', '+10 Bonus Credits'],
  },
  {
    id: 'PACKAGE_500',
    credits: 500,
    price: 500000,
    popular: false,
    bonus: 50,
    features: ['AI Brainstorm: 100x', 'Content Generator: 50x', 'TikTok Analyzer: 33x', '+50 Bonus Credits'],
  },
]

export function PaymentModal({ open, onClose, onSuccess }: PaymentModalProps) {
  const { toast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1])
  const [isProcessing, setIsProcessing] = useState(false)

  const createPaymentMutation = trpc.payment.createPayment.useMutation({
    onSuccess: (data) => {
      // Redirect to Midtrans payment page
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        toast({
          title: 'Payment Created',
          description: 'Redirecting to payment page...',
        })
      }
    },
    onError: (error) => {
      setIsProcessing(false)
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handlePurchase = () => {
    setIsProcessing(true)
    createPaymentMutation.mutate({
      creditAmount: selectedPackage.credits + (selectedPackage.bonus || 0),
      packageId: selectedPackage.id,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Purchase AI Credits</DialogTitle>
          <p className="text-gray-600">Choose a package to power your content creation</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {creditPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedPackage.id === pkg.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {pkg.credits}
                  {pkg.bonus && (
                    <span className="text-lg text-green-600"> +{pkg.bonus}</span>
                  )}
                </p>
                <p className="text-sm text-gray-600">credits</p>
              </div>

              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-purple-600">
                  {formatPrice(pkg.price)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPrice(pkg.price / pkg.credits)}/credit
                </p>
              </div>

              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {selectedPackage.id === pkg.id && (
                <div className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-900 mb-3">Accepted Payment Methods:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">💳 Credit Card</Badge>
            <Badge variant="outline">🏦 Bank Transfer</Badge>
            <Badge variant="outline">📱 GoPay</Badge>
            <Badge variant="outline">🛍️ ShopeePay</Badge>
            <Badge variant="outline">📲 QRIS</Badge>
          </div>
        </div>

        {/* Selected Package Summary */}
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">You're purchasing</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPackage.credits}
                {selectedPackage.bonus && (
                  <span className="text-lg text-green-600"> +{selectedPackage.bonus}</span>
                )}{' '}
                Credits
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(selectedPackage.price)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Secure payment powered by Midtrans. Your payment information is encrypted and secure.
        </p>
      </DialogContent>
    </Dialog>
  )
}
