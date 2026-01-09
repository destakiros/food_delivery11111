
import { FoodItem, FoodCategory } from './types';

export const FOOD_ITEMS: FoodItem[] = [
  // BURGERS
  {
    id: 'b1',
    name: 'Double-Double Burger',
    description: 'Two 100% American beef patties, real American cheese, lettuce, tomato, and secret spread.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Burger',
    sizes: [{ name: 'Single', price: 8.99 }, { name: 'Double', price: 11.99 }],
    ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Spread', 'Onions']
  },
  {
    id: 'b2',
    name: 'Western Bacon Burger',
    description: 'Beef patty, crispy onion rings, BBQ sauce, and thick-cut smoked bacon.',
    price: 10.50,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=800',
    category: 'Burger',
    sizes: [{ name: 'Single', price: 10.50 }, { name: 'Double', price: 13.50 }],
    ingredients: ['Beef Patty', 'Bacon', 'Onion Rings', 'BBQ Sauce', 'Cheese']
  },
  {
    id: 'b3',
    name: 'The 4x4 Power Stack',
    description: 'Four beef patties and four slices of real American cheese. The ultimate challenge.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
    category: 'Burger',
    sizes: [{ name: 'Standard', price: 13.50 }],
    ingredients: ['Beef Patty', 'Cheese', 'Spread', 'Onions', 'Lettuce']
  },
  {
    id: 'b4',
    name: 'Mushroom Swiss Burger',
    description: 'Juicy beef patty topped with sautéed portobello mushrooms and melted Swiss cheese.',
    price: 9.75,
    image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&q=80&w=800',
    category: 'Burger',
    sizes: [{ name: 'Single', price: 9.75 }, { name: 'Double', price: 12.75 }],
    ingredients: ['Beef Patty', 'Mushrooms', 'Swiss Cheese', 'Mayo', 'Onions']
  },

  // PIZZAS
  {
    id: 'p1',
    name: 'Pepperoni Feast',
    description: 'Premium mozzarella and signature tomato sauce topped with spicy Italian pepperoni.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza',
    sizes: [{ name: 'Small', price: 10.99 }, { name: 'Medium', price: 12.99 }, { name: 'Large', price: 18.99 }],
    ingredients: ['Pepperoni', 'Cheese', 'Tomato Sauce', 'Dough', 'Oregano']
  },
  {
    id: 'p2',
    name: 'Margherita Bliss',
    description: 'Fresh buffalo mozzarella, garden basil leaves, and extra virgin olive oil.',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
    category: 'Pizza',
    sizes: [{ name: 'Small', price: 11.50 }, { name: 'Medium', price: 14.50 }, { name: 'Large', price: 19.50 }],
    ingredients: ['Mozzarella', 'Basil', 'Tomato Sauce', 'Olive Oil', 'Dough']
  },
  {
    id: 'p3',
    name: 'The Greek Odyssey',
    description: 'Kalamata olives, feta cheese, sun-dried tomatoes, and oregano on an olive oil base.',
    price: 15.25,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    category: 'Pizza',
    sizes: [{ name: 'Medium', price: 15.25 }, { name: 'Large', price: 21.25 }],
    ingredients: ['Olives', 'Feta', 'Sun-dried Tomato', 'Oregano', 'Cheese']
  },

  // SOFT DRINKS
  {
    id: 'sd1',
    name: 'Coca-Cola Classic',
    description: 'The original refreshing cola. Ice-cold and carbonated.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Small', price: 2.50 }, { name: 'Medium', price: 3.50 }, { name: 'Large', price: 4.50 }],
    ingredients: ['Ice', 'Sugar', 'Lemon Slice']
  },
  {
    id: 'sd2',
    name: 'Crispy Sprite',
    description: 'Clear, lemon-lime soda with a crisp, clean taste.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1625772290748-39126cdd9fe9?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Small', price: 2.50 }, { name: 'Medium', price: 3.50 }, { name: 'Large', price: 4.50 }],
    ingredients: ['Ice', 'Lemon Slice', 'Mint']
  },

  // CHICKEN
  {
    id: 'ch1',
    name: 'Atomic Hot Wings',
    description: '10 pieces of ultra-crispy wings tossed in our signature habanero-cayenne fusion sauce.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800',
    category: 'Chicken',
    sizes: [{ name: 'Standard (10pc)', price: 12.50 }, { name: 'Party (20pc)', price: 21.00 }],
    ingredients: ['Habanero Sauce', 'Blue Cheese Dip', 'Celery']
  },

  // CHIPS
  {
    id: 'cs2',
    name: 'Animal Style Chips',
    description: 'Our famous fries topped with melted cheese, secret spread, and grilled onions.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    category: 'Chips',
    sizes: [{ name: 'Standard', price: 5.99 }],
    ingredients: ['Cheese', 'Secret Spread', 'Grilled Onions', 'Salt']
  }
];

export const CATEGORIES: FoodCategory[] = ['Burger', 'Pizza', 'Soft Drink', 'Chicken', 'Chips'];
