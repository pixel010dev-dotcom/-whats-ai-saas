import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { tenant: true },
    })
    return NextResponse.json({ user: dbUser, tenant: dbUser?.tenant })
  } catch (err) {
    console.error('Profile error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
