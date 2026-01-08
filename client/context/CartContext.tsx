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
    
    // Create a key to identify this specific configuration
    const configKey = `${item.id}-${selectedSize}-${[...excludedIngredients].sort().join(',')}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(i => {
        const iExclusions = i.excludedIngredients || [];
        const iKey = `${i.id}-${i.selectedSize || 'Standard'}-${[...iExclusions].sort().join(',')}`;
        return iKey === configKey;
      });

      if (existingIndex > -1) {
        return prev.map((i, idx) => idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i);
      }

      // Fix: added cartItemId property to satisfy the declared intersection type 'CartItem & { cartItemId: string; }'
      const newCartItem: CartItem & { cartItemId: string } = {
        ...item,
        quantity: 1,
        selectedSize: selectedSize,
        selectedPrice: selectedPrice,
        excludedIngredients: excludedIngredients,
        cartItemId: configKey,
        // Using the configKey as the unique ID for this cart entry
        id: item.id // Keep original ID for item reference
      };
      
      // We'll use the configKey as the key in the UI
      return [...prev, newCartItem];
    });
  };

  const removeFromCart = (configKey: string) => {
    setCart(prev => prev.filter(i => {
      const iExclusions = i.excludedIngredients || [];
      const iKey = `${i.id}-${i.selectedSize || 'Standard'}-${[...iExclusions].sort().join(',')}`;
      return iKey !== configKey;
    }));
  };

  const updateQuantity = (configKey: string, qty: number) => {
    if (qty <= 0) return removeFromCart(configKey);
    setCart(prev => prev.map(i => {
      const iExclusions = i.excludedIngredients || [];
      const iKey = `${i.id}-${i.selectedSize || 'Standard'}-${[...iExclusions].sort().join(',')}`;
      return iKey === configKey ? { ...i, quantity: qty } : i;
    }));
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
