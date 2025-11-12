# Payment System

Complete guide to kreatr.app's payment and billing system powered by Midtrans.

## Overview

The payment system allows users to purchase AI credits using various payment methods including credit cards, e-wallets (GoPay, ShopeePay), bank transfers, and QRIS.

## Features

### Payment Methods

- 💳 **Credit Card** - Visa, Mastercard, JCB
- 📱 **E-Wallets** - GoPay, ShopeePay
- 🏦 **Bank Transfer** - BCA, BNI, BRI, Permata, Other Banks
- 📲 **QRIS** - Scan to pay

### Credit Packages

| Package | Credits | Price (IDR) | Bonus | Total Credits |
|---------|---------|-------------|-------|---------------|
| Starter | 50 | Rp 50,000 | - | 50 |
| Popular | 150 | Rp 150,000 | +10 | 160 |
| Pro | 500 | Rp 500,000 | +50 | 550 |

### Pricing

- **1 Credit = Rp 1,000**
- No hidden fees
- Instant credit delivery
- Secure payment processing

## How to Purchase

### Step 1: Open Payment Modal

1. Go to **Credits & Billing** page
2. Click **"Buy Credits"** button
3. Payment modal opens

### Step 2: Select Package

1. Choose from 3 credit packages
2. See features included
3. Compare prices

### Step 3: Proceed to Payment

1. Click **"Proceed to Payment"**
2. Redirected to Midtrans payment page
3. Choose payment method

### Step 4: Complete Payment

1. Enter payment details
2. Confirm payment
3. Wait for confirmation

### Step 5: Credits Added

1. Automatic credit fulfillment
2. Redirected to success page
3. Credits available immediately

## Payment Flow

```
User clicks "Buy Credits"
    ↓
Selects credit package
    ↓
Clicks "Proceed to Payment"
    ↓
Backend creates Midtrans transaction
    ↓
User redirected to Midtrans
    ↓
User completes payment
    ↓
Midtrans sends webhook
    ↓
Backend verifies & adds credits
    ↓
User redirected to success page
    ↓
Credits available in account
```

## API Endpoints

### Create Payment

```typescript
const payment = await trpc.payment.createPayment.mutate({
  creditAmount: 50,
  packageId: 'PACKAGE_50',
})

// Returns:
{
  orderId: string
  token: string
  redirectUrl: string
  amount: number
  credits: number
}
```

### Get Payment Status

```typescript
const status = await trpc.payment.getPaymentStatus.useQuery({
  orderId: 'ORDER-xxx',
})

// Returns:
{
  orderId: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
  amount: number
  creditAmount: number
  createdAt: Date
  midtransStatus: string
  paymentType: string
}
```

### Get Payment History

```typescript
const history = await trpc.payment.getPaymentHistory.useQuery({
  limit: 10,
  offset: 0,
})

// Returns:
{
  payments: PaymentTransaction[]
  total: number
  hasMore: boolean
}
```

### Cancel Payment

```typescript
await trpc.payment.cancelPayment.mutate({
  orderId: 'ORDER-xxx',
})
```

## Payment Status

### Status Types

- **PENDING** - Payment initiated, waiting for completion
- **PROCESSING** - Payment being processed
- **SUCCESS** - Payment successful, credits added
- **FAILED** - Payment failed
- **CANCELLED** - Payment cancelled by user
- **REFUNDED** - Payment refunded

### Status Flow

```
PENDING → PROCESSING → SUCCESS
                    ↓
                  FAILED
```

## Webhook Integration

### Webhook URL

```
Production: https://kreatr.app/api/webhooks/midtrans
Sandbox: https://your-domain.com/api/webhooks/midtrans
```

### Webhook Events

- **capture** - Credit card payment captured
- **settlement** - Payment settled
- **pending** - Payment pending
- **deny** - Payment denied
- **expire** - Payment expired
- **cancel** - Payment cancelled

### Webhook Security

- SHA512 signature verification
- Order ID validation
- Amount verification
- Duplicate prevention

## Credit Usage

### AI Features Cost

- **AI Brainstorm**: 5 credits
- **Content Generator**: 10 credits
- **TikTok Analyzer**: 15 credits

### Credit Balance

- View current balance in header
- Track usage in Credits page
- Get low balance notifications

## Payment Security

### Implemented

✅ **PCI DSS Compliant** - Midtrans is PCI DSS certified
✅ **SSL Encryption** - All data encrypted in transit
✅ **Signature Verification** - Webhook signatures verified
✅ **Fraud Detection** - Midtrans fraud detection enabled
✅ **Secure Storage** - Payment data encrypted at rest

### Best Practices

- Never store card details
- Use HTTPS in production
- Verify webhook signatures
- Log all transactions
- Monitor for fraud

## Troubleshooting

### Payment Failed

**Possible Causes:**
- Insufficient balance
- Card declined
- Payment timeout
- Network error

**Solutions:**
1. Check card balance
2. Try different payment method
3. Contact bank
4. Retry payment

### Credits Not Added

**Check:**
1. Payment status (should be SUCCESS)
2. Webhook received
3. Transaction history

**Solution:**
- Wait 5-10 minutes
- Refresh page
- Contact support if issue persists

### Duplicate Payment

**Prevention:**
- Unique order IDs
- Idempotency checks
- Status validation

**If Occurs:**
- Contact support
- Provide order IDs
- Refund processed

## Testing

### Test Environment

```env
MIDTRANS_SERVER_KEY="Mid-server-YOUR_SANDBOX_KEY"
MIDTRANS_CLIENT_KEY="Mid-client-YOUR_SANDBOX_KEY"
NODE_ENV="development"
```

### Test Cards

**Success:**
```
Card: 4811 1111 1111 1114
CVV: 123
Exp: 01/25
```

**Failure:**
```
Card: 4911 1111 1111 1113
CVV: 123
Exp: 01/25
```

### Test E-Wallets

- **GoPay**: Use test phone number
- **ShopeePay**: Use test credentials

### Manual Testing

```bash
# 1. Create payment
curl -X POST http://localhost:3000/api/trpc/payment.createPayment

# 2. Complete payment in Midtrans sandbox

# 3. Check webhook logs
tail -f logs/webhook.log

# 4. Verify credits added
curl http://localhost:3000/api/trpc/credit.getBalance
```

## Configuration

### Environment Variables

```env
# Midtrans
MIDTRANS_SERVER_KEY="Mid-server-YOUR_SERVER_KEY"
MIDTRANS_CLIENT_KEY="Mid-client-S-YOUR_CLIENT_KEY"
MIDTRANS_MERCHANT_ID="YOUR_MERCH_ID"

# Environment
NODE_ENV="production"

# URLs
NEXT_PUBLIC_APP_URL="https://kreatr.app"
```

### Midtrans Dashboard

1. **Login**: https://dashboard.midtrans.com
2. **Settings** → **Configuration**
3. **Payment Notification URL**: `https://kreatr.app/api/webhooks/midtrans`
4. **Finish Redirect URL**: `https://kreatr.app/dashboard/payment/success`
5. **Error Redirect URL**: `https://kreatr.app/dashboard/payment/error`

## Monitoring

### Metrics to Track

- Payment success rate
- Average payment time
- Failed payment reasons
- Revenue per day/month
- Popular payment methods

### Logs

```bash
# Payment creation
[Payment] Creating payment for user: xxx
[Payment] Payment created: ORDER-xxx

# Webhook
[Midtrans Webhook] Received: ORDER-xxx
[Midtrans Webhook] Status: SUCCESS
[Midtrans Webhook] Credits added: 50

# Errors
[Payment] Failed: Insufficient balance
[Webhook] Invalid signature
```

## Refunds

### Refund Policy

- 7-day money-back guarantee
- Unused credits only
- Original payment method

### Request Refund

1. Contact support@kreatr.app
2. Provide order ID
3. State reason
4. Wait 3-5 business days

## Support

### Common Questions

**Q: How long does payment take?**
A: Instant for e-wallets, 1-2 hours for bank transfer

**Q: Can I get a refund?**
A: Yes, within 7 days for unused credits

**Q: What if payment fails?**
A: Try again or use different payment method

**Q: Are credits refundable?**
A: Yes, unused credits within 7 days

### Contact

- **Email**: support@kreatr.app
- **Docs**: [Documentation](../README.md)
- **Issues**: [GitHub Issues](https://github.com/kreatr-app/kreatr/issues)

## Future Enhancements

- [ ] Subscription plans
- [ ] International payments (Stripe)
- [ ] Bulk discounts
- [ ] Loyalty rewards
- [ ] Gift credits
- [ ] Invoice generation

---

**Last Updated:** 2024-01-15
**Version:** 0.1.0
