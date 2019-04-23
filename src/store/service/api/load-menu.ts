import { WeekMenu, Dish, Cafeteria, Ingredient, Nutrition } from '../../../def';
import { getNumericDate } from '../../../util/date';
import { getJson } from '../../../util/get-json';
import { MenuApiResponse } from './def';
import { getBaseDayMenu } from '../../../util/get-base-day-menu';

function getDishIngredients(dish): Ingredient[] {
  if (!dish || !dish.ingredients) {
    return [];
  }

  const ingredients = [];
  const validIngredients: Ingredient[] = ['alcohol', 'beef', 'chicken', 'fish', 'healthy', 'mutton', 'pork'];

  validIngredients.forEach((ingredient: Ingredient) => {
    if (dish.ingredients[ingredient]) {
      ingredients.push(ingredient);
    }
  });

  return ingredients;
}

function getDishNutrition(dish): Nutrition {
  if (!dish || !dish.component) {
    return null;
  }

  return {
    kcal: dish.calories,
    carbs: dish.component.carb,
    fat: dish.component.fat,
    protein: dish.component.protein,
    sodium: dish.component.sodium,
  };
}

export async function loadMenu(day: Date): Promise<WeekMenu> {
  const url = MENU_API_URL.replace('{DATE}', getNumericDate(day));

  const response = await getJson<MenuApiResponse>(url);
  if (!response || !response.data || response.errorMessage) {
    throw new Error((response && response.errorMessage) || 'Error while retrieving the data from the API');
  }

  const { menu, dayKey } = getBaseDayMenu(day);

  response.data.forEach((item) => {
    const cafeteria = item.cafeteriaId.toLowerCase() as Cafeteria;
    const time = item.mealTime === 1 ? 'day' : 'night';
    const dish: Dish = {
      id: item.menuId,
      booth: item.menuType,
      title: item.title,
      ingredients: getDishIngredients(item),
      nutrition: getDishNutrition(item),
      price: item.price,
      image: item.imageURL,
      umai: item.umaiCount,
    };

    menu[dayKey][cafeteria][time].push(dish);
  });

  return menu;
}
