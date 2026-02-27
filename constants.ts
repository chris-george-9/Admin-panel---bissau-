
import { Order, OrderStatus, Product, InventoryItem, User, UserRole, Department, Customer, ActivityLog, Driver } from './types';

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Thai Jasmine Rice (25kg)', description: 'A-Grade aromatic fragrant rice.', priceGBP: 35.00, type: 'individual', stock: 120, category: 'Staples' },
  { id: 'p2', name: 'Vegetable Oil (5L)', description: 'Pure refined vegetable cooking oil.', priceGBP: 9.50, type: 'individual', stock: 240, category: 'Oils' },
  { id: 'p3', name: 'Cane Sugar (5kg)', description: 'Fine granulated white sugar.', priceGBP: 7.00, type: 'individual', stock: 180, category: 'Staples' },
  { id: 'p4', name: 'Rice & Oil Combo', description: '25kg Long Grain Rice + 5L Vegetable Oil.', priceGBP: 42.00, type: 'bundle', stock: 50, category: 'Combos' },
  { id: 'p5', name: 'Mega Family Bundle', description: '50kg Rice, 10L Oil, 10kg Sugar, 5kg Milk Powder.', priceGBP: 95.00, type: 'bundle', stock: 30, category: 'Combos' },
  { id: 'p6', name: 'Hygiene Essentials Kit', description: 'Toothpaste (3), Soap (6), Detergent (2kg).', priceGBP: 15.00, type: 'bundle', stock: 85, category: 'Hygiene' },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Antonio Silva', avgDeliveryTime: '1.2h', completionRate: 98.5, rating: 4.9, totalDeliveries: 450 },
  { id: 'd2', name: 'Buba Sanha', avgDeliveryTime: '2.5h', completionRate: 94.2, rating: 4.7, totalDeliveries: 210 },
  { id: 'd3', name: 'Domingos Gomes', avgDeliveryTime: '1.8h', completionRate: 96.0, rating: 4.8, totalDeliveries: 385 },
  { id: 'd4', name: 'Fatima Cassama', avgDeliveryTime: '1.5h', completionRate: 99.1, rating: 5.0, totalDeliveries: 125 },
  { id: 'd5', name: 'Malam Sambu', avgDeliveryTime: '3.1h', completionRate: 88.5, rating: 4.2, totalDeliveries: 540 },
  { id: 'd6', name: 'Contractor: Express Trans', avgDeliveryTime: '4.0h', completionRate: 92.0, rating: 4.5, totalDeliveries: 1200 }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alvaro Dinis', email: 'alvaro@nhakinhon.com', role: UserRole.ADMIN, department: Department.LONDON, status: 'Active', lastLogin: '2024-05-15T09:00:00Z' },
  { id: 'u2', name: 'Beatriz Gomes', email: 'beatriz@nhakinhon.com', role: UserRole.ACCOUNTANT, department: Department.LONDON, status: 'Active', lastLogin: '2024-05-14T17:30:00Z' },
  { id: 'u3', name: 'Ibrahim Sanha', email: 'ibrahim@nhakinhon.com', role: UserRole.WAREHOUSE_MANAGER, department: Department.BISSAU, status: 'Active', lastLogin: '2024-05-15T07:15:00Z' },
  { id: 'u4', name: 'Moussa Balde', email: 'moussa@nhakinhon.com', role: UserRole.LOGISTICS_LEAD, department: Department.BISSAU, status: 'Active', lastLogin: '2024-05-15T08:45:00Z' },
  { id: 'u5', name: 'Elena Costa', email: 'elena@nhakinhon.com', role: UserRole.OPERATIONS_SPECIALIST, department: Department.BISSAU, status: 'Active', lastLogin: '2024-05-13T10:00:00Z' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Kojo Mensah', email: 'kojo.mensah@example.co.uk', phone: '+44 7700 900123', country: 'UK', status: 'Active', totalOrders: 12, totalSpentGBP: 840.50, joinedAt: '2023-11-10T10:00:00Z' },
  { id: 'c2', name: 'Sarah Jalloh', email: 's.jalloh@example.fr', phone: '+33 6 12 34 56 78', country: 'France', status: 'Active', totalOrders: 5, totalSpentGBP: 320.00, joinedAt: '2024-01-15T14:30:00Z' },
  { id: 'c3', name: 'Fatima Balde', email: 'f.balde@example.pt', phone: '+351 912 345 678', country: 'Portugal', status: 'Active', totalOrders: 28, totalSpentGBP: 2150.75, joinedAt: '2023-05-20T09:15:00Z' },
  { id: 'c4', name: 'Ricardo Silva', email: 'r.silva@example.com', phone: '+44 7700 900456', country: 'UK', status: 'Blocked', totalOrders: 1, totalSpentGBP: 45.00, joinedAt: '2024-04-02T11:45:00Z' },
  { id: 'c5', name: 'Amadou Diallo', email: 'a.diallo@example.de', phone: '+49 151 23456789', country: 'Germany', status: 'Active', totalOrders: 8, totalSpentGBP: 560.20, joinedAt: '2023-08-12T16:20:00Z' },
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  { id: 'a1', userId: 'u1', userName: 'Alvaro Dinis', action: 'Approved high-risk order BX-1003', timestamp: '2024-05-15T12:05:00Z', targetId: 'o3' },
  { id: 'a2', userId: 'u3', userName: 'Ibrahim Sanha', action: 'Adjusted stock for Rice (25kg)', timestamp: '2024-05-15T11:45:00Z', targetId: 'i1' },
  { id: 'a3', userId: 'u4', userName: 'Moussa Balde', action: 'Assigned driver Antonio Silva to BX-1002', timestamp: '2024-05-15T09:15:00Z', targetId: 'o2' },
];

export const DEFAULT_EXCHANGE_RATE = 765.42; // GBP to XOF

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'BX-1001',
    customerName: 'Kojo Mensah',
    recipient: { name: 'Maria Dinis', location: 'Bissau - Praça', phone: '+245 95551234' },
    items: [{ id: 'p1', name: 'Thai Jasmine Rice (25kg)', priceGBP: 35.00, quantity: 2 }],
    totalGBP: 70.00,
    status: OrderStatus.PAID,
    createdAt: '2024-05-15T10:30:00Z',
    updatedAt: '2024-05-15T11:00:00Z',
    paymentRef: 'STRIPE_482910',
    isFlagged: false
  },
  {
    id: 'o2',
    orderNumber: 'BX-1002',
    customerName: 'Sarah Jalloh',
    recipient: { name: 'Ibrahim Jalloh', location: 'Gabú', phone: '+245 96667890' },
    items: [{ id: 'p5', name: 'Mega Family Bundle', priceGBP: 95.00, quantity: 1 }],
    totalGBP: 95.00,
    status: OrderStatus.DISPATCHED,
    createdAt: '2024-05-14T14:20:00Z',
    updatedAt: '2024-05-15T09:15:00Z',
    paymentRef: 'STRIPE_991023',
    isFlagged: false,
    driverName: 'Antonio Silva'
  },
  {
    id: 'o3',
    orderNumber: 'BX-1003',
    customerName: 'Fatima Balde',
    recipient: { name: 'Moussa Balde', location: 'Bafatá', phone: '+245 95554321' },
    items: [{ id: 'p6', name: 'Hygiene Essentials Kit', priceGBP: 15.00, quantity: 3 }],
    totalGBP: 45.00,
    status: OrderStatus.PENDING,
    createdAt: '2024-05-15T12:00:00Z',
    updatedAt: '2024-05-15T12:00:00Z',
    paymentRef: 'PENDING',
    isFlagged: true,
    notes: 'Large quantity of hygiene kits requested in short time.'
  },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'i1', productName: 'Long Grain Rice (25kg)', currentStock: 450, minThreshold: 100, warehouseLocation: 'Bissau Central', type: 'individual', category: 'Pantry Staples', procurementType: 'In-House' },
  { id: 'i2', productName: 'Vegetable Oil (5L)', currentStock: 80, minThreshold: 150, warehouseLocation: 'Bissau Central', type: 'individual', category: 'Pantry Staples', procurementType: 'In-House' }, 
  { id: 'i3', productName: 'Cane Sugar (5kg)', currentStock: 200, minThreshold: 50, warehouseLocation: 'Bafatá Satellite', type: 'individual', category: 'Pantry Staples', procurementType: 'Local Procurement' },
  { 
    id: 'i4', 
    productName: 'Family Essentials Pack', 
    currentStock: 25, 
    minThreshold: 10, 
    warehouseLocation: 'Bissau Central', 
    type: 'bundle',
    category: 'Value Bundles',
    procurementType: 'In-House',
    bundleItems: [
      { productName: 'Long Grain Rice (25kg)', quantity: 1 },
      { productName: 'Vegetable Oil (5L)', quantity: 2 }
    ]
  }
];

export const REVENUE_DATA = [
  { day: 'Mon', revenue: 450 },
  { day: 'Tue', revenue: 620 },
  { day: 'Wed', revenue: 380 },
  { day: 'Thu', revenue: 890 },
  { day: 'Fri', revenue: 1100 },
  { day: 'Sat', revenue: 950 },
  { day: 'Sun', revenue: 520 },
];
