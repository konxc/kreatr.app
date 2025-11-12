# Credits System Feature

## Overview
Credit-based system for managing usage of premium features and API calls.

## Features

### 1. Credit Management
- Purchase credits via payment
- Track credit balance
- Usage history
- Auto-refill options

### 2. Credit Packages
- Starter: 100 credits
- Pro: 500 credits
- Business: 2000 credits
- Custom packages

### 3. Credit Usage
- AI generation: 10 credits per request
- Scheduled posts: 1 credit per post
- Analytics reports: 5 credits per report
- API calls: Variable pricing

### 4. Credit Tracking
- Real-time balance updates
- Usage notifications
- Low balance alerts
- Detailed transaction history

## Implementation

### Database Schema
```prisma
model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int
  type        String   // purchase, usage, refund
  description String
  createdAt   DateTime @default(now())
}

model UserCredits {
  userId      String   @id
  balance     Int      @default(0)
  updatedAt   DateTime @updatedAt
}
```

### API Endpoints
- `POST /api/credits/purchase` - Buy credits
- `GET /api/credits/balance` - Check balance
- `GET /api/credits/history` - Transaction history
- `POST /api/credits/use` - Deduct credits

## Payment Integration

### Midtrans Integration
- Multiple payment methods
- Automatic credit fulfillment
- Payment verification
- Refund handling

## Usage Flow

1. User purchases credit package
2. Payment processed via Midtrans
3. Credits added to account
4. User uses features
5. Credits deducted automatically
6. Low balance notification
7. User can purchase more

## Future Enhancements
- Subscription plans
- Credit gifting
- Referral bonuses
- Enterprise pricing
