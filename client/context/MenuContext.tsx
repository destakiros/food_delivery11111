
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { FOOD_ITEMS } from '../constants';

interface MenuContextType {
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('innout_menu_data');
    const initial = saved ? JSON.parse(saved) : FOOD_ITEMS;
    return initial.map((item: any) => ({ ...item, isAvailable: item.isAvailable ?? true }));
  });

  useEffect(() => {
    localStorage.setItem('innout_menu_data', JSON.stringify(foodItems));
  }, [foodItems]);

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `item-${Date.now()}`,
      isAvailable: true
    };
    setFoodItems(prev => [newItem, ...prev]);
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setFoodItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  return (
    <MenuContext.Provider value={{ foodItems, addFoodItem, updateFoodItem, deleteFoodItem, toggleAvailability }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
