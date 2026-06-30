import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Campos obrigat\u00f3rios' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: 'Email ou senha inv\u00e1lidos' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email }, include: { tenant: true } })
    return NextResponse.json({ success: true, session: data.session, user, tenant: user?.tenant })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
