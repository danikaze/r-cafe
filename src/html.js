const TIME_LUNCH = 1;
const TIME_DINNER = 2;

const ID_CONTAINER = 'container';
const ID_LOADING = 'loading';
const ID_ERROR = 'error';
const ID_MENU = 'mealtime-{{MEAL_TIME}}';
const ID_SHOW_DINNER = 'show-dinner';
const ID_SHOW_LUNCH = 'show-lunch';
const CLASS_MENUS = 'menu';
const CLASS_TABS = 'tabs';
const CLASS_TAB = 'tab';
const CLASS_ACTIVE = 'active';
const CLASS_CONTENT = 'content';
const CLASS_DISHES = 'dishes';
const CLASS_DISH = 'dish';
const CLASS_DISH_NOT_FREE = 'paid';
const CLASS_DISH_PRICE = 'price';
const CLASS_DISH_NAME = 'name';
const CLASS_DISH_BOOTH = 'booth';
const CLASS_DISH_CALORIES = 'calories';
const CLASS_DISH_PREVIEW = 'preview';

const containerElem = document.getElementById(ID_CONTAINER);
const html = {};
window.html = html;

/**
 * Remove an element given its id, if exists
 * @param {String} id
 */
function removeElementById(id) {
  let elem = document.getElementById(id);
  if (!elem) {
    return;
  }
  elem.parentNode.removeChild(elem);
}

/**
 * Creates an element only if it doesn't exist already
 * @param {String} tag  type of element (tag, span, etc)
 * @param {String} id   unique id of the element
 * @param {String} html html for the contents of the element
 * @returns {DOM}       Existing or created element
 */
function createElementById(tag, id, html) {
  let elem = document.getElementById(id);
  if (!elem) {
    elem = document.createElement(tag);
    elem.setAttribute('id', id);
  }

  if (html) {
    elem.innerHTML = html;
  }

  return elem;
}

/**
 * Create and return the loading element
 */
html.showLoading = () => {
  const html = '<div class="spinner">'
               + '<div class="rect1"></div>'
               + '<div class="rect2"></div>'
               + '<div class="rect3"></div>'
               + '<div class="rect4"></div>'
               + '<div class="rect5"></div>'
             + '</div>';
  const elem = createElementById('div', ID_LOADING, html);
  containerElem.appendChild(elem);
};

/**
 * Remove the loading element
 */
html.hideLoading = () => {
  removeElementById(ID_LOADING);
};

/**
 * Create and return the error element
 */
html.showError = () => {
  const html = '<p class="top">Error retrieving the data</p>'
             + '<p class="bottom">Click to retry</p>';
  const elem = createElementById('div', ID_ERROR, html);
  containerElem.appendChild(elem);

  return elem;
};

/**
 * Remove the error element
 */
html.hideError = () => {
  removeElementById(ID_ERROR);
};

/**
 *
 * @param {Object[]} data
 * @param {DOM}      parent
 */
function createTab(data, parent) {
  const elem = document.createElement('li');
  elem.classList.add(CLASS_TAB);
  elem.innerHTML = data[0].cafeteriaId;
  parent.appendChild(elem);

  return elem;
}

/**
 *
 * @param {*} dish
 * @param {*} parent
 */
function createDish(dish, parent) {
  const elem = document.createElement('div');
  const priceHtml = `<div class="${CLASS_DISH_PRICE}">${formatNumber(dish.price)}円</div>`
  const html = `<div class="${CLASS_DISH_PREVIEW}" style="background-image: url(${dish.imageURL})"></div>`
             + '<div class="details">'
              + `<div class="${CLASS_DISH_BOOTH}"><div class="icon"></div><span class="name">${dish.menuType}</span></div>`
              + `<div class="${CLASS_DISH_NAME}">${dish.title}</div>`
              + `<div class="${CLASS_DISH_CALORIES}">${dish.calories} kcal.</div>`
              + (dish.price ? priceHtml : '')
             + '</div>';
  elem.classList.add(CLASS_DISH);
  elem.classList.add(dish.menuType.replace(/[ &]/g, '').toLowerCase());
  if (dish.price) {
    elem.classList.add(CLASS_DISH_NOT_FREE);
  }
  elem.innerHTML = html;
  parent.appendChild(elem);
}

/**
 *
 * @param {Object[]} data
 * @param {DOM}      parent
 */
function createTabContent(data, parent) {
  const elem = document.createElement('div');
  elem.classList.add(CLASS_CONTENT);
  data.forEach(dish => createDish(dish, elem));
  parent.appendChild(elem);

  return elem;
}

/**
 *
 * @param {DOM}   selectedTab
 * @param {DOM}   selectedContent
 * @param {DOM[]} allTabs
 * @param {DOM[]} allContents
 */
function focusTab(selectedTab, selectedContent, allTabs, allContents) {
  allTabs.forEach(elem => {
    elem.classList.remove(CLASS_ACTIVE);
  });
  allContents.forEach(elem => {
    elem.classList.remove(CLASS_ACTIVE);
  });
  selectedTab.classList.add(CLASS_ACTIVE);
  selectedContent.classList.add(CLASS_ACTIVE);
}

/**
 * Create the html of a mealTime (lunch/dinner)
 * @param {*} data
 */
function createTimeMenu(data, mealTime) {
  const allTabs = [];
  const allContents = [];
  const elem = createElementById('div', ID_MENU.replace('{{MEAL_TIME}}', mealTime));
  elem.classList.add(CLASS_MENUS);
  containerElem.appendChild(elem);

  const tabsElem = document.createElement('ul');
  tabsElem.classList.add(CLASS_TABS);

  const dishesElem = document.createElement('div');
  dishesElem.classList.add(CLASS_DISHES);

  each(data, location => {
    const tabElem = createTab(location, tabsElem);
    const contentElem = createTabContent(location, dishesElem);
    allTabs.push(tabElem);
    allContents.push(contentElem);

    tabElem.addEventListener('click', () => {
      focusTab(tabElem, contentElem, allTabs, allContents);
    });
  });

  allTabs[0].classList.add(CLASS_ACTIVE);
  allContents[0].classList.add(CLASS_ACTIVE);

  elem.appendChild(tabsElem);
  elem.appendChild(dishesElem);

  return elem;
}

/**
 * Create the html to show all the menus
 */
html.showMenus = (data) => {
  function swap(show, hide) {
    hide.forEach(elem => {
      elem.classList.remove(CLASS_ACTIVE);
    });
    show.forEach(elem => {
      elem.classList.add(CLASS_ACTIVE);
    });
  }

  const lunchElem = createTimeMenu(data[TIME_LUNCH], TIME_LUNCH);
  const dinnerElem = createTimeMenu(data[TIME_DINNER], TIME_DINNER);

  const showDinnerElem = createElementById('div', ID_SHOW_DINNER);
  showDinnerElem.title = 'Displaying lunch.\nClick to show dinner time.';
  showDinnerElem.classList.add(CLASS_ACTIVE);
  containerElem.appendChild(showDinnerElem);

  const showLunchElem = createElementById('div', ID_SHOW_LUNCH);
  showLunchElem.title = 'Displaying dinner.\nClick to show lunch time.';
  containerElem.appendChild(showLunchElem);

  const lunch = [lunchElem, showDinnerElem];
  const dinner = [dinnerElem, showLunchElem];
  lunchElem.classList.add(CLASS_ACTIVE);

  showDinnerElem.addEventListener('click', () => swap(dinner, lunch));
  showLunchElem.addEventListener('click', () => swap(lunch, dinner));
};
