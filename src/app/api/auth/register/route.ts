import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { registerSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { name, email, password, empresa } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email j\á cadastrado' }, { status: 400 })
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name, empresa }
    })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
    const tenant = await prisma.tenant.create({
      data: {
        name: empresa,
        slug: slugify(empresa) + '-' + Math.random().toString(36).slice(2, 6),
        plan: 'UNICO', status: 'TRIAL', settings: { create: {} },
        subscriptions: {
          create: { plan: 'UNICO', status: 'PENDING' }
        }
      }
    })
    if (!authUser.user?.id) {
      await prisma.tenant.delete({ where: { id: tenant.id } }).catch(() => {})
      return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
    }
    await prisma.user.create({
      data: { id: authUser.user.id, email, name, role: 'owner', tenantId: tenant.id }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Erro interno', detail: message }, { status: 500 })
  }
}
