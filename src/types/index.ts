export interface DashboardMetrics {
  conversationsToday: number
  totalConversations: number
  customers: number
  messagesToday: number
  revenue: number
  activeConversations: number
}

export interface ConversationSummary {
  id: string
  customerName: string
  customerPhone: string
  lastMessage: string
  status: string
  createdAt: string
  lastMessageAt: string
}

export interface CustomerSummary {
  id: string
  name: string
  phone: string
  email: string
  totalSpent: number
  totalOrders: number
  lastContact: string
}

export interface SettingsData {
  aiPersonality: string
  welcomeMessage: string
  businessHours: string
  autoReply: boolean
  supportPhone?: string
  supportActive?: boolean
  supportPersonality?: string
  supportWelcomeMessage?: string
}

export interface PriceInfo {
  monthly: number
  yearly: number
}

export interface PlanInfo {
  name: string
  slug: string
  description: string
  price: PriceInfo
  features: string[]
  popular: boolean
}

export interface ProductData {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  active: boolean
  categoryId: string | null
  category: { id: string; name: string } | null
}

export interface CategoryData {
  id: string
  name: string
  slug: string | null
  parentId: string | null
}

export interface SubscriptionData {
  id: string
  plan: string
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAt: string | null
  mpId: string | null
}

export interface PaymentData {
  id: string
  amount: number
  currency: string
  status: string
  method: string | null
  mpPaymentId: string | null
  paidAt: string | null
  createdAt: string
}

export interface KnowledgeData {
  id: string
  title: string
  content: string
  tags: string | null
}



