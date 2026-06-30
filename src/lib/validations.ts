import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  empresa: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
})

export const chatSchema = z.object({
  message: z.string().min(1, 'Mensagem é obrigatória'),
  tenantId: z.string().min(1, 'Tenant ID é obrigatório'),
  customerPhone: z.string().optional(),
  customerName: z.string().optional(),
})

export const settingsSchema = z.object({
  aiPersonality: z.string().max(500, 'Máximo 500 caracteres').optional(),
  welcomeMessage: z.string().max(200, 'Máximo 200 caracteres').optional(),
  businessHours: z.string().max(100, 'Máximo 100 caracteres').optional(),
  autoReply: z.boolean().optional(),
})
