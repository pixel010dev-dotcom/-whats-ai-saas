import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { knowledgeSchema } from '@/lib/validations'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const knowledge = await prisma.knowledge.findMany({
      where: { tenantId },
      orderBy: { title: 'asc' },
    })

    return NextResponse.json({
      knowledge: knowledge.map(k => ({
        id: k.id,
        title: k.title,
        content: k.content,
        tags: k.tags,
      })),
    })
  } catch (err) {
    console.error('Knowledge error:', err)
    return NextResponse.json({ error: 'Erro ao carregar conhecimento' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = knowledgeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 })
    }

    const knowledge = await prisma.knowledge.create({
      data: {
        tenantId: parsed.data.tenantId,
        title: parsed.data.title,
        content: parsed.data.content,
        tags: parsed.data.tags || null,
      },
    })

    return NextResponse.json({ knowledge }, { status: 201 })
  } catch (err) {
    console.error('Knowledge create error:', err)
    return NextResponse.json({ error: 'Erro ao criar conhecimento' }, { status: 500 })
  }
}
