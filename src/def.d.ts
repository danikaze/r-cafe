export type Cafeteria = '9f' | '22f' | 'rise' | 'osaka';
export type Time = 'day' | 'night';
export type Ingredient = 'alcohol' | 'beef' | 'chicken' | 'fish' | 'healthy' | 'mutton' | 'pork';
export type Booth = 'Bowl & Donburi & Curry' | 'Bowl A' | 'Bowl B' | 'Bowl' | 'Grill' | 'Halal'
                  | 'Main A' | 'Main B' | 'Main C' | 'Noodles & Pasta' | 'Noodles A' | 'Noodles B'
                  | 'Pasta' | 'Ramen' | 'Udon & Soba';
export type SorterType = 'booth' | 'kcal' | 'carbs' | 'fat' | 'protein' | 'sodium';
export type SorterDirection = 'asc' | 'desc';
export type AjaxStatus = 'waiting' | 'loading' | 'ready' | 'error';
export type Congestion = Partial<{ [key in Cafeteria]: number }>;
export type CafeteriaMenu = { [key in Time]: Dish[] };
export type DayMenu = { [key in Cafeteria]: CafeteriaMenu};
export type WeekMenu = { [date: string]: DayMenu };

export interface Nutrition {
  kcal: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
}

export interface Dish {
  id: number;
  booth: Booth;
  title: string;
  ingredients: Ingredient[];
  nutrition: Nutrition;
  price?: number;
  image: string;
  umai?: number;
}

export interface State {
  status: AjaxStatus;
  cafeteria: Cafeteria;
  time: Time;
  menus: WeekMenu;
  congestion: Congestion;
  sortBy: SorterType;
  sortOrder: SorterDirection;
}
