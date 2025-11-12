import { describe, test, expect, beforeEach } from 'bun:test'
import { createCaller } from '../root'
import { prisma } from '@kreatr/database'

describe('Credit System', () => {
  let caller: ReturnType<typeof createCaller>
  let testUser: any

  beforeEach(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })

    // Create caller with test user context
    caller = createCaller({
      session: {
        user: { id: testUser.id, email: testUser.email },
      },
      prisma,
    })
  })

  test('should get initial balance of 0', async () => {
    const balance = await caller.credit.getBalance()
    
    expect(balance.balance).toBe(0)
    expect(balance.totalPurchased).toBe(0)
    expect(balance.totalUsed).toBe(0)
  })

  test('should purchase credits successfully', async () => {
    const result = await caller.credit.purchase({ amount: 50 })
    
    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(50)
    
    // Verify balance updated
    const balance = await caller.credit.getBalance()
    expect(balance.balance).toBe(50)
    expect(balance.totalPurchased).toBe(50)
  })

  test('should deduct credits correctly', async () => {
    // First purchase credits
    await caller.credit.purchase({ amount: 100 })
    
    // Deduct credits
    const result = await caller.credit.deduct({
      amount: 10,
      description: 'AI Content Generation',
    })
    
    expect(result.success).toBe(true)
    expect(result.newBalance).toBe(90)
    
    // Verify balance
    const balance = await caller.credit.getBalance()
    expect(balance.balance).toBe(90)
    expect(balance.totalUsed).toBe(10)
  })

  test('should fail when insufficient credits', async () => {
    // Try to deduct without credits
    await expect(
      caller.credit.deduct({
        amount: 10,
        description: 'AI Generation',
      })
    ).rejects.toThrow('Insufficient credits')
  })

  test('should record transaction history', async () => {
    // Purchase credits
    await caller.credit.purchase({ amount: 50 })
    
    // Deduct credits
    await caller.credit.deduct({
      amount: 5,
      description: 'AI Brainstorm',
    })
    
    // Get transactions
    const transactions = await caller.credit.getTransactions({ limit: 10 })
    
    expect(transactions).toHaveLength(2)
    expect(transactions[0].type).toBe('USAGE')
    expect(transactions[0].amount).toBe(-5)
    expect(transactions[1].type).toBe('PURCHASE')
    expect(transactions[1].amount).toBe(50)
  })

  test('should calculate balance correctly after multiple transactions', async () => {
    await caller.credit.purchase({ amount: 100 })
    await caller.credit.deduct({ amount: 10, description: 'Test 1' })
    await caller.credit.deduct({ amount: 15, description: 'Test 2' })
    await caller.credit.purchase({ amount: 50 })
    await caller.credit.deduct({ amount: 20, description: 'Test 3' })
    
    const balance = await caller.credit.getBalance()
    expect(balance.balance).toBe(105) // 100 - 10 - 15 + 50 - 20
    expect(balance.totalPurchased).toBe(150)
    expect(balance.totalUsed).toBe(45)
  })
})
