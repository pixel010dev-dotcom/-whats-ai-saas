import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { tenant: true },
    })
    if (!dbUser) {
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
      const tenant = await prisma.tenant.create({
        data: {
          name: `${name} Empresa`,
          slug: slugify(name) + '-' + Math.random().toString(36).slice(2, 6),
          plan: 'UNICO', status: 'ACTIVE', settings: { create: {} },
          subscriptions: { create: { plan: 'UNICO', status: 'PENDING' } }
        }
      })
      dbUser = await prisma.user.create({
        data: {
          id: user.id, email: user.email || '', name,
          role: 'owner', tenantId: tenant.id,
          image: user.user_metadata?.avatar_url,
        },
        include: { tenant: true },
      })
    }
    return NextResponse.json({ user: dbUser, tenant: dbUser.tenant })
  } catch (err) {
    console.error('Profile error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
