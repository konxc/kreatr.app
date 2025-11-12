import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { midtransPayment } from '../services/payment'

export const paymentRouter = router({
  // Get Midtrans client key
  getClientKey: protectedProcedure.query(() => {
    return {
      clientKey: midtransPayment.getClientKey(),
      isProduction: midtransPayment.isProduction(),
    }
  }),

  // Create payment for credit purchase
  createPayment: protectedProcedure
    .input(
      z.object({
        creditAmount: z.number().min(10).max(1000),
        packageId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { creditAmount, packageId } = input
      const user = ctx.session.user

      // Calculate price (IDR)
      // 1 credit = Rp 1,000
      const pricePerCredit = 1000
      const totalAmount = creditAmount * pricePerCredit

      // Generate unique order ID
      const orderId = `ORDER-${user.id.slice(0, 8)}-${Date.now()}`

      // Create payment transaction
      const transaction = await midtransPayment.createTransaction({
        orderId,
        amount: totalAmount,
        customerDetails: {
          firstName: user.name || 'User',
          email: user.email!,
        },
        itemDetails: [
          {
            id: packageId,
            name: `${creditAmount} AI Credits`,
            price: totalAmount,
            quantity: 1,
          },
        ],
      })

      // Save pending transaction to database
      await ctx.prisma.paymentTransaction.create({
        data: {
          orderId: transaction.orderId,
          userId: user.id,
          amount: totalAmount,
          creditAmount,
          status: 'PENDING',
          paymentMethod: 'midtrans',
          metadata: {
            token: transaction.token,
            redirectUrl: transaction.redirectUrl,
          },
        },
      })

      return {
        orderId: transaction.orderId,
        token: transaction.token,
        redirectUrl: transaction.redirectUrl,
        amount: totalAmount,
        credits: creditAmount,
      }
    }),

  // Get payment status
  getPaymentStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orderId } = input

      // Get from database
      const payment = await ctx.prisma.paymentTransaction.findUnique({
        where: { orderId },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      // Verify ownership
      if (payment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        })
      }

      // Get status from Midtrans
      const status = await midtransPayment.getTransactionStatus(orderId)

      return {
        orderId: payment.orderId,
        status: payment.status,
        amount: payment.amount,
        creditAmount: payment.creditAmount,
        createdAt: payment.createdAt,
        midtransStatus: status.transactionStatus,
        paymentType: status.paymentType,
      }
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input

      const payments = await ctx.prisma.paymentTransaction.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      })

      const total = await ctx.prisma.paymentTransaction.count({
        where: {
          userId: ctx.session.user.id,
        },
      })

      return {
        payments,
        total,
        hasMore: offset + limit < total,
      }
    }),

  // Cancel payment
  cancelPayment: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orderId } = input

      // Get payment
      const payment = await ctx.prisma.paymentTransaction.findUnique({
        where: { orderId },
      })

      if (!payment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Payment not found',
        })
      }

      // Verify ownership
      if (payment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        })
      }

      // Can only cancel pending payments
      if (payment.status !== 'PENDING') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Can only cancel pending payments',
        })
      }

      // Cancel in Midtrans
      await midtransPayment.cancelTransaction(orderId)

      // Update database
      await ctx.prisma.paymentTransaction.update({
        where: { orderId },
        data: {
          status: 'CANCELLED',
        },
      })

      return {
        success: true,
        message: 'Payment cancelled',
      }
    }),
})
