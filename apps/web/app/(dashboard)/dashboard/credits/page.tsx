'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Zap, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'
import { PaymentModal } from '@/components/payment/payment-modal'

export default function CreditsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  
  const { data: balance, isLoading, refetch } = trpc.credit.getBalance.useQuery()
  const { data: transactions, refetch: refetchTransactions } = trpc.credit.getTransactions.useQuery({ limit: 10 })
  const { data: paymentHistory } = trpc.payment.getPaymentHistory.useQuery({ limit: 5 })

  // Handle payment status from redirect
  useEffect(() => {
    const status = searchParams.get('status')
    const orderId = searchParams.get('order_id')

    if (status === 'success') {
      toast({
        title: 'Payment Successful! 🎉',
        description: 'Your credits have been added to your account',
      })
      refetch()
      refetchTransactions()
    } else if (status === 'error') {
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment',
        variant: 'destructive',
      })
    }
  }, [searchParams, toast, refetch, refetchTransactions])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-purple-600" />
          Credits & Billing
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your AI credits and billing information
        </p>
      </div>

      {/* Current Balance */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Balance</p>
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <p className="text-4xl font-bold text-gray-900">
                {isLoading ? '...' : balance?.balance || 0}
              </p>
              <span className="text-lg text-gray-600">credits</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {balance?.usedThisMonth || 0}
            </p>
            <p className="text-xs text-gray-500">credits used</p>
          </div>
        </div>
      </Card>

      {/* Buy Credits Button */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Need More Credits?</h2>
            <p className="text-gray-600">
              Purchase AI credits to unlock unlimited content generation
            </p>
          </div>
          <Button size="lg" onClick={() => setPaymentModalOpen(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
        </div>
      </Card>

      {/* Recent Payments */}
      {paymentHistory && paymentHistory.payments.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Payments</h2>
          <div className="space-y-4">
            {paymentHistory.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      payment.status === 'SUCCESS'
                        ? 'bg-green-100'
                        : payment.status === 'PENDING'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {payment.status === 'SUCCESS' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : payment.status === 'PENDING' ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.creditAmount} Credits
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(payment.amount)}
                  </p>
                  <Badge
                    variant={
                      payment.status === 'SUCCESS'
                        ? 'default'
                        : payment.status === 'PENDING'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-xs"
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Purchased</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {balance?.totalPurchased || 0}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Total Used</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {balance?.totalUsed || 0}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Avg. per Day</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {balance?.avgPerDay || 0}
          </p>
        </Card>
      </div>

      {/* Credit Usage History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Credit Usage History</h2>
        <div className="space-y-4">
          {transactions && transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'PURCHASE'
                        ? 'bg-green-100'
                        : tx.type === 'USAGE'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <Zap
                      className={`w-5 h-5 ${
                        tx.type === 'PURCHASE'
                          ? 'text-green-600'
                          : tx.type === 'USAGE'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount}
                  </p>
                  <p className="text-sm text-gray-600">Balance: {tx.balance}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No credit usage yet</p>
              <p className="text-sm mt-1">Start using AI features to see your history</p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => {
          setPaymentModalOpen(false)
          refetch()
          refetchTransactions()
        }}
      />
    </div>
  )
}
