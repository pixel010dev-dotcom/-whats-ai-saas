// Simple email service using SMTP
import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export async function sendPaymentReceipt(params: {
  to: string
  name: string
  amount: number
  plan: string
  paymentMethod: string
  tenantSlug: string
}) {
  if (!process.env.SMTP_HOST) {
    console.warn('[Email] SMTP not configured, skipping receipt email')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whatsai-app-production.up.railway.app'

  try {
    await transporter.sendMail({
      from: `"WhatsAI" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: '✅ Pagamento confirmado - WhatsAI',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Pagamento Confirmado! 🎉</h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Olá <strong>${params.name}</strong>,</p>
            <p style="color: #374151;">Seu pagamento foi confirmado com sucesso! Sua assinatura do WhatsAI já está ativa.</p>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #6b7280; padding: 4px 0;">Plano</td>
                  <td style="text-align: right; font-weight: bold;">${params.plan}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 4px 0;">Valor</td>
                  <td style="text-align: right; font-weight: bold;">R$ ${params.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 4px 0;">Forma</td>
                  <td style="text-align: right;">${params.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 4px 0;">Status</td>
                  <td style="text-align: right; color: #10b981; font-weight: bold;">Aprovado</td>
                </tr>
              </table>
            </div>

            <p style="color: #374151;">Acesse seu dashboard para começar:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${appUrl}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Acessar Dashboard
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">Qualquer dúvida, responda a este email ou chame no WhatsApp (45) 9856-6730.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">WhatsAI - Seu funcionário digital para WhatsApp</p>
          </div>
        </div>
      `,
    })
    console.log('[Email] Receipt sent to', params.to)
  } catch (err) {
    console.error('[Email] Failed to send receipt:', err)
  }
}
