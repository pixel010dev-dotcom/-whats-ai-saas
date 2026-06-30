import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { name, email, password, empresa } = await req.json()
    if (!email || !password || !empresa) {
      return NextResponse.json({ error: 'Campos obrigat\órios' }, { status: 400 })
    }
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
        plan: 'BASICO', status: 'TRIAL', settings: { create: {} }
      }
    })
    await prisma.user.create({
      data: { id: authUser.user?.id || crypto.randomUUID(), email, name, role: 'owner', tenantId: tenant.id }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
