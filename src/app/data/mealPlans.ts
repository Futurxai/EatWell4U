export interface CookTimes {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export interface MealCalories {
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
}

export interface DayMacros {
  protein: number; // grams
  carbs: number;
  fat: number;
}

export interface DayMeal {
  day: string;
  dayShort: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  cookTimes: CookTimes;
  calories: MealCalories;
  macros: DayMacros;
}

export interface GroceryItem {
  name: string;
  qty: string;
  cost: number;
  budgetCost: number;
}

// ─── Vegetarian Meal Plan ─────────────────────────────────────────────────────
export const vegMealPlan: DayMeal[] = [
  {
    day: 'Monday', dayShort: 'MON',
    breakfast: 'Idli (3) + Sambar & Coconut Chutney',
    lunch:     'Dal Tadka + Jeera Rice + Aloo Sabzi',
    dinner:    'Chapati (2) + Palak Paneer + Raita',
    snacks:    'Mixed Fruit Bowl + Green Tea',
    cookTimes: { breakfast: '15 min', lunch: '30 min', dinner: '35 min', snacks: '5 min' },
    calories:  { breakfast: 280, lunch: 520, dinner: 480, snacks: 120 },
    macros:    { protein: 48, carbs: 195, fat: 38 },
  },
  {
    day: 'Tuesday', dayShort: 'TUE',
    breakfast: 'Vegetable Poha + Buttermilk',
    lunch:     'Rajma Chawal + Sliced Cucumber Salad',
    dinner:    'Chapati (2) + Aloo Gobi + Dal Soup',
    snacks:    'Roasted Chana + Coconut Water',
    cookTimes: { breakfast: '10 min', lunch: '35 min', dinner: '30 min', snacks: '5 min' },
    calories:  { breakfast: 320, lunch: 540, dinner: 450, snacks: 130 },
    macros:    { protein: 52, carbs: 210, fat: 36 },
  },
  {
    day: 'Wednesday', dayShort: 'WED',
    breakfast: 'Rava Upma + Coconut Chutney',
    lunch:     'Chole Masala + Jeera Rice + Salad',
    dinner:    'Moong Dal Khichdi + Raita + Pickle',
    snacks:    'Banana + 10 Soaked Almonds',
    cookTimes: { breakfast: '15 min', lunch: '40 min', dinner: '25 min', snacks: '2 min' },
    calories:  { breakfast: 310, lunch: 560, dinner: 440, snacks: 165 },
    macros:    { protein: 55, carbs: 215, fat: 40 },
  },
  {
    day: 'Thursday', dayShort: 'THU',
    breakfast: 'Dosa (2) + Sambar + Green Chutney',
    lunch:     'Kadhi + Jeera Rice + Papad',
    dinner:    'Chapati (2) + Dal Makhani + Salad',
    snacks:    'Sprouts Chaat + Lemon Water',
    cookTimes: { breakfast: '20 min', lunch: '30 min', dinner: '35 min', snacks: '5 min' },
    calories:  { breakfast: 350, lunch: 510, dinner: 500, snacks: 110 },
    macros:    { protein: 50, carbs: 205, fat: 42 },
  },
  {
    day: 'Friday', dayShort: 'FRI',
    breakfast: 'Aloo Paratha (1) + Curd + Pickle',
    lunch:     'Paneer Bhurji + Roti (2) + Salad',
    dinner:    'Chapati (2) + Palak Dal + Mixed Sabzi',
    snacks:    'Buttermilk + 2 Digestive Biscuits',
    cookTimes: { breakfast: '20 min', lunch: '25 min', dinner: '30 min', snacks: '2 min' },
    calories:  { breakfast: 360, lunch: 530, dinner: 460, snacks: 130 },
    macros:    { protein: 58, carbs: 195, fat: 45 },
  },
  {
    day: 'Saturday', dayShort: 'SAT',
    breakfast: 'Oats Porridge + Banana + Honey',
    lunch:     'Vegetable Pulao + Boondi Raita',
    dinner:    'Clear Vegetable Soup + Chapati (2)',
    snacks:    'Mixed Nuts (handful) + Coconut Water',
    cookTimes: { breakfast: '10 min', lunch: '30 min', dinner: '25 min', snacks: '2 min' },
    calories:  { breakfast: 350, lunch: 500, dinner: 380, snacks: 160 },
    macros:    { protein: 44, carbs: 200, fat: 42 },
  },
  {
    day: 'Sunday', dayShort: 'SUN',
    breakfast: 'Daliya Porridge + Warm Milk',
    lunch:     'Sambar Rice + Papad + Mango Pickle',
    dinner:    'Chapati (2) + Matar Paneer + Salad',
    snacks:    'Fruit Chaat + Masala Green Tea',
    cookTimes: { breakfast: '15 min', lunch: '30 min', dinner: '35 min', snacks: '5 min' },
    calories:  { breakfast: 320, lunch: 510, dinner: 500, snacks: 130 },
    macros:    { protein: 50, carbs: 205, fat: 40 },
  },
];

// ─── Non-Veg Meal Plan ────────────────────────────────────────────────────────
export const nonVegMealPlan: DayMeal[] = [
  {
    day: 'Monday', dayShort: 'MON',
    breakfast: 'Egg Bhurji (2 eggs) + Brown Bread Toast',
    lunch:     'Chicken Curry + Steamed Rice + Salad',
    dinner:    'Chapati (2) + Mutton Stew + Raita',
    snacks:    'Boiled Egg (1) + Masala Green Tea',
    cookTimes: { breakfast: '10 min', lunch: '40 min', dinner: '45 min', snacks: '8 min' },
    calories:  { breakfast: 350, lunch: 580, dinner: 560, snacks: 80 },
    macros:    { protein: 90, carbs: 165, fat: 55 },
  },
  {
    day: 'Tuesday', dayShort: 'TUE',
    breakfast: 'Masala Omelette (2 eggs) + Whole Wheat Bread',
    lunch:     'Fish Curry + Jeera Rice + Cucumber Salad',
    dinner:    'Chapati (2) + Chicken Sabzi + Dal',
    snacks:    'Roasted Chana + Coconut Water',
    cookTimes: { breakfast: '10 min', lunch: '35 min', dinner: '35 min', snacks: '5 min' },
    calories:  { breakfast: 380, lunch: 550, dinner: 520, snacks: 130 },
    macros:    { protein: 95, carbs: 160, fat: 52 },
  },
  {
    day: 'Wednesday', dayShort: 'WED',
    breakfast: 'Egg Paratha (1) + Curd + Pickle',
    lunch:     'Egg Fried Rice + Veg Clear Soup',
    dinner:    'Grilled Chicken (100g) + Salad + Chapati (2)',
    snacks:    'Mixed Fruits + Buttermilk',
    cookTimes: { breakfast: '20 min', lunch: '25 min', dinner: '30 min', snacks: '5 min' },
    calories:  { breakfast: 400, lunch: 510, dinner: 480, snacks: 140 },
    macros:    { protein: 88, carbs: 170, fat: 50 },
  },
  {
    day: 'Thursday', dayShort: 'THU',
    breakfast: 'Boiled Eggs (2) + Rava Upma',
    lunch:     'Prawn Masala + Jeera Rice + Papad',
    dinner:    'Chapati (2) + Chicken Dal + Raita',
    snacks:    'Roasted Peanuts + Green Tea',
    cookTimes: { breakfast: '15 min', lunch: '35 min', dinner: '30 min', snacks: '5 min' },
    calories:  { breakfast: 360, lunch: 540, dinner: 510, snacks: 120 },
    macros:    { protein: 92, carbs: 158, fat: 54 },
  },
  {
    day: 'Friday', dayShort: 'FRI',
    breakfast: 'Egg Sandwich + Fresh Orange Juice',
    lunch:     'Chicken Biryani (1 plate) + Raita',
    dinner:    'Fish Tikka (100g) + Chapati (2) + Salad',
    snacks:    'Banana + Green Tea',
    cookTimes: { breakfast: '10 min', lunch: '45 min', dinner: '30 min', snacks: '2 min' },
    calories:  { breakfast: 380, lunch: 620, dinner: 490, snacks: 90 },
    macros:    { protein: 96, carbs: 168, fat: 52 },
  },
  {
    day: 'Saturday', dayShort: 'SAT',
    breakfast: 'Oats Porridge + Boiled Egg (1)',
    lunch:     'Egg Curry + Steamed Rice + Salad',
    dinner:    'Chicken Clear Soup + Brown Bread',
    snacks:    'Mixed Nuts + Coconut Water',
    cookTimes: { breakfast: '12 min', lunch: '30 min', dinner: '25 min', snacks: '2 min' },
    calories:  { breakfast: 330, lunch: 530, dinner: 380, snacks: 160 },
    macros:    { protein: 78, carbs: 148, fat: 48 },
  },
  {
    day: 'Sunday', dayShort: 'SUN',
    breakfast: 'Egg Dosa (2) + Sambar + Chutney',
    lunch:     'Fish Pulao + Salad + Pickle',
    dinner:    'Chapati (2) + Mutton Keema + Raita',
    snacks:    'Fruit Salad + Masala Green Tea',
    cookTimes: { breakfast: '20 min', lunch: '40 min', dinner: '45 min', snacks: '5 min' },
    calories:  { breakfast: 420, lunch: 580, dinner: 580, snacks: 120 },
    macros:    { protein: 100, carbs: 175, fat: 60 },
  },
];

// ─── Day accent colours ───────────────────────────────────────────────────────
export const dayColors: Record<string, { bg: string; text: string; accent: string }> = {
  Monday:    { bg: '#E8F5E9', text: '#2E7D32', accent: '#4CAF50' },
  Tuesday:   { bg: '#E3F2FD', text: '#1565C0', accent: '#42A5F5' },
  Wednesday: { bg: '#FFF3E0', text: '#BF360C', accent: '#FF7043' },
  Thursday:  { bg: '#F3E5F5', text: '#6A1B9A', accent: '#AB47BC' },
  Friday:    { bg: '#FCE4EC', text: '#880E4F', accent: '#EC407A' },
  Saturday:  { bg: '#E0F7FA', text: '#006064', accent: '#00BCD4' },
  Sunday:    { bg: '#FFF8E1', text: '#E65100', accent: '#FFA726' },
};

// ─── Grocery lists ────────────────────────────────────────────────────────────
export const vegGroceryList: GroceryItem[] = [
  { name: 'Idli/Dosa Batter',       qty: '1 kg',    cost: 65,  budgetCost: 40 },
  { name: 'Poha',                   qty: '500g',    cost: 40,  budgetCost: 35 },
  { name: 'Rava (Semolina)',         qty: '500g',    cost: 35,  budgetCost: 30 },
  { name: 'Oats',                   qty: '500g',    cost: 85,  budgetCost: 60 },
  { name: 'Whole Wheat Atta',       qty: '2 kg',    cost: 90,  budgetCost: 70 },
  { name: 'Rice',                   qty: '2 kg',    cost: 100, budgetCost: 80 },
  { name: 'Toor Dal',               qty: '500g',    cost: 75,  budgetCost: 65 },
  { name: 'Moong Dal',              qty: '500g',    cost: 70,  budgetCost: 60 },
  { name: 'Rajma',                  qty: '500g',    cost: 80,  budgetCost: 65 },
  { name: 'Chole (Chickpeas)',      qty: '500g',    cost: 70,  budgetCost: 55 },
  { name: 'Paneer',                 qty: '200g',    cost: 80,  budgetCost: 55 },
  { name: 'Spinach (Palak)',        qty: '1 bunch', cost: 30,  budgetCost: 25 },
  { name: 'Mixed Vegetables',       qty: '1 kg',    cost: 80,  budgetCost: 60 },
  { name: 'Tomatoes',               qty: '500g',    cost: 30,  budgetCost: 25 },
  { name: 'Onions',                 qty: '1 kg',    cost: 40,  budgetCost: 35 },
  { name: 'Ginger-Garlic Paste',   qty: '100g',    cost: 20,  budgetCost: 15 },
  { name: 'Curd (Yogurt)',          qty: '500g',    cost: 40,  budgetCost: 30 },
  { name: 'Coconut (for chutney)', qty: '1 pc',    cost: 30,  budgetCost: 25 },
  { name: 'Mixed Fruits',           qty: '1 kg',    cost: 150, budgetCost: 90 },
  { name: 'Almonds & Mixed Nuts',  qty: '100g',    cost: 120, budgetCost: 60 },
  { name: 'Banana',                 qty: '1 dozen', cost: 60,  budgetCost: 50 },
  { name: 'Green Tea / Masala Tea', qty: '50g pack',cost: 50,  budgetCost: 40 },
];

export const nonVegGroceryList: GroceryItem[] = [
  { name: 'Eggs',                     qty: '1 dozen',  cost: 90,  budgetCost: 80 },
  { name: 'Chicken (curry cut)',      qty: '1 kg',     cost: 220, budgetCost: 180 },
  { name: 'Fish (fresh)',             qty: '500g',     cost: 180, budgetCost: 130 },
  { name: 'Mutton',                   qty: '500g',     cost: 360, budgetCost: 280 },
  { name: 'Prawns',                   qty: '250g',     cost: 200, budgetCost: 150 },
  { name: 'Brown / Whole Wheat Bread',qty: '1 loaf',   cost: 60,  budgetCost: 45 },
  { name: 'Whole Wheat Atta',         qty: '1 kg',     cost: 50,  budgetCost: 40 },
  { name: 'Rice',                     qty: '2 kg',     cost: 100, budgetCost: 80 },
  { name: 'Mixed Dal',                qty: '500g',     cost: 70,  budgetCost: 55 },
  { name: 'Oats',                     qty: '500g',     cost: 85,  budgetCost: 60 },
  { name: 'Onions',                   qty: '1 kg',     cost: 40,  budgetCost: 35 },
  { name: 'Tomatoes',                 qty: '500g',     cost: 30,  budgetCost: 25 },
  { name: 'Ginger-Garlic Paste',     qty: '100g',     cost: 20,  budgetCost: 15 },
  { name: 'Curd (Yogurt)',            qty: '500g',     cost: 40,  budgetCost: 30 },
  { name: 'Mixed Vegetables',         qty: '500g',     cost: 50,  budgetCost: 40 },
  { name: 'Mixed Fruits',             qty: '1 kg',     cost: 150, budgetCost: 90 },
  { name: 'Mixed Nuts',               qty: '100g',     cost: 120, budgetCost: 60 },
  { name: 'Banana',                   qty: '1 dozen',  cost: 60,  budgetCost: 50 },
  { name: 'Green Tea / Masala Tea',  qty: '50g pack', cost: 50,  budgetCost: 40 },
  { name: 'Coconut Water',            qty: '6 pcs',    cost: 120, budgetCost: 80 },
];

// ─── Quotes ───────────────────────────────────────────────────────────────────
export const motivationalQuotes = [
  { quote: 'Let food be thy medicine and medicine be thy food.', author: 'Hippocrates' },
  { quote: "Take care of your body. It's the only place you have to live.", author: 'Jim Rohn' },
  { quote: 'Every healthy meal is a step toward a better you.', author: 'EatWell' },
  { quote: 'Your diet is a bank account. Good food choices are good investments.', author: 'Bethenny Frankel' },
  { quote: 'A healthy outside starts from the inside.', author: 'Robert Urich' },
  { quote: "Don't eat less, eat right.", author: 'EatWell' },
  { quote: 'Small steps every day lead to big changes every year.', author: 'EatWell' },
];
