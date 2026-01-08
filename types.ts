
export type OrderStatus = 'Pending' | 'Approved' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type FoodCategory = 'Burger' | 'Pizza' | 'Soft Drink' | 'Chicken' | 'Chips';
export type UserStatus = 'Active' | 'Suspended';

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'admin';
  status: UserStatus;
  suspensionEnd?: string;
  notifications: Notification[];
}

export interface FoodSize {
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; 
  image: string;
  category: FoodCategory;
  sizes?: FoodSize[];
  ingredients?: string[];
  isAvailable?: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedSize?: string;
  selectedPrice: number;
  excludedIngredients?: string[];
  cartItemId: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  timestamp: string;
  message?: string;
  review?: Review;
  instructions?: string;
  address?: string;
  trackingCoords?: {
    lat: number;
    lng: number;
  };
}

export type AppView = 'home' | 'menu' | 'login' | 'register' | 'admin' | 'orders' | 'tray' | 'support' | 'about' | 'profile' | 'tracker';
