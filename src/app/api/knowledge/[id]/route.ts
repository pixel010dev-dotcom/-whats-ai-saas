import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const tenantId = body.tenantId

    // Verify ownership
    if (tenantId) {
      const existing = await prisma.knowledge.findUnique({ where: { id }, select: { tenantId: true } })
      if (!existing || existing.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Conhecimento não encontrado' }, { status: 404 })
      }
    }

    const knowledge = await prisma.knowledge.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags ?? undefined,
      },
    })

    return NextResponse.json({ knowledge })
  } catch (err) {
    console.error('Knowledge update error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar conhecimento' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const tenantId = body?.tenantId

    if (tenantId) {
      const existing = await prisma.knowledge.findUnique({ where: { id }, select: { tenantId: true } })
      if (!existing || existing.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Conhecimento não encontrado' }, { status: 404 })
      }
    }

    await prisma.knowledge.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Knowledge delete error:', err)
    return NextResponse.json({ error: 'Erro ao deletar conhecimento' }, { status: 500 })
  }
}
