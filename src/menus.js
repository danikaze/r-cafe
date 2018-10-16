/* global util, storage */
((window) => {
  'use strict';

  const types = [];

  const MENU_CACHE_TTL = 12 * 3600; // 12h
  const TIMEZONES = ['Lunch', 'Dinner'];
  const URL_API = `http://${'r'}a${'k'}u${'t'}e${'n'}-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/menulist?menuDate={DATE}`;
  const SERVER_URL = `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com`;
  const URL_RAP_MENU = `${SERVER_URL}/sites/Committees/cafeteria/_api/web/lists/getbytitle('Menu {CAFETERIA}')/items?$filter=MenuDate eq '{DATE}' and Timezone eq '{TIMEZONE}'`;
  const URL_RAP_DETAILS = `${SERVER_URL}/sites/Committees/cafeteria/_api/web/lists/getbytitle('Menu Image {CAFETERIA}')/items?$filter={FILTER}`;
  const RAP_CAFETERIA_NAMES = [
    {
      apiName: '9F Cafeteria',
      displayName: '9F',
      id: '9f',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_9F/_w/{ID}_JPG.jpg`,
    },
    {
      apiName: '22F Cafeteria',
      displayName: '22F',
      id: '22f',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_22F/_w/{ID}_JPG.jpg`,
    },
    {
      apiName: 'Rise Cafeteria',
      displayName: 'Rise',
      id: 'rise',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_Rise/_w/{ID}_JPG.jpg`,
    },
    {
      apiName: 'Osaka Branch',
      displayName: 'Osaka',
      id: 'osaka',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_Osaka/_w/{ID}_JPG.jpg`,
    },
  ];

  /**
   * Process the json returned by the API to return the menu object
   *
   * @param {*} response
   */
  function processApiJson(response) {
    if (!response || !response.data || response.errorMessage) {
      throw new Error((response && response.errorMessage) || 'Error while retrieving the data from the API');
    }

    const menus = {};

    // API is shit and menuID is different even for duplicated elements, so we filter manually
    const uniques = [];

    response.data.forEach((item) => {
      const key = `${item.cafeteriaId}:${item.mealTime}:${item.title}`;
      if (uniques.indexOf(key) !== -1) {
        return;
      }
      uniques.push(key);

      let time = menus[item.mealTime];
      if (!time) {
        time = {};
        menus[item.mealTime] = time;
      }

      let location = time[item.cafeteriaId];
      if (!location) {
        location = [];
        time[item.cafeteriaId] = location;
      }
      location.push(item);
    });

    return menus;
  }

  /**
   * Returned information is shit and menuID is different even for duplicated elements, so we filter manually
   *
   * @param {object[]} dishes List of dishes of a location/time
   */
  function removeDuplicated(dishes) {
    const uniques = [];
    const keys = [];

    dishes.forEach((item) => {
      const key = item.menuId;
      if (keys.indexOf(key) !== -1) {
        return;
      }
      keys.push(key);
      uniques.push(item);
    });

    return uniques;
  }

  /**
   * Get the menu type of a dish from its menu id or menu type title
   */
  function getMenuType(menuData, detailData) {
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
      27: 'Udon & Soba & Ramen & Pasta', // osaka
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
      '04_Udon & Soba & Ramen & Pasta': 'Udon & Soba & Ramen & Pasta', // osaka
      '05_Bowl B': 'Bowl B', // 22F
      '05_Noodles A': 'Noodles A', // rise
      '06_Grill': 'Grill', // 9F / 22F
      '07_Udon & Soba': 'Udon & Soba', // 9F / 22F
      '08_Ramen': 'Ramen', // 9F / 22F
      '09_Pasta': 'Pasta', // 9F / 22F
      '11_Halal': 'Halal', // 9F
    }

    const key = (detailData.MenuType_Image && detailData.MenuType_Image.Description)
              || menuData.MenuTypeId
              || menuData.MenuTypeTitle;

    return map[key] || map[`0${key}`] || map[`1${key}`] || 'unknown-type';
  }

  /**
   * Get the list of ingredients from a dish data
   */
  function getIngredients(data) {
    const possibleIngredients = ['alcohol', 'beef', 'chicken', 'fish', 'healthy', 'mutton', 'pork'];
    const ingredients = [];
    let html = data.Ingredients || data.Ingredients_Image;
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

  /**
   * Process the json returned by RAP to return the dish object
   *
   * @param {object} menuData
   * @param {object} detailData
   */
  function getRapDish(menuData, detailData, cafeteria) {
    return new Promise((resolve, reject) => {
      const dish = {
        cafeteriaId: cafeteria.id,
        cafeteriaName: cafeteria.displayName,
        timezone: menuData.Timezone === 'Lunch' ? constants.TIME_LUNCH : constants.TIME_DINNER,
        menuId: menuData.MenuId,
        menuType: getMenuType(menuData, detailData),
        title: detailData.MenuTitle || detailData.Title,
        imageURL: cafeteria.imageUrl.replace('{ID}', detailData.MenuID),
        ingredients: getIngredients(menuData),
        calories: detailData.Calory,
        component: {
          carb: detailData.Carb,
          fat: detailData.Lipid,
          protein: detailData.Protein,
          sodium: detailData.Sodium,
        },
        price: parseInt(detailData.Value),
        umaiCount: undefined,
      };

      resolve(dish);
    })
  }

  /**
   * Get content of a menu, ask for dish details and construct the data
   *
   * @param {object} cafeteria requested cafeteria
   * @param {object} menuData api response
   */
  function processRapMenu(url, results, cafeteria, menuData) {
    if (!menuData || !menuData.d || !menuData.d.results || !menuData.d.results.length) {
      return undefined;
    }

    return new Promise((resolve, reject) => {
      const filter = '(ID eq '
        + menuData.d.results.map((dish) => dish.MenuId)
            .join(') or (ID eq ')
        + ')';
      const detailsUrl = URL_RAP_DETAILS
        .replace('{CAFETERIA}', cafeteria.apiName)
        .replace('{FILTER}', filter);

      util.getJson(detailsUrl)
        .then((detailData) => {
          const promises = [];
          menuData.d.results.forEach((dish) => {
            const details = detailData.d.results.filter((d) => d.Id === dish.MenuId);
            if (details.length > 0) {
              const dishPromise = getRapDish(dish, details[0], cafeteria).then((dish) => {
                results[dish.timezone][cafeteria.displayName].push(dish);
                return dish;
              });
              promises.push(dishPromise);
            }
          });

          Promise.all(promises).then(resolve);
        });
    });
  }

  /**
   * Retrieve the menu data from the API
   */
  function getMenusFromApi() {
    return new Promise((resolve, reject) => {
      util.getJson(URL_API.replace('{DATE}', util.getNumericDate()))
          .then(processApiJson)
          .then(resolve)
          .catch(reject);
    });
  }

  /**
   * Retrieve the menu data from RAP
   */
  function getMenusFromRap() {
    let cacheKey;
    let cachedData;

    if (constants.ENABLE_MENU_CACHE) {
      cacheKey = `menus-rap-${util.getNumericDate()}`;
      cachedData = storage.get(cacheKey);
    }

    const requestPromise = new Promise((resolve, reject) => {
      const date = util.getAmericanDate();
      const promises = [];
      const results = {}
      results[constants.TIME_LUNCH] = {};
      results[constants.TIME_DINNER] = {};
      RAP_CAFETERIA_NAMES.forEach((cafeteria) => {
        results[constants.TIME_LUNCH][cafeteria.displayName] = [];
        results[constants.TIME_DINNER][cafeteria.displayName] = [];
      });

      RAP_CAFETERIA_NAMES.forEach((cafeteria) => {
        TIMEZONES.forEach((timezone) => {
          const url = URL_RAP_MENU
            .replace('{DATE}', date)
            .replace('{CAFETERIA}', cafeteria.apiName)
            .replace('{TIMEZONE}', timezone);

          const promise = util.getJson(url)
            .then(processRapMenu.bind(null, url, results, cafeteria));

          promises.push(promise);
        });
      });

      Promise.all(promises)
        .then(() => {
          if (constants.ENABLE_MENU_CACHE) {
            storage.set(cacheKey, results, MENU_CACHE_TTL);
          }
          resolve(results);
        })
        .catch(reject);
    });

    return cachedData ? Promise.resolve(cachedData) : requestPromise;
  }

  /**
   * Get the menu data from the API or RAP
   */
  function getMenus() {
    return new Promise((resolve, reject) => {
      // Promise.all([getMenusFromApi(), getMenusFromRap()])
      //   .then(([apiData, rapData]) => util.extend(apiData, rapData))
      getMenusFromRap()
        .then((menus) => {
          Object.keys(menus).forEach((time) => {
            Object.keys(menus[time]).forEach((location) => {
              menus[time][location] = removeDuplicated(menus[time][location]);
            });
          });

          return menus;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /*
   * Export public methods
   */
  window.menus = {
    get: getMenus,
  };
})(window);
