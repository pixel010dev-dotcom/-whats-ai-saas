import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (err) {
    console.error('Categories error:', err)
    return NextResponse.json({ error: 'Erro ao carregar categorias' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tenantId, name } = body
    if (!tenantId || !name) {
      return NextResponse.json({ error: 'tenantId e name são obrigatórios' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const category = await prisma.category.create({
      data: { tenantId, name, slug },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (err) {
    console.error('Category create error:', err)
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}
