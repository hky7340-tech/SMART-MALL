// ==================== SHARED TYPES FOR SMART MALL ECOSYSTEM ====================

// ==================== USER & AUTH ====================
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  STORE_OWNER = 'store_owner',
  CUSTOMER = 'customer',
  SHIPPER = 'shipper',
  SECURITY = 'security',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export interface IUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ILoginRequest {
  email?: string;
  phone?: string;
  password: string;
  otp?: string;
}

export interface IRegisterRequest {
  email: string;
  phone: string;
  fullName: string;
  password: string;
}

export interface IOtpRequest {
  phone?: string;
  email?: string;
  type: 'login' | 'register' | 'forgot_password' | 'verify_email' | 'verify_phone';
}

// ==================== STORE ====================
export interface IStore {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  shortDescription?: string;
  logo: string;
  banner?: string;
  images: string[];
  categoryId: string;
  floor: number;
  unit: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  lat: number;
  lng: number;
  status: StoreStatus;
  ownerId: string;
  openTime: string;
  closeTime: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  isFeatured: boolean;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum StoreStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export interface IStoreCategory {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  parentId?: string;
  children: IStoreCategory[];
  order: number;
  isActive: boolean;
}

// ==================== PRODUCT ====================
export interface IProduct {
  id: string;
  storeId: string;
  name: string;
  nameEn?: string;
  description: string;
  shortDescription?: string;
  images: string[];
  videos: string[];
  categoryId: string;
  brand?: string;
  sku: string;
  barcode: string;
  price: number;
  comparePrice?: number;
  costPrice: number;
  discountPercent?: number;
  attributes: IProductAttribute[];
  variants: IProductVariant[];
  inventory: IInventory;
  tags: string[];
  rating: number;
  totalReviews: number;
  totalSold: number;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductAttribute {
  name: string;
  value: string;
}

export interface IProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  comparePrice?: number;
  image?: string;
  inventory: number;
  isActive: boolean;
}

export interface IInventory {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  location?: string;
}

// ==================== ORDER ====================
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  WALLET = 'wallet',
  QR = 'qr',
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  voucherId?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IAddress {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

// ==================== PAYMENT ====================
export interface IPaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  gatewayResponse: any;
  createdAt: Date;
}

// ==================== LOYALTY ====================
export enum MembershipTier {
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  VIP = 'vip',
}

export interface ILoyaltyPoints {
  id: string;
  userId: string;
  points: number;
  lifetimePoints: number;
  tier: MembershipTier;
  tierProgress: number;
  nextTierPoints: number;
  expiringPoints: number;
  expiringDate?: Date;
}

export interface IMembership {
  id: string;
  userId: string;
  tier: MembershipTier;
  startDate: Date;
  endDate?: Date;
  benefits: IMemberBenefit[];
  isActive: boolean;
}

export interface IMemberBenefit {
  name: string;
  description: string;
  discountPercent: number;
  freeShipping: boolean;
  prioritySupport: boolean;
  birthdayGift: boolean;
  holidayGift: boolean;
  specialEvents: boolean;
}

// ==================== VOUCHER & GIFT CARD ====================
export interface IVoucher {
  id: string;
  code: string;
  type: VoucherType;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit: number;
  usageLimitPerUser: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableStores?: string[];
  applicableProducts?: string[];
  applicableCategories?: string[];
  createdAt: Date;
}

export enum VoucherType {
  STORE = 'store',
  MALL = 'mall',
  SHIPPING = 'shipping',
  WELCOME = 'welcome',
  BIRTHDAY = 'birthday',
  EVENT = 'event',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_SHIPPING = 'free_shipping',
}

export interface IGiftCard {
  id: string;
  code: string;
  pin: string;
  senderId?: string;
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  balance: number;
  initialBalance: number;
  currency: string;
  message?: string;
  isRedeemed: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

// ==================== WALLET ====================
export interface IEWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  pinCode?: string;
  createdAt: Date;
}

export interface IWalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  status: TransactionStatus;
  createdAt: Date;
}

export enum WalletTransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  CASHBACK = 'cashback',
  BONUS = 'bonus',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// ==================== PARKING ====================
export interface IParkingSlot {
  id: string;
  slotNumber: string;
  floor: number;
  zone: string;
  type: ParkingSlotType;
  status: ParkingSlotStatus;
  lat: number;
  lng: number;
  vehiclePlate?: string;
  entryTime?: Date;
  updatedAt: Date;
}

export enum ParkingSlotType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  EV = 'ev',
  DISABLED = 'disabled',
}

export enum ParkingSlotStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
}

export interface IParkingTicket {
  id: string;
  ticketNumber: string;
  plateNumber: string;
  vehicleType: string;
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
  fee: number;
  status: ParkingTicketStatus;
  paymentStatus: PaymentStatus;
  qrCode: string;
}

export enum ParkingTicketStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  LOST = 'lost',
}

// ==================== IoT ====================
export interface IIoTSensor {
  id: string;
  deviceId: string;
  type: SensorType;
  name: string;
  location: string;
  status: DeviceStatus;
  value: number;
  unit: string;
  batteryLevel: number;
  lastReading: Date;
  createdAt: Date;
}

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  LIGHT = 'light',
  DOOR = 'door',
  PEOPLE_COUNTER = 'people_counter',
  SMOKE = 'smoke',
  FIRE = 'fire',
  BLE = 'ble',
  RFID = 'rfid',
  BEACON = 'beacon',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}

// ==================== GAMIFICATION ====================
export interface IDailyQuest {
  id: string;
  userId: string;
  type: QuestType;
  name: string;
  description: string;
  requirement: number;
  progress: number;
  reward: IQuestReward;
  isCompleted: boolean;
  isClaimed: boolean;
  date: Date;
  expiresAt: Date;
}

export enum QuestType {
  CHECK_IN = 'check_in',
  STORE_VISIT = 'store_visit',
  PURCHASE = 'purchase',
  REVIEW = 'review',
  SHARE = 'share',
  INVITE_FRIEND = 'invite_friend',
  WATCH_VIDEO = 'watch_video',
  PLAY_GAME = 'play_game',
}

export interface IQuestReward {
  type: 'points' | 'voucher' | 'gift_card' | 'item';
  value: number;
  description: string;
}

// ==================== NOTIFICATION ====================
export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  image?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  PROMOTION = 'promotion',
  ORDER = 'order',
  PAYMENT = 'payment',
  LOYALTY = 'loyalty',
  EVENT = 'event',
  SYSTEM = 'system',
  REMINDER = 'reminder',
}

// ==================== EVENT ====================
export interface IEvent {
  id: string;
  name: string;
  description: string;
  images: string[];
  startDate: Date;
  endDate: Date;
  location: string;
  type: EventType;
  capacity: number;
  registeredCount: number;
  isActive: boolean;
  organizer: string;
  tags: string[];
  createdAt: Date;
}

export enum EventType {
  PROMOTION = 'promotion',
  ENTERTAINMENT = 'entertainment',
  WORKSHOP = 'workshop',
  EXHIBITION = 'exhibition',
  FOOD = 'food',
  KIDS = 'kids',
  MUSIC = 'music',
  SPORTS = 'sports',
}

// ==================== AI ====================
export interface IAIChat {
  id: string;
  userId: string;
  messages: IAIChatMessage[];
  context: string;
  createdAt: Date;
}

export interface IAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IAIRecommendation {
  userId: string;
  products: string[];
  stores: string[];
  category: string;
  score: number;
  reason: string;
}

// ==================== BOOKING ====================
export interface IBooking {
  id: string;
  userId: string;
  storeId: string;
  type: BookingType;
  date: Date;
  time: string;
  duration: number;
  guests: number;
  notes?: string;
  status: BookingStatus;
  createdAt: Date;
}

export enum BookingType {
  TABLE = 'table',
  SERVICE = 'service',
  MEETING_ROOM = 'meeting_room',
  SPORTS = 'sports',
  EVENT = 'event',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ==================== CRM ====================
export interface ICustomer {
  id: string;
  userId: string;
  totalSpent: number;
  totalOrders: number;
  lastVisit: Date;
  visitCount: number;
  preferences: string[];
  segments: string[];
  tags: string[];
  notes: string;
  birthDate?: Date;
  anniversary?: Date;
}

export interface ICampaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  target: CampaignTarget;
  channels: string[];
  content: any;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  metrics: ICampaignMetrics;
  createdAt: Date;
}

export enum CampaignType {
  PROMOTION = 'promotion',
  EVENT = 'event',
  LOYALTY = 'loyalty',
  WELCOME = 'welcome',
  REACTIVATION = 'reactivation',
}

export enum CampaignTarget {
  ALL_CUSTOMERS = 'all_customers',
  NEW_CUSTOMERS = 'new_customers',
  VIP_MEMBERS = 'vip_members',
  INACTIVE_CUSTOMERS = 'inactive_customers',
  SPECIFIC_SEGMENTS = 'specific_segments',
  LOCATION_BASED = 'location_based',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ICampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface ICampaignTarget {
  segments: string[];
  locations: string[];
  tiers: string[];
  minOrders?: number;
  minSpent?: number;
  maxSpent?: number;
}

// ==================== ERP ====================
export interface IInvoiceItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tax?: number;
}

export interface IInvoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  vendorId?: string;
  customerId?: string;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidDate?: Date;
  notes: string;
  createdAt: Date;
}

export enum InvoiceType {
  PURCHASE = 'purchase',
  SALES = 'sales',
  EXPENSE = 'expense',
  REVENUE = 'revenue',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export interface IEmployee {
  id: string;
  userId: string;
  employeeCode: string;
  department: string;
  position: string;
  salary: number;
  startDate: Date;
  endDate?: Date;
  status: EmployeeStatus;
  documents: string[];
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

// ==================== INDOOR NAVIGATION ====================
export interface IMapNode {
  id: string;
  floor: number;
  x: number;
  y: number;
  type: MapNodeType;
  name: string;
  storeId?: string;
  connections: string[];
}

export enum MapNodeType {
  ENTRANCE = 'entrance',
  EXIT = 'exit',
  ELEVATOR = 'elevator',
  ESCALATOR = 'escalator',
  STAIRS = 'stairs',
  STORE = 'store',
  RESTROOM = 'restroom',
  PARKING = 'parking',
  FOOD_COURT = 'food_court',
  ATM = 'atm',
  INFO = 'info',
  WIFI = 'wifi',
}

// ==================== REPORTING ====================
export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  storeIds?: string[];
  categoryIds?: string[];
  userIds?: string[];
  status?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface IReport {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReportType {
  REVENUE = 'revenue',
  SALES = 'sales',
  CUSTOMER = 'customer',
  INVENTORY = 'inventory',
  EMPLOYEE = 'employee',
  MARKETING = 'marketing',
  PARKING = 'parking',
  TRAFFIC = 'traffic',
  STORE = 'store',
  AI_INSIGHTS = 'ai_insights',
}

export enum ReportFormat {
  EXCEL = 'excel',
  PDF = 'pdf',
  CSV = 'csv',
  JSON = 'json',
}

// ==================== SYSTEM ====================
export interface ISystemConfig {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isPublic: boolean;
  updatedAt: Date;
}

export interface IAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// ==================== MARKETPLACE ====================
export interface IStoreCommission {
  storeId: string;
  categoryId: string;
  commissionRate: number;
  fixedFee: number;
  monthlyFee: number;
  transactionFee: number;
}

// ==================== PAGINATION & RESPONSE ====================
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPagination;
  error?: IApiError;
}

export interface IApiError {
  code: string;
  message: string;
  details?: any;
}

// ==================== SEO ====================
export interface ISeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl?: string;
  schema?: any;
}

// ==================== DIGITAL SIGNAGE ====================
export interface IDigitalSignage {
  id: string;
  name: string;
  location: string;
  resolution: string;
  orientation: 'landscape' | 'portrait';
  content: ISignageContent[];
  schedule: ISignageSchedule;
  status: DeviceStatus;
  lastSync: Date;
}

export interface ISignageContent {
  type: 'image' | 'video' | 'html' | 'url';
  url: string;
  duration: number;
  order: number;
}

export interface ISignageSchedule {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  timezone: string;
}

