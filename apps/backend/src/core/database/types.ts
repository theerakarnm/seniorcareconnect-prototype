// Database types for the Flower Gift Application
// These types match the database schema and provide type safety

export interface FlowerCategory {
  id: string
  nameNative: string
  nameTH: string
  descriptionNative?: string
  descriptionTH?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Flower {
  id: string
  nameNative: string
  nameTH: string
  categoryId: string
  image?: string
  previewImage?: string
  basePrice: string // Decimal as string
  descriptionNative?: string
  descriptionTH?: string
  availableColors: string[] // Array of hex colors
  colorPrices: Record<string, number> // Color to price mapping
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface ArrangementSize {
  id: string // 'small' | 'medium' | 'large'
  nameNative: string
  nameTH: string
  minFlowers: number
  maxFlowers: number
  basePrice: string // Decimal as string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface PlacedFlowerData {
  flowerId: string
  x: number
  y: number
  scale: number
  rotation: number
  color: string
  zIndex: number
}

export interface ArrangementTemplate {
  id: string
  nameNative: string
  nameTH: string
  descriptionNative?: string
  descriptionTH?: string
  previewImage?: string
  templateData: {
    flowers: PlacedFlowerData[]
  }
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface AiPreviewStyle {
  id: string
  nameNative: string
  nameTH: string
  descriptionNative?: string
  descriptionTH?: string
  styleNative?: string
  styleTH?: string
  previewImage?: string
  promptTemplate?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface PlacedFlowerOrderData {
  id: string
  flowerId: string
  x: number
  y: number
  scale: number
  rotation: number
  color: string
  zIndex: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  
  // Recipient Information
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  
  // Delivery Address
  deliveryAddress: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  
  // Delivery Options
  deliveryDate: Date
  deliveryTime: 'morning' | 'afternoon' | 'evening'
  specialInstructions?: string
  
  // Message Card
  includeCard: boolean
  cardMessage?: string
  senderName?: string
  
  // Additional Services
  expressDelivery: boolean
  giftWrapping: boolean
  careInstructions: boolean
  
  // Pricing
  subtotal: string // Decimal as string
  deliveryFee: string
  expressDeliveryFee: string
  giftWrappingFee: string
  total: string
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  paymentReference?: string
  
  // Arrangement Details
  arrangementSize: string
  selectedAiStyleId?: string
  arrangementData: {
    placedFlowers: PlacedFlowerOrderData[]
  }
  
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  flowerId: string
  quantity: number
  selectedColor: string
  unitPrice: string // Decimal as string
  totalPrice: string // Decimal as string
  
  // Position Data
  positionX?: string // Decimal as string
  positionY?: string
  scale?: string
  rotation?: string
  zIndex?: number
  
  createdAt: Date
  updatedAt: Date
}

export interface OrderAiPreview {
  id: string
  orderId: string
  aiStyleId: string
  generatedImage?: string
  generationPrompt?: string
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed'
  isSelected: boolean
  generatedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface SystemSetting {
  id: string
  settingKey: string
  settingValue: any // JSON value
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface FlowerWithCategory extends Flower {
  category: FlowerCategory
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  aiPreviews: OrderAiPreview[]
}

export interface OrderSummary {
  id: string
  orderNumber: string
  recipientName: string
  status: Order['status']
  total: string
  deliveryDate: Date
  createdAt: Date
}

// API Request Types
export interface CreateOrderRequest {
  // Recipient Information
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  
  // Delivery Address
  deliveryAddress: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  
  // Delivery Options
  deliveryDate: string // ISO date string
  deliveryTime: 'morning' | 'afternoon' | 'evening'
  specialInstructions?: string
  
  // Message Card
  includeCard: boolean
  cardMessage?: string
  senderName?: string
  
  // Additional Services
  expressDelivery: boolean
  giftWrapping: boolean
  careInstructions: boolean
  
  // Payment
  paymentMethod: string
  
  // Arrangement Details
  arrangementSize: string
  selectedAiStyleId?: string
  placedFlowers: PlacedFlowerOrderData[]
}

export interface UpdateOrderStatusRequest {
  status: Order['status']
  notes?: string
}

export interface GenerateAiPreviewRequest {
  orderId: string
  styleIds: string[]
}

// Utility Types
export type Language = 'en' | 'th'

export interface LocalizedContent {
  nameNative: string
  nameTH: string
  descriptionNative?: string
  descriptionTH?: string
}

export function getLocalizedName(content: LocalizedContent, language: Language): string {
  return language === 'th' ? content.nameTH : content.nameNative
}

export function getLocalizedDescription(content: LocalizedContent, language: Language): string | undefined {
  return language === 'th' ? content.descriptionTH : content.descriptionNative
}