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
  supportPhone: z.string().regex(/^\d{10,13}$/, "Telefone invalido").optional().or(z.literal("")),
  supportActive: z.boolean().optional(),
  supportPersonality: z.string().max(500, 'Maximo 500 caracteres').optional(),
  supportWelcomeMessage: z.string().max(200, 'Maximo 200 caracteres').optional(),
})

export const createPaymentSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID é obrigatório'),
  plan: z.enum(['BASICO', 'PROFISSIONAL', 'PREMIUM']),
  period: z.enum(['monthly', 'yearly']),
})

export const productSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.number().positive('Preço deve ser positivo'),
  description: z.string().max(500).optional(),
  image: z.string().url('URL inválida').optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  active: z.boolean().optional(),
})

export const categorySchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
})

export const knowledgeSchema = z.object({
  tenantId: z.string().min(1),
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  tags: z.string().optional(),
})


