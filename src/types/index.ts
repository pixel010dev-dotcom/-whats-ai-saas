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
}
