import { describe, test, expect, beforeEach } from 'bun:test'
import { createCaller } from '../root'
import { prisma } from '@kreatr/database'

describe('AI Features', () => {
  let caller: ReturnType<typeof createCaller>
  let testUser: any

  beforeEach(async () => {
    // Create test user with credits
    testUser = await prisma.user.create({
      data: {
        email: 'test-ai@example.com',
        name: 'Test AI User',
      },
    })

    // Add credits
    await prisma.creditTransaction.create({
      data: {
        userId: testUser.id,
        amount: 100,
        type: 'PURCHASE',
        description: 'Initial credits',
        balance: 100,
      },
    })

    caller = createCaller({
      session: {
        user: { id: testUser.id, email: testUser.email },
      },
      prisma,
    })
  })

  describe('AI Brainstorm', () => {
    test('should generate content ideas', async () => {
      const result = await caller.ai.brainstorm({
        topic: 'social media marketing',
        niche: 'tech',
      })
      
      expect(result.ideas).toBeDefined()
      expect(result.ideas.length).toBeGreaterThan(0)
      expect(result.creditsUsed).toBe(5)
    })

    test('should deduct credits after brainstorm', async () => {
      const balanceBefore = await caller.credit.getBalance()
      
      await caller.ai.brainstorm({
        topic: 'content creation',
      })
      
      const balanceAfter = await caller.credit.getBalance()
      expect(balanceAfter.balance).toBe(balanceBefore.balance - 5)
    })

    test('should fail without sufficient credits', async () => {
      // Deduct all credits
      await caller.credit.deduct({
        amount: 100,
        description: 'Test deduction',
      })
      
      await expect(
        caller.ai.brainstorm({ topic: 'test' })
      ).rejects.toThrow('Insufficient credits')
    })
  })

  describe('Content Generator', () => {
    test('should generate content for Instagram', async () => {
      const result = await caller.ai.generateContent({
        topic: 'productivity tips',
        platform: 'instagram',
        tone: 'casual',
      })
      
      expect(result.content).toBeDefined()
      expect(result.content.length).toBeGreaterThan(0)
      expect(result.creditsUsed).toBe(10)
    })

    test('should generate content for TikTok', async () => {
      const result = await caller.ai.generateContent({
        topic: 'cooking recipe',
        platform: 'tiktok',
        tone: 'funny',
      })
      
      expect(result.content).toBeDefined()
      expect(result.creditsUsed).toBe(10)
    })

    test('should deduct correct credits', async () => {
      const balanceBefore = await caller.credit.getBalance()
      
      await caller.ai.generateContent({
        topic: 'test',
        platform: 'twitter',
        tone: 'professional',
      })
      
      const balanceAfter = await caller.credit.getBalance()
      expect(balanceAfter.balance).toBe(balanceBefore.balance - 10)
    })
  })

  describe('TikTok Analyzer', () => {
    test('should analyze TikTok video', async () => {
      const result = await caller.ai.analyzeTikTok({
        videoUrl: 'https://www.tiktok.com/@test/video/123',
      })
      
      expect(result.title).toBeDefined()
      expect(result.hook).toBeDefined()
      expect(result.strategy).toBeDefined()
      expect(result.hashtags).toBeDefined()
      expect(result.insights).toBeDefined()
      expect(result.creditsUsed).toBe(15)
    })

    test('should deduct credits after analysis', async () => {
      const balanceBefore = await caller.credit.getBalance()
      
      await caller.ai.analyzeTikTok({
        videoUrl: 'https://www.tiktok.com/@test/video/456',
      })
      
      const balanceAfter = await caller.credit.getBalance()
      expect(balanceAfter.balance).toBe(balanceBefore.balance - 15)
    })

    test('should validate TikTok URL', async () => {
      await expect(
        caller.ai.analyzeTikTok({ videoUrl: 'invalid-url' })
      ).rejects.toThrow('Invalid TikTok URL')
    })
  })
})
