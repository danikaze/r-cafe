import { WeekMenu, Dish, CafeteriaMenu, Nutrition, Ingredient } from '../../../def';
import { getAmericanDate } from '../../../util/date';
import { getBaseDayMenu } from '../../../util/get-base-day-menu';
import { getJson } from '../../../util/get-json';
import { MenuApiResponse, MenuDetailsApiResponse, MenuApiResult, MenuDetailsApiResult } from './def';

/**
 * Get the menu type of a dish from its menu id or menu type title
 * HERE BE DRAGONS
 */
function getMenuType(menu, details) {
  const map = {
    16: 'Main A', // 9F / 22F
    17: 'Main B', // 9F / 22F
    18: 'Main C', // 9F / 22F
    19: 'Pasta', // 9F / 22F
    20: 'Ramen', // 9F / 22F
    21: 'Udon & Soba', // 9F / 22F
    22: 'Bowl A', // 9F / 22F
    23: 'Bowl B', // 22F
    24: 'Grill', // 9F / 22F
    25: 'Bowl & Donburi & Curry', // osaka
    26: 'Main A', // osaka
    27: 'Noodles & Pasta', // osaka
    28: 'Main B', // osaka
    33: 'Main B', // rise
    35: 'Bowl', // rise
    36: 'Noodles A', // rise
    '01_Main A': 'Main A', // 9F / 22F
    '01_Main A Set menu': 'Main A', // osaka
    '02_Main B': 'Main B', // 9F / 22F / rise / osaka
    '03_Bowl Donburi & Curry': 'Bowl & Donburi & Curry', // osaka
    '03_Main C': 'Main C', // 9F / 22F
    '04_Bowl': 'Bowl', // rise
    '04_Bowl A': 'Bowl A', // 9F / 22 F
    '04_Udon & Soba & Ramen & Pasta': 'Noodles & Pasta', // osaka
    '05_Bowl B': 'Bowl B', // 22F
    '05_Noodles A': 'Noodles A', // rise
    '06_Noodles B': 'Noodles B', // rise
    '06_Grill': 'Grill', // 9F / 22F
    '07_Udon & Soba': 'Udon & Soba', // 9F / 22F
    '08_Ramen': 'Ramen', // 9F / 22F
    '09_Pasta': 'Pasta', // 9F / 22F
    '11_Halal': 'Halal', // 9F
  };

  const key = (details.MenuType_Image && details.MenuType_Image.Description)
            || menu.MenuTypeId
            || menu.MenuTypeTitle;

  return map[key] || map[`0${key}`] || map[`1${key}`] || 'Magical booth';
}

function getDishIngredients(menu: MenuApiResult): Ingredient[] {
  const possibleIngredients = ['alcohol', 'beef', 'chicken', 'fish', 'healthy', 'mutton', 'pork'];
  const ingredients = [];
  let html = menu.Ingredients || menu.Ingredients_Image;
  if (html) {
    html = html.toLowerCase();
  } else {
    return ingredients;
  }

  possibleIngredients.forEach((ingredient) => {
    if (html.indexOf(`title="${ingredient}`) !== -1) {
      ingredients.push(ingredient);
    }
  });

  return ingredients;
}

function getDishNutrition(details: MenuDetailsApiResult): Nutrition {
  if (!details) {
    return null;
  }

  return {
    kcal: Number(details.Calory),
    carbs: Number(details.Carb),
    fat: Number(details.Lipid),
    protein: Number(details.Protein),
    sodium: Number(details.Sodium),
  };
}

function getDish(menu: MenuApiResult, details: MenuDetailsApiResult, cafeteria): Dish {
  return {
    id: details.Id,
    booth: getMenuType(menu, details),
    title: details.MenuTitle || details.Title,
    ingredients: getDishIngredients(menu),
    nutrition: getDishNutrition(details),
    price: Number(details.Value),
    image: cafeteria.imageUrl.replace('{ID}', details.MenuID),
  } as Dish;
}

function getDetailsUrl(results: MenuApiResult[], cafeteria: string): string {
  const filter = '(ID eq '
    + results.map((dish) => dish.MenuId).join(') or (ID eq ')
    + ')';

  return MENU_DETAILS_RAP_URL.replace('{CAFETERIA}', cafeteria)
                             .replace('{FILTER}', filter);

}

async function loadSingleMenu(menuUrl: string, cafeteria): Promise<CafeteriaMenu> {
  const menuData = await getJson<MenuApiResponse>(menuUrl);
  const res: CafeteriaMenu = { day: [], night: [] };

  if (!menuData || !menuData.d || !menuData.d.results || !menuData.d.results.length) {
    return res;
  }

  const menuDataResults = menuData.d.results;
  const detailsUrl = getDetailsUrl(menuData.d.results, cafeteria.rapName);
  const detailsData = await getJson<MenuDetailsApiResponse>(detailsUrl);

  detailsData.d.results.forEach((details) => {
    const menuData = menuDataResults.filter((menu) => menu.MenuId === details.Id)[0];
    const time = menuData.Timezone === 'Lunch' ? 'day' : 'night';
    const dish = getDish(menuData, details, cafeteria);

    res[time].push(dish);
  });

  return res;
}

export async function loadMenu(day: Date): Promise<WeekMenu> {
  const date = getAmericanDate(day);
  const { menu, dayKey } = getBaseDayMenu(day);
  const promises: Promise<void>[] = [];

  CAFETERIAS.forEach((cafeteria) => {
    const url = MENU_RAP_URL.replace('{DATE}', date)
                            .replace('{CAFETERIA}', cafeteria.rapName);

    const promise = loadSingleMenu(url, cafeteria).then((singleMenu) => {
      menu[dayKey][cafeteria.id] = singleMenu;
    });
    promises.push(promise);
  });

  await Promise.all(promises);

  return menu;
}
