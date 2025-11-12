import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@kreatr/database'
import { midtransPayment } from '@kreatr/api/src/services/payment'

/**
 * Midtrans Webhook Handler
 * Receives payment notifications from Midtrans
 * 
 * Webhook URL: https://your-domain.com/api/webhooks/midtrans
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[Midtrans Webhook] Received notification:', {
      orderId: body.order_id,
      transactionStatus: body.transaction_status,
      fraudStatus: body.fraud_status,
    })

    // Verify signature
    const isValid = midtransPayment.verifySignature(
      body.order_id,
      body.status_code,
      body.gross_amount,
      body.signature_key
    )

    if (!isValid) {
      console.error('[Midtrans Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
      gross_amount: grossAmount,
    } = body

    // Get payment from database
    const payment = await prisma.paymentTransaction.findUnique({
      where: { orderId },
      include: { user: true },
    })

    if (!payment) {
      console.error('[Midtrans Webhook] Payment not found:', orderId)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Handle different transaction statuses
    let newStatus: string = payment.status

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        newStatus = 'SUCCESS'
      }
    } else if (transactionStatus === 'settlement') {
      newStatus = 'SUCCESS'
    } else if (transactionStatus === 'pending') {
      newStatus = 'PENDING'
    } else if (
      transactionStatus === 'deny' ||
      transactionStatus === 'expire' ||
      transactionStatus === 'cancel'
    ) {
      newStatus = 'FAILED'
    }

    console.log('[Midtrans Webhook] Status update:', {
      orderId,
      oldStatus: payment.status,
      newStatus,
    })

    // Update payment status
    await prisma.paymentTransaction.update({
      where: { orderId },
      data: {
        status: newStatus as any,
        completedAt: newStatus === 'SUCCESS' ? new Date() : null,
        metadata: {
          ...((payment.metadata as any) || {}),
          transactionStatus,
          fraudStatus,
          paymentType,
          webhookReceivedAt: new Date().toISOString(),
        },
      },
    })

    // If payment successful, add credits to user
    if (newStatus === 'SUCCESS' && payment.status !== 'SUCCESS') {
      console.log('[Midtrans Webhook] Adding credits to user:', {
        userId: payment.userId,
        credits: payment.creditAmount,
      })

      // Add credits
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          creditBalance: {
            increment: payment.creditAmount,
          },
        },
      })

      // Record credit transaction
      await prisma.creditTransaction.create({
        data: {
          userId: payment.userId,
          amount: payment.creditAmount,
          type: 'PURCHASE',
          description: `Purchased ${payment.creditAmount} credits via ${paymentType}`,
          balance: payment.user.creditBalance + payment.creditAmount,
          metadata: {
            orderId,
            paymentType,
            amount: payment.amount,
          },
        },
      })

      console.log('[Midtrans Webhook] Credits added successfully')
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      orderId,
      status: newStatus,
    })
  } catch (error) {
    console.error('[Midtrans Webhook] Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for webhook verification
 */
export async function GET() {
  return NextResponse.json({
    message: 'Midtrans webhook endpoint',
    status: 'active',
  })
}
