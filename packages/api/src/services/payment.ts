import Stripe from 'stripe'
import { prisma } from '@kreatr/database'
import { TRPCError } from '@trpc/server'

/**
 * Payment Service
 * Handles payment processing with Stripe and Midtrans
 */

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  popular?: boolean
  bonus?: number
}

export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: 10,
    currency: 'USD',
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 150,
    price: 25,
    currency: 'USD',
    popular: true,
    bonus: 10,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 500,
    price: 75,
    currency: 'USD',
    bonus: 50,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 1000,
    price: 140,
    currency: 'USD',
    bonus: 150,
  },
]

export class PaymentService {
  /**
   * Create Stripe checkout session
   */
  async createStripeCheckout(params: {
    userId: string
    packageId: string
    successUrl: string
    cancelUrl: string
  }) {
    try {
      const { userId, packageId, successUrl, cancelUrl } = params

      // Get package details
      const pkg = creditPackages.find((p) => p.id === packageId)
      if (!pkg) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found',
        })
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Calculate total credits (base + bonus)
      const totalCredits = pkg.credits + (pkg.bonus || 0)

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: pkg.currency.toLowerCase(),
              product_data: {
                name: pkg.name,
                description: `${totalCredits} AI Credits${
                  pkg.bonus ? ` (${pkg.credits} + ${pkg.bonus} bonus)` : ''
                }`,
                images: ['https://kreatr.app/images/credits-icon.png'],
              },
              unit_amount: pkg.price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          packageId,
          credits: totalCredits.toString(),
        },
      })

      return {
        sessionId: session.id,
        url: session.url,
      }
    } catch (error) {
      console.error('[Stripe] Create checkout error:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create payment transaction',
        cause: error,
      })
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderId: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/${orderId}/status`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(this.config.serverKey + ':').toString('base64')}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.status_message || 'Failed to get transaction status')
      }

      const data = await response.json()

      return {
        orderId: data.order_id,
        transactionStatus: data.transaction_status,
        fraudStatus: data.fraud_status,
        paymentType: data.payment_type,
        grossAmount: data.gross_amount,
      }
    } catch (error) {
      console.error('[Midtrans] Get status error:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get transaction status',
        cause: error,
      })
    }
  }

  /**
   * Verify notification signature
   */
  verifySignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string): boolean {
    const crypto = require('crypto')
    const hash = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${this.config.serverKey}`)
      .digest('hex')

    return hash === signatureKey
  }

  /**
   * Cancel transaction
   */
  async cancelTransaction(orderId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/v2/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(this.config.serverKey + ':').toString('base64')}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.status_message || 'Failed to cancel transaction')
      }

      return await response.json()
    } catch (error) {
      console.error('[Midtrans] Cancel transaction error:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to cancel transaction',
        cause: error,
      })
    }
  }

  /**
   * Get client key for frontend
   */
  getClientKey(): string {
    return this.config.clientKey
  }

  /**
   * Check if production mode
   */
  isProduction(): boolean {
    return this.config.isProduction
  }
}

// Export singleton instance
export const midtransPayment = new MidtransPaymentService()
 ${credits} credits via Stripe`,
        balance: newBalance,
      },
    })

    console.log(`[Payment] Credits added successfully. New balance: ${newBalance}`)

    // TODO: Send confirmation email
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Credits Purchased Successfully',
    //   template: 'credit-purchase',
    //   data: { credits: creditsToAdd, balance: newBalance },
    // })
  }

  /**
   * Create Midtrans transaction (for Indonesian users)
   */
  async createMidtransTransaction(params: {
    userId: string
    packageId: string
  }) {
    const { userId, packageId } = params

    // Get package details
    const pkg = creditPackages.find((p) => p.id === packageId)
    if (!pkg) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Package not found',
      })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    // Calculate total credits
    const totalCredits = pkg.credits + (pkg.bonus || 0)

    // Convert USD to IDR (approximate rate: 1 USD = 15,000 IDR)
    const priceIDR = pkg.price * 15000

    // Create order ID
    const orderId = `ORDER-${Date.now()}-${userId.slice(0, 8)}`

    // TODO: Implement Midtrans Snap API
    // const midtransClient = new midtrans.Snap({
    //   isProduction: process.env.NODE_ENV === 'production',
    //   serverKey: process.env.MIDTRANS_SERVER_KEY,
    //   clientKey: process.env.MIDTRANS_CLIENT_KEY,
    // })

    // const transaction = await midtransClient.createTransaction({
    //   transaction_details: {
    //     order_id: orderId,
    //     gross_amount: priceIDR,
    //   },
    //   customer_details: {
    //     email: user.email,
    //     first_name: user.name,
    //   },
    //   item_details: [
    //     {
    //       id: packageId,
    //       name: pkg.name,
    //       price: priceIDR,
    //       quantity: 1,
    //     },
    //   ],
    // })

    // For now, return mock data
    return {
      orderId,
      token: 'mock-midtrans-token',
      redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${orderId}`,
    }
  }

  /**
   * Handle Midtrans webhook
   */
  async handleMidtransWebhook(notification: any) {
    console.log('[Payment] Midtrans webhook:', notification)

    const { order_id, transaction_status, fraud_status } = notification

    // Verify signature
    // const isValid = this.verifyMidtransSignature(notification)
    // if (!isValid) {
    //   throw new Error('Invalid signature')
    // }

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept') {
        // Payment successful
        console.log(`[Payment] Midtrans payment successful: ${order_id}`)
        // TODO: Add credits to user account
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      // Payment failed
      console.log(`[Payment] Midtrans payment failed: ${order_id}`)
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId: string, limit: number = 20) {
    const transactions = await prisma.creditTransaction.findMany({
      where: {
        userId,
        type: 'PURCHASE',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return transactions
  }

  /**
   * Generate invoice
   */
  async generateInvoice(transactionId: string) {
    const transaction = await prisma.creditTransaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
      },
    })

    if (!transaction) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Transaction not found',
      })
    }

    // Generate invoice data
    return {
      invoiceNumber: `INV-${transaction.id.slice(0, 8).toUpperCase()}`,
      date: transaction.createdAt,
      customer: {
        name: transaction.user.name,
        email: transaction.user.email,
      },
      items: [
        {
          description: transaction.description,
          quantity: 1,
          amount: transaction.amount,
        },
      ],
      total: transaction.amount,
    }
  }

  /**
   * Request refund
   */
  async requestRefund(params: {
    userId: string
    transactionId: string
    reason: string
  }) {
    const { userId, transactionId, reason } = params

    const transaction = await prisma.creditTransaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction || transaction.userId !== userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Transaction not found',
      })
    }

    if (transaction.type !== 'PURCHASE') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Only purchases can be refunded',
      })
    }

    // Check if refund is within 30 days
    const daysSincePurchase = Math.floor(
      (Date.now() - transaction.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSincePurchase > 30) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Refund period has expired (30 days)',
      })
    }

    // TODO: Process refund with payment provider
    // For now, just log
    console.log(`[Payment] Refund requested for transaction ${transactionId}: ${reason}`)

    return {
      success: true,
      message: 'Refund request submitted. We will process it within 3-5 business days.',
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()
