import { describe, test, expect, beforeEach } from 'bun:test'
import { createCaller } from '../root'
import { prisma } from '@kreatr/database'

describe('Content Management', () => {
  let caller: ReturnType<typeof createCaller>
  let testUser: any
  let testWorkspace: any

  beforeEach(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test-content@example.com',
        name: 'Test Content User',
      },
    })

    // Create workspace
    testWorkspace = await prisma.workspace.create({
      data: {
        name: 'Test Workspace',
        slug: 'test-workspace',
        members: {
          create: {
            userId: testUser.id,
            role: 'OWNER',
          },
        },
      },
    })

    caller = createCaller({
      session: {
        user: { id: testUser.id, email: testUser.email },
      },
      prisma,
    })
  })

  test('should create content', async () => {
    const content = await caller.content.create({
      title: 'Test Content',
      caption: 'This is a test caption',
      hashtags: ['test', 'content'],
      workspaceId: testWorkspace.id,
    })
    
    expect(content.id).toBeDefined()
    expect(content.title).toBe('Test Content')
    expect(content.status).toBe('DRAFT')
  })

  test('should get recent content', async () => {
    // Create multiple content
    await caller.content.create({
      title: 'Content 1',
      workspaceId: testWorkspace.id,
    })
    await caller.content.create({
      title: 'Content 2',
      workspaceId: testWorkspace.id,
    })
    
    const recent = await caller.content.getRecent({ limit: 5 })
    
    expect(recent.length).toBe(2)
    expect(recent[0].title).toBe('Content 2') // Most recent first
  })

  test('should get content stats', async () => {
    // Create content with different statuses
    await caller.content.create({
      title: 'Draft Content',
      workspaceId: testWorkspace.id,
    })
    await caller.content.create({
      title: 'Scheduled Content',
      workspaceId: testWorkspace.id,
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 86400000),
    })
    
    const stats = await caller.content.getStats()
    
    expect(stats.totalContent).toBe(2)
    expect(stats.scheduledPosts).toBe(1)
  })

  test('should update content status', async () => {
    const content = await caller.content.create({
      title: 'Test Content',
      workspaceId: testWorkspace.id,
    })
    
    const updated = await caller.content.updateStatus({
      id: content.id,
      status: 'APPROVED',
    })
    
    expect(updated.status).toBe('APPROVED')
  })

  test('should schedule content', async () => {
    const content = await caller.content.create({
      title: 'Scheduled Content',
      workspaceId: testWorkspace.id,
    })
    
    const scheduledDate = new Date(Date.now() + 86400000)
    const scheduled = await caller.content.schedule({
      id: content.id,
      scheduledAt: scheduledDate,
    })
    
    expect(scheduled.status).toBe('SCHEDULED')
    expect(scheduled.scheduledAt).toBeDefined()
  })

  test('should delete content', async () => {
    const content = await caller.content.create({
      title: 'To Delete',
      workspaceId: testWorkspace.id,
    })
    
    await caller.content.delete({ id: content.id })
    
    const deleted = await prisma.content.findUnique({
      where: { id: content.id },
    })
    
    expect(deleted).toBeNull()
  })
})
