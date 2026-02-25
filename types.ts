
export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PROCESSING = 'Processing',
  DISPATCHED = 'Dispatched',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded'
}

export enum UserRole {
  ADMIN = 'Admin',
  ACCOUNTANT = 'Accountant',
  WAREHOUSE_MANAGER = 'Warehouse Manager',
  LOGISTICS_LEAD = 'Logistics Lead',
  OPERATIONS_SPECIALIST = 'Operations Specialist'
}

export enum Department {
  LONDON = 'London',
  BISSAU = 'Bissau'
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  targetId?: string;
}

export interface ExchangeRate {
  pair: string;
  rate: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Driver {
  id: string;
  name: string;
  avgDeliveryTime: string;
  completionRate: number;
  rating: number;
  totalDeliveries: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: 'Active' | 'Blocked';
  totalOrders: number;
  totalSpentGBP: number;
  joinedAt: string;
}

export interface Recipient {
  name: string;
  location: string;
  phone: string;
}

export interface SavedRecipient extends Recipient {
  id: string;
  customerName: string; // Linked to expat
  addedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  priceGBP: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  recipient: Recipient;
  items: OrderItem[];
  totalGBP: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentRef: string;
  notes?: string;
  isFlagged: boolean;
  driverName?: string;
  podImage?: string; // Base64 or URL for proof of delivery
  trackingId?: string; // External or internal tracking number
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceGBP: number;
  type: 'individual' | 'bundle';
  stock: number;
  category: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  currentStock: number;
  minThreshold: number;
  warehouseLocation: string;
  type?: 'individual' | 'bundle';
  bundleItems?: { productName: string; quantity: number }[];
  category?: 'Value Bundles' | 'Pantry Staples' | 'Hygiene & Care';
  procurementType?: 'In-House' | 'Local Procurement';
}

export interface CartItem extends Product {
  quantity: number;
}
