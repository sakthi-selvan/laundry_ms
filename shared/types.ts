export type OrderStatus = 'received' | 'processing' | 'ready' | 'collected' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'other';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type BillingMode = 'piece' | 'weight';
export type Language = 'en' | 'ta' | 'both';

export interface Customer {
  id: string; name: string; mobile: string; whatsapp: string; address: string | null;
  createdAt: string; totalOrders: number; totalSpent: number; outstandingBalance: number;
  membershipName?: string | null; membershipExpiresAt?: string | null; membershipDiscount?: number; walletBalance?: number;
}
export interface CatalogItem { id: string; name: string; active: boolean; }
export interface PriceEntry { id: string; clothingItemId: string; serviceId: string; clothingName: string; serviceName: string; price: number; billingMode: BillingMode; active: boolean; }
export interface OrderLineInput { clothingItemId: string; serviceId: string; itemName: string; serviceName: string; quantity: number; unitPrice: number; billingMode: BillingMode; notes?: string; }
export interface CreateOrderInput { customerId: string; expectedDeliveryAt: string; discount: number; advance: number; paymentMethod: PaymentMethod; instructions?: string; items: OrderLineInput[]; }
export interface OrderSummary { id: string; orderNumber: string; customerId: string; customerName: string; mobile: string; receivedAt: string; expectedDeliveryAt: string; status: OrderStatus; subtotal: number; discount: number; total: number; paid: number; balance: number; paymentStatus: PaymentStatus; itemCount: number; }
export interface OrderDetail extends OrderSummary { instructions: string | null; items: Array<OrderLineInput & { id: string; total: number }>; payments: Payment[]; }
export interface Payment { id: string; orderId: string; amount: number; method: PaymentMethod; reference: string | null; notes: string | null; createdAt: string; }
export interface DashboardData { metrics: { ordersToday: number; revenueToday: number; pending: number; processing: number; ready: number; completed: number; outstanding: number; }; recentOrders: OrderSummary[]; recentPayments: Array<Payment & { orderNumber: string; customerName: string }>; weeklyRevenue: Array<{ day: string; revenue: number }>; }
export interface ShopSettings { shopName: string; address: string; phone: string; currency: string; receiptFooter: string; terms: string; backupFolder: string; autoBackup: boolean; communicationLanguage: Language; upiId: string; upiPayeeName: string; }
export interface MembershipPlan { id: string; name: string; tamilName: string; price: number; discountPercent: number; validityDays: number; walletCredit: number; active: boolean; }
export interface CustomerMembership { id: string; customerId: string; planId: string; planName: string; startedAt: string; expiresAt: string; walletBalance: number; discountPercent: number; status: 'active' | 'expired' | 'cancelled'; }
export interface ReportData { from: string; to: string; revenue: number; collected: number; orders: number; completed: number; outstanding: number; byService: Array<{ name: string; revenue: number; quantity: number }>; byPayment: Array<{ method: string; amount: number }>; daily: Array<{ date: string; revenue: number; collected: number; orders: number }>; }
export interface LicenseInfo { licenseId: string; activatedAt: string | null; expiresAt: string | null; status: 'active' | 'expiring' | 'expired' | 'unlicensed'; remainingDays: number; lastValidatedAt: string | null; offlineGraceDays: number; }

export interface LaundryAPI {
  dashboard(range?: { from?: string; to?: string }): Promise<DashboardData>;
  customers: { list(query?: string): Promise<Customer[]>; create(input: { name: string; mobile: string; whatsapp?: string; address?: string }): Promise<Customer>; update(id: string, input: Partial<Customer>): Promise<Customer>; remove(id: string): Promise<void>; history(id: string): Promise<{ orders: OrderSummary[]; payments: Payment[] }>; };
  catalog: { get(): Promise<{ clothing: CatalogItem[]; services: CatalogItem[]; prices: PriceEntry[] }>; savePrice(input: { clothingItemId: string; serviceId: string; price: number; billingMode: BillingMode }): Promise<void>; addItem(kind: 'clothing' | 'service', name: string): Promise<CatalogItem>; };
  orders: { list(filters?: Record<string,string>): Promise<OrderSummary[]>; get(id: string): Promise<OrderDetail>; create(input: CreateOrderInput): Promise<OrderDetail>; updateStatus(id: string, status: OrderStatus, reason?: string): Promise<void>; };
  payments: { list(filters?: Record<string,string>): Promise<Array<Payment & { orderNumber: string; customerName: string }>>; add(input: { orderId: string; amount: number; method: PaymentMethod; reference?: string; notes?: string }): Promise<Payment>; upi(orderId: string): Promise<{ uri: string; qrDataUrl: string; amount: number; configured: boolean }>; };
  memberships: { plans(): Promise<MembershipPlan[]>; addPlan(input: Omit<MembershipPlan,'id'|'active'>): Promise<MembershipPlan>; enroll(input: { customerId: string; planId: string }): Promise<CustomerMembership>; customer(customerId: string): Promise<CustomerMembership | null>; useWallet(input: { orderId: string; amount: number }): Promise<Payment>; };
  reports(range: { from: string; to: string }): Promise<ReportData>;
  exportReport(input: { format: 'xlsx' | 'pdf'; from: string; to: string }): Promise<string | null>;
  receipt(input: { orderId: string; layout: 'a4' | 'thermal'; print?: boolean }): Promise<string | null>;
  whatsapp(input: { orderId: string; type: 'confirmation' | 'ready' | 'reminder' }): Promise<void>;
  settings: { get(): Promise<ShopSettings>; save(input: ShopSettings): Promise<void>; };
  backup: { create(): Promise<string | null>; restore(): Promise<boolean>; };
  admin: { login(password: string): Promise<boolean>; changePassword(current: string, next: string): Promise<boolean>; license(): Promise<LicenseInfo>; activate(input: { expiresAt: string }): Promise<LicenseInfo>; audit(): Promise<Array<{ id: string; action: string; entityType: string; entityId: string | null; details: string | null; createdAt: string }>>; };
}
