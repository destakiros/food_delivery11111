import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem, size?: string, price?: number, exclusions?: string[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('innout_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('innout_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: FoodItem, size?: string, price?: number, exclusions?: string[]) => {
    const selectedPrice = price || item.price;
    const selectedSize = size || 'Standard';
    const excludedIngredients = exclusions || [];
    
    // Create a unique key for this configuration
    const configKey = `${item.id}-${selectedSize}-${[...excludedIngredients].sort().join(',')}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.cartItemId === configKey);

      if (existingIndex > -1) {
        return prev.map((i, idx) => idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i);
      }

      const newCartItem: CartItem = {
        ...item,
        quantity: 1,
        selectedSize,
        selectedPrice,
        excludedIngredients,
        cartItemId: configKey
      };
      
      return [...prev, newCartItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(cartItemId);
    setCart(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.selectedPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};