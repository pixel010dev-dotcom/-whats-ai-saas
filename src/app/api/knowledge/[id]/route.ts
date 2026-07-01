import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

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
    await prisma.knowledge.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Knowledge delete error:', err)
    return NextResponse.json({ error: 'Erro ao deletar conhecimento' }, { status: 500 })
  }
}
