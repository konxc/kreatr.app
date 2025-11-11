import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { Role } from '@kreatr/database'

export const workspaceRouter = createTRPCRouter({
  // Create a new workspace
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
        description: z.string().max(500).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is already taken
      const existing = await ctx.db.workspace.findUnique({
        where: { slug: input.slug },
      })

      if (existing) {
        throw new Error('Workspace slug already taken')
      }

      // Create workspace with user as owner
      const workspace = await ctx.db.workspace.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          image: input.image,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: Role.OWNER,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      return workspace
    }),

  // Get all workspaces for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const workspaces = await ctx.db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            contents: true,
            socialAccounts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return workspaces.map((workspace) => ({
      ...workspace,
      currentUserRole: workspace.members.find(
        (m) => m.userId === ctx.session.user.id
      )?.role,
    }))
  }),

  // Get workspace by ID or slug
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new Error('Either id or slug must be provided')
      }

      const workspace = await ctx.db.workspace.findFirst({
        where: {
          OR: [
            input.id ? { id: input.id } : {},
            input.slug ? { slug: input.slug } : {},
          ],
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: {
              joinedAt: 'asc',
            },
          },
          socialAccounts: {
            select: {
              id: true,
              platform: true,
              username: true,
              displayName: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              contents: true,
            },
          },
        },
      })

      if (!workspace) {
        throw new Error('Workspace not found or access denied')
      }

      const currentUserMember = workspace.members.find(
        (m) => m.userId === ctx.session.user.id
      )

      return {
        ...workspace,
        currentUserRole: currentUserMember?.role,
      }
    }),

  // Update workspace
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
        description: z.string().max(500).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission (OWNER or ADMIN)
      const member = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.id,
          userId: ctx.session.user.id,
          role: {
            in: [Role.OWNER, Role.ADMIN],
          },
        },
      })

      if (!member) {
        throw new Error('Permission denied')
      }

      // If slug is being changed, check if it's available
      if (input.slug) {
        const existing = await ctx.db.workspace.findFirst({
          where: {
            slug: input.slug,
            id: {
              not: input.id,
            },
          },
        })

        if (existing) {
          throw new Error('Workspace slug already taken')
        }
      }

      const { id, ...updateData } = input

      const workspace = await ctx.db.workspace.update({
        where: { id },
        data: updateData,
      })

      return workspace
    }),

  // Delete workspace
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only OWNER can delete workspace
      const member = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.id,
          userId: ctx.session.user.id,
          role: Role.OWNER,
        },
      })

      if (!member) {
        throw new Error('Only workspace owner can delete workspace')
      }

      await ctx.db.workspace.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Invite member to workspace
  inviteMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        email: z.string().email(),
        role: z.nativeEnum(Role).default(Role.MEMBER),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission (OWNER or ADMIN)
      const currentMember = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: {
            in: [Role.OWNER, Role.ADMIN],
          },
        },
      })

      if (!currentMember) {
        throw new Error('Permission denied')
      }

      // Find user by email
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Check if user is already a member
      const existingMember = await ctx.db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: input.workspaceId,
          },
        },
      })

      if (existingMember) {
        throw new Error('User is already a member of this workspace')
      }

      // Add member
      const member = await ctx.db.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: input.workspaceId,
          role: input.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      // TODO: Send invitation email

      return member
    }),

  // Remove member from workspace
  removeMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission (OWNER or ADMIN)
      const currentMember = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: {
            in: [Role.OWNER, Role.ADMIN],
          },
        },
      })

      if (!currentMember) {
        throw new Error('Permission denied')
      }

      // Cannot remove workspace owner
      const targetMember = await ctx.db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: input.userId,
            workspaceId: input.workspaceId,
          },
        },
      })

      if (!targetMember) {
        throw new Error('Member not found')
      }

      if (targetMember.role === Role.OWNER) {
        throw new Error('Cannot remove workspace owner')
      }

      // Admin cannot remove another admin (only owner can)
      if (
        currentMember.role === Role.ADMIN &&
        targetMember.role === Role.ADMIN
      ) {
        throw new Error('Admin cannot remove another admin')
      }

      await ctx.db.workspaceMember.delete({
        where: {
          userId_workspaceId: {
            userId: input.userId,
            workspaceId: input.workspaceId,
          },
        },
      })

      return { success: true }
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only OWNER can change roles
      const currentMember = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: Role.OWNER,
        },
      })

      if (!currentMember) {
        throw new Error('Only workspace owner can change member roles')
      }

      // Cannot change owner role
      const targetMember = await ctx.db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: input.userId,
            workspaceId: input.workspaceId,
          },
        },
      })

      if (!targetMember) {
        throw new Error('Member not found')
      }

      if (targetMember.role === Role.OWNER) {
        throw new Error('Cannot change owner role')
      }

      const updatedMember = await ctx.db.workspaceMember.update({
        where: {
          userId_workspaceId: {
            userId: input.userId,
            workspaceId: input.workspaceId,
          },
        },
        data: {
          role: input.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      return updatedMember
    }),

  // Leave workspace
  leave: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: ctx.session.user.id,
            workspaceId: input.workspaceId,
          },
        },
      })

      if (!member) {
        throw new Error('You are not a member of this workspace')
      }

      if (member.role === Role.OWNER) {
        throw new Error(
          'Workspace owner cannot leave. Transfer ownership or delete workspace instead.'
        )
      }

      await ctx.db.workspaceMember.delete({
        where: {
          userId_workspaceId: {
            userId: ctx.session.user.id,
            workspaceId: input.workspaceId,
          },
        },
      })

      return { success: true }
    }),

  // Transfer ownership
  transferOwnership: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        newOwnerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only current owner can transfer ownership
      const currentOwner = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
          role: Role.OWNER,
        },
      })

      if (!currentOwner) {
        throw new Error('Only workspace owner can transfer ownership')
      }

      // Check if new owner is a member
      const newOwner = await ctx.db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: input.newOwnerId,
            workspaceId: input.workspaceId,
          },
        },
      })

      if (!newOwner) {
        throw new Error('New owner must be a member of the workspace')
      }

      // Transfer ownership in a transaction
      await ctx.db.$transaction([
        // Demote current owner to admin
        ctx.db.workspaceMember.update({
          where: {
            userId_workspaceId: {
              userId: ctx.session.user.id,
              workspaceId: input.workspaceId,
            },
          },
          data: {
            role: Role.ADMIN,
          },
        }),
        // Promote new owner
        ctx.db.workspaceMember.update({
          where: {
            userId_workspaceId: {
              userId: input.newOwnerId,
              workspaceId: input.workspaceId,
            },
          },
          data: {
            role: Role.OWNER,
          },
        }),
      ])

      return { success: true }
    }),

  // Get workspace members
  getMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user has access to workspace
      const member = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
        },
      })

      if (!member) {
        throw new Error('Access denied')
      }

      const members = await ctx.db.workspaceMember.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: [
          { role: 'asc' }, // OWNER first, then ADMIN, MEMBER, VIEWER
          { joinedAt: 'asc' },
        ],
      })

      return members
    }),

  // Get workspace statistics
  getStats: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user has access to workspace
      const member = await ctx.db.workspaceMember.findFirst({
        where: {
          workspaceId: input.workspaceId,
          userId: ctx.session.user.id,
        },
      })

      if (!member) {
        throw new Error('Access denied')
      }

      const [
        totalContents,
        publishedContents,
        scheduledContents,
        totalMembers,
        socialAccounts,
      ] = await Promise.all([
        ctx.db.content.count({
          where: { workspaceId: input.workspaceId },
        }),
        ctx.db.content.count({
          where: {
            workspaceId: input.workspaceId,
            status: 'PUBLISHED',
          },
        }),
        ctx.db.content.count({
          where: {
            workspaceId: input.workspaceId,
            status: 'SCHEDULED',
          },
        }),
        ctx.db.workspaceMember.count({
          where: { workspaceId: input.workspaceId },
        }),
        ctx.db.socialAccount.count({
          where: {
            workspaceId: input.workspaceId,
            isActive: true,
          },
        }),
      ])

      return {
        totalContents,
        publishedContents,
        scheduledContents,
        draftContents: totalContents - publishedContents - scheduledContents,
        totalMembers,
        socialAccounts,
      }
    }),
})