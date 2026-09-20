// Core domain types for X MART (localStorage-based demo)

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'PROMPTPAY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MEMBER';
export type ProductStatus = 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK';

export interface Category {
  id: string;
  name: string;
  nameTh?: string;
  nameEn?: string;
  icon: string;
  slug?: string;
  description?: string;
  descriptionTh?: string;
  descriptionEn?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameTh?: string;
  nameEn?: string;
  brand?: string;
  category?: string;
  categoryNameTh?: string;
  categoryNameEn?: string;
  description: string;
  descriptionTh?: string;
  descriptionEn?: string;
  price: number;
  image: string;
  imageUrl?: string;  // alias
  categoryId: string;
  stock: number;
  inStock?: boolean;
  isUnlimitedStock: boolean;
  status: ProductStatus;
  isPromotion?: boolean;
  originalPrice?: number;
  promotionPrice?: number;
  promotionLabel?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameTh?: string;
  productNameEn?: string;
  productImage?: string;
  priceAtTimeOfOrder: number;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusUpdatedAt?: string;
  paidAt?: string;
  delivery?: {
    driverName: string;
    driverPhone: string;
    status: string;
  };
  branchId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
  passwordHash?: string;   // Simple demo — stored plaintext for localStorage demo
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'SYSTEM';
  orderNumber?: string;
  read: boolean;
  createdAt: string;
}
