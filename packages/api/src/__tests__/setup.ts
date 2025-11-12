import { beforeAll, afterAll, afterEach } from 'bun:test'
import { prisma } from '@kreatr/database'

// Setup test database
beforeAll(async () => {
  console.log('🧪 Setting up test database...')
  // Run migrations if needed
  // await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS test_kreatr`
})

// Clean up after each test
afterEach(async () => {
  // Delete all test data
  await prisma.creditTransaction.deleteMany()
  await prisma.content.deleteMany()
  await prisma.workspaceMember.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()
})

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect()
  console.log('✅ Test database cleaned up')
})
