import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function ensureTenant(userId: string, email: string, name?: string, avatar?: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } })
  if (existing) return

  const empresa = name ? `${name} Empresa` : 'Minha Empresa'
  const tenant = await prisma.tenant.create({
    data: {
      name: empresa,
      slug: slugify(empresa) + '-' + Math.random().toString(36).slice(2, 6),
      plan: 'UNICO', status: 'ACTIVE', settings: { create: {} },
      subscriptions: { create: { plan: 'UNICO', status: 'PENDING' } }
    }
  })
  await prisma.user.create({
      data: { id: userId, email, name: name || email, role: 'owner', tenantId: tenant.id, image: avatar }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'https://whatsai-app-production.up.railway.app'

  if (code) {
    try {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            },
          },
        }
      )
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const sessionUser = data?.session?.user
        if (sessionUser?.email) {
          await ensureTenant(
            sessionUser.id,
            sessionUser.email,
            sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0],
            sessionUser.user_metadata?.avatar_url
          )
        }
        return NextResponse.redirect(`${appUrl}${next}`)
      }
      console.error('Auth callback exchangeCodeForSession error:', error)
    } catch (err) {
      console.error('Auth callback exception:', err)
    }
  }

  return NextResponse.redirect(`${appUrl}/login?error=auth_failed`)
}
