
import { FoodItem, FoodCategory } from '../types';

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'ff1',
    name: 'Classic Double-Double',
    description: 'Fresh beef patties, slices of American cheese, lettuce, tomato, and secret spread.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Fast Food',
    sizes: [
      { name: 'Single', price: 8.99 },
      { name: 'Double', price: 11.99 }
    ],
    ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Secret Spread', 'Onions']
  },
  {
    id: 'ff2',
    name: 'Animal Style Fries',
    description: 'Hand-cut fries topped with melted cheese, secret spread, and grilled onions.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    category: 'Fast Food',
    sizes: [
      { name: 'Small', price: 5.50 },
      { name: 'Large', price: 8.50 }
    ],
    ingredients: ['Potatoes', 'Cheese', 'Secret Spread', 'Grilled Onions', 'Salt']
  },
  {
    id: 'ff7',
    name: 'Breakfast Sunrise Bagel',
    description: 'Freshly toasted bagel with fluffy eggs, crispy bacon, and a slice of sharp cheddar.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1541288097918-634972410796?auto=format&fit=crop&q=80&w=800',
    category: 'Fast Food',
    sizes: [{ name: 'Standard', price: 6.50 }],
    ingredients: ['Bagel', 'Egg', 'Bacon', 'Cheddar Cheese']
  },
  {
    id: 'p1',
    name: 'Pepperoni Feast',
    description: 'Premium mozzarella and our signature house-made tomato sauce with Italian pepperoni.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza',
    sizes: [
      { name: 'Small', price: 10.99 },
      { name: 'Medium', price: 12.99 },
      { name: 'Large', price: 15.99 }
    ],
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Dough', 'Oregano', 'Garlic Oil']
  },
  {
    id: 'p2',
    name: 'Margherita Bliss',
    description: 'Fresh buffalo mozzarella, garden basil leaves, and sliced tomatoes.',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
    category: 'Pizza',
    sizes: [
      { name: 'Small', price: 11.50 },
      { name: 'Medium', price: 14.50 },
      { name: 'Large', price: 19.50 }
    ],
    ingredients: ['Basil', 'Mozzarella', 'Tomato Sauce', 'Dough', 'Fresh Tomato', 'Olive Oil']
  },
  {
    id: 'p3',
    name: 'The Greek Odyssey',
    description: 'Kalamata olives, feta cheese, sun-dried tomatoes, and oregano on an olive oil base.',
    price: 15.25,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    category: 'Pizza',
    sizes: [{ name: 'Medium', price: 15.25 }, { name: 'Large', price: 21.25 }],
    ingredients: ['Olives', 'Feta', 'Sun-dried Tomato', 'Oregano', 'Olive Oil', 'Spinach']
  },
  {
    id: 'sd1',
    name: 'Classic Soda Pop',
    description: 'Ice cold refreshing soda selection.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [
      { name: 'Small', price: 2.50 },
      { name: 'Medium', price: 3.50 },
      { name: 'Large', price: 4.50 }
    ],
    ingredients: ['Ice', 'Lemon Slice', 'Straw']
  },
  {
    id: 'sd2',
    name: 'Strawberry Lemonade',
    description: 'Hand-squeezed citrus paired with ripe summer strawberry infusion.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1523472721958-978152f4d69b?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Small', price: 3.99 }, { name: 'Medium', price: 4.99 }, { name: 'Large', price: 5.99 }],
    ingredients: ['Ice', 'Strawberry Chunks', 'Mint Leaf', 'Lemon Wheel']
  },
  {
    id: 'sd3',
    name: 'Midnight Root Beer Float',
    description: 'Artisanal root beer served with a dense core of Madagascar vanilla bean.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Standard', price: 5.50 }, { name: 'Premium', price: 7.50 }],
    ingredients: ['Vanilla Ice Cream', 'Whipped Cream', 'Cherry', 'Chocolate Drizzle']
  },
  {
    id: 'sd4',
    name: 'Zesty Ginger Ale',
    description: 'Sharp ginger extract with high carbonation for a refreshing kick.',
    price: 2.95,
    image: 'https://images.unsplash.com/photo-1598679253544-2c97992403ea?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Small', price: 2.95 }, { name: 'Large', price: 4.25 }],
    ingredients: ['Ice', 'Lime Slice', 'Ginger Root Bit']
  },
  {
    id: 'sd5',
    name: 'Blueberry Mint Spritz',
    description: 'Freshly muddled blueberries and mint leaves topped with sparkling tonic.',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    category: 'Soft Drink',
    sizes: [{ name: 'Standard', price: 4.25 }],
    ingredients: ['Muddled Blueberries', 'Fresh Mint', 'Ice', 'Agave Syrup']
  }
];

export const CATEGORIES: FoodCategory[] = ['Fast Food', 'Pizza', 'Soft Drink'];
