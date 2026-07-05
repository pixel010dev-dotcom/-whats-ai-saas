import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const tenantId = body.tenantId

    if (tenantId) {
      const existing = await prisma.product.findUnique({ where: { id }, select: { tenantId: true } })
      if (!existing || existing.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description ?? undefined,
        image: body.image ?? undefined,
        categoryId: body.categoryId ?? undefined,
        active: body.active ?? undefined,
      },
      include: { category: true },
    })

    return NextResponse.json({ product })
  } catch (err) {
    console.error('Product update error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const tenantId = body?.tenantId

    if (tenantId) {
      const existing = await prisma.product.findUnique({ where: { id }, select: { tenantId: true } })
      if (!existing || existing.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
      }
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Product delete error:', err)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
