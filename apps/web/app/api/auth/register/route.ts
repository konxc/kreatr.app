import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@kreatr/database'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        creditBalance: 50, // Starting credits
      },
    })

    // Create welcome credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: 50,
        type: 'REWARD',
        description: 'Welcome bonus - Kredit gratis untuk memulai',
        balance: 50,
      },
    })

    // Create default workspace for user
    const workspace = await prisma.workspace.create({
      data: {
        name: `${validatedData.name}'s Workspace`,
        slug: `${validatedData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Pendaftaran berhasil',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    )
  }
}
