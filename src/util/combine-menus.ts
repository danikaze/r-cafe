import { WeekMenu, Dish } from '../def';

function combineDishes(base: Dish[], dishes: Dish[]): Dish[] {
  dishes.forEach((dish) => {
    if (base.findIndex((d) => d.booth === dish.booth) === -1) {
      base.push(dish);
    }
  });

  return base;
}

export function combineMenus(base: WeekMenu, menu: WeekMenu): WeekMenu {
  Object.keys(menu).forEach((day) => {
    if (!base[day]) {
      base[day] = menu[day];
    } else {
      Object.keys(base[day]).forEach((cafeteria) => {
        Object.keys(base[day][cafeteria]).forEach((time) => {
          combineDishes(base[day][cafeteria][time], menu[day][cafeteria][time]);
        });
      });
    }
  });

  return base;
}
