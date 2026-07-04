import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { settingsSchema } from '@/lib/validations'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    let tenantId = searchParams.get('tenantId')
    const slug = searchParams.get('slug')

    if (!tenantId && slug) {
      const tenant = await prisma.tenant.findUnique({ where: { slug } })
      if (tenant) tenantId = tenant.id
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId ou slug é obrigatório' }, { status: 400 })
    }

    let settings = await prisma.tenantSettings.findUnique({ where: { tenantId } })
    if (!settings) {
      settings = await prisma.tenantSettings.create({
        data: {
          tenantId,
          aiPersonality: '',
          welcomeMessage: '',
          businessHours: '',
          autoReply: true,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (err) {
    console.error('Settings GET error:', err)
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { tenantId, ...data } = body
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const parsed = settingsSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const settings = await prisma.tenantSettings.upsert({
      where: { tenantId },
      update: parsed.data,
      create: { tenantId, ...parsed.data },
    })

    return NextResponse.json({ success: true, settings })
  } catch (err) {
    console.error('Settings PUT error:', err)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
