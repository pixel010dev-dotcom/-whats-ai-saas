import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { email, password } = parsed.data
    const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: 'Email ou senha inv\álidos' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email }, include: { tenant: true } })
    return NextResponse.json({ success: true, session: data.session, user, tenant: user?.tenant })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
