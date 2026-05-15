export type Role = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';

export type BankType = 'BCA' | 'BRI' | 'MANDIRI' | 'BNI' | 'DANAMON' | 'CIMB' | 'OCBC';

export type UnitType = 'KG' | 'PIECE';

export type OrderStatus = 'CREATED' | 'PROCESSING' | 'FINISHED' | 'COMPLETED' | 'FAILED';

export type FulfillmentType = 'DELIVERY' | 'PICKUP';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type ReportStatus = 'OPEN' | 'RESOLVED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  id: string;
  name: string;
  rating: number;
  address: string;
  openTime: string;
  closeTime: string;
  businessPhone: string;
  businessEmail: string;
  businessDescription: string;
  bankName: BankType;
  bankAccount: string;
  bankHolder: string;
  logoUrl?: string;
  bannerUrl?: string;
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface MerchantListItem {
  id: string;
  name: string;
  rating: number;
  address: string;
  openTime: string;
  closeTime: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  unit: UnitType;
  description: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  serviceId: string;
}

export interface Payment {
  id: string;
  snapToken?: string;
  snapRedirectUrl?: string;
  transactionId?: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  expiredAt?: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  estimationTime: string;
  fulfillment: FulfillmentType;
  notes?: string;
  customerId: string;
  merchantId: string;
  items: OrderItem[];
  payment?: Payment | { status: PaymentStatus; snapToken?: string; snapRedirectUrl?: string };
  review?: Review;
  report?: Report;
  merchant?: { id: string; name: string; logoUrl?: string };
  customer?: { id: string; name: string; phone: string; address: string };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  orderId: string;
  merchantId: string;
  userId?: string;
  user?: { name: string };
  merchant?: { name: string };
  order?: { id: string };
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  issue: string;
  status: ReportStatus;
  orderId: string;
  userId?: string;
  user?: { name: string };
  order?: { id: string; merchant?: { name: string }; customer?: { name: string } };
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  businessName: string;
  businessOwner: string;
  status: ApplicationStatus;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessDescription: string;
  openTime: string;
  closeTime: string;
  bankType: BankType;
  bankAccount: string;
  bankHolder: string;
  documentUrl: string;
  userId?: string;
  user?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface MerchantDashboard {
  totalRevenue: number;
  completedOrders: number;
  averageRating: number;
  totalReviews: number;
  recentReviews: Review[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: unknown;
}

export interface PaginatedMerchants {
  merchants: MerchantListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface MerchantListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderPayload {
  merchantId: string;
  fulfillment: FulfillmentType;
  notes?: string;
  items: { serviceId: string; quantity: number }[];
}

export interface CartItem extends Service {
  merchantId: string;
  merchantName: string;
  qty: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}
