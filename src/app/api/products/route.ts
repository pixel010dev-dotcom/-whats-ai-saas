import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'

// GET /api/products?tenantId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        active: p.active,
        categoryId: p.categoryId,
        category: p.category ? { id: p.category.id, name: p.category.name } : null,
      })),
    })
  } catch (err) {
    console.error('Products error:', err)
    return NextResponse.json({ error: 'Erro ao carregar produtos' }, { status: 500 })
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        tenantId: parsed.data.tenantId,
        name: parsed.data.name,
        price: parsed.data.price,
        description: parsed.data.description || null,
        image: parsed.data.image || null,
        categoryId: parsed.data.categoryId || null,
        active: parsed.data.active ?? true,
      },
      include: { category: true },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    console.error('Product create error:', err)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
