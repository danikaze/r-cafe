import { SorterDirection, SorterType, Dish } from '../def';

/**
 * Sorter based on generic properties
 *
 * @param getProperty function(object) returning the object property value to compare
 * @param a           First object to compare
 * @param b           Second object to compare
 */
function menuSorterProperty(getProperty: (obj: Dish) => string | number, a: Dish, b: Dish): number {
  const av = Number(getProperty(a));
  const bv = Number(getProperty(b));

  return av - bv;
}

const boothOrder = BOOTH_ORDER;
const sorterTypes: { [type in SorterType]: (a: Dish, b: Dish) => number } = {
  booth: menuSorterProperty.bind(null, (obj: Dish) => boothOrder.indexOf(obj.booth)),
  kcal: menuSorterProperty.bind(null, (obj: Dish) => obj.nutrition.kcal),
  carbs: menuSorterProperty.bind(null, (obj) => obj.nutrition.carbs),
  fat: menuSorterProperty.bind(null, (obj: Dish) => obj.nutrition.fat),
  protein: menuSorterProperty.bind(null, (obj: Dish) => obj.nutrition.protein),
  sodium: menuSorterProperty.bind(null, (obj: Dish) => obj.nutrition.sodium),
};

export function sortDishes(type: SorterType, direction: SorterDirection, dishes: Dish[] = []): Dish[] {
  const res = [...dishes];

  res.sort(sorterTypes[type]);
  if (direction === 'desc') {
    res.reverse();
  }

  return res;
}
