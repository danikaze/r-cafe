/* global util, constants */
((window, document) => {
  'use strict';

  const URL_UMAI_POST = `http://${'r'}a${'k'}u${'t'}e${'n'}-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/umai/postumai`;
  const URL_UMAI_DELETE = `http://${'r'}a${'k'}u${'t'}e${'n'}-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/umai/deleteumai`;
  const URL_RAP = `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com/sites/GlobalPortal/SitePages/top.aspx`;

  const ID_TOP_BAR = 'top-bar';
  const ID_APP_TITLE = 'app-title';
  const ID_SORT_BUTTON = 'sort-button';
  const ID_SORT_DIR = 'sort-direction';
  const ID_SORT_TYPE = 'sort-type';
  const CLASS_SORTER = 'sorter-{{ID}}';
  const CLASS_SORTER_ASC = 'asc';
  const CLASS_SORTER_DESC = 'desc';
  const ID_CONTAINER = 'container';
  const ID_LOADING = 'loading';
  const ID_ERROR = 'error';
  const ID_MENU = 'mealtime-{{MEAL_TIME}}';
  const ID_SHOW_DINNER = 'show-dinner';
  const ID_SHOW_LUNCH = 'show-lunch';
  const ID_CONGESTION = 'congestion';
  const ID_DISH = 'menuId-{{ID}}';
  const ID_MENU_CONTENT = 'content-{{N}}';
  const CLASS_CONGESTION_RATE = 'rate';
  const CLASS_MENUS = 'menu';
  const CLASS_TABS = 'tabs';
  const CLASS_TAB = 'tab';
  const CLASS_TAB_ID = 'tab-{{ID}}';
  const CLASS_ACTIVE = 'active';
  const CLASS_CONTENT = 'content';
  const CLASS_DISHES = 'dishes';
  const CLASS_DISH = 'dish';
  const CLASS_DISH_NOT_FREE = 'paid';
  const CLASS_DISH_PRICE = 'price';
  const CLASS_DISH_NAME = 'dish-name';
  const CLASS_DISH_BOOTH = 'booth';
  const CLASS_DISH_BOOTH_NAME = 'booth-name';
  const CLASS_DISH_CALORIES = 'calories';
  const CLASS_DISH_PREVIEW = 'preview';
  const CLASS_DISH_COMPONENTS = 'components';
  const CLASS_DISH_FAT = 'fat';
  const CLASS_DISH_CARB = 'carb';
  const CLASS_DISH_SODIUM = 'sodium';
  const CLASS_DISH_PROTEIN = 'protein';
  const CLASS_ICON = 'icon';
  const CLASS_COMPONENT_NAME = 'component-name';
  const CLASS_INGREDIENTS = 'ingredients';
  const CLASS_INGREDIENT = 'ingredient';
  const CLASS_INGREDIENT_NAME = 'ingredient-{{NAME}}';
  const CLASS_UMAI = 'umai';
  const CLASS_UMAI_OFF = 'umai-off';
  const CLASS_UMAI_ON = 'umai-on';
  const CLASS_UMAI_COUNT = 'umai-count';

  const containerElem = document.getElementById(ID_CONTAINER);
  const topBarElem = document.getElementById(ID_TOP_BAR);
  const umaiInProgress = [];
  let uuid;

  let activeFloor = null;
  let congestionData = undefined;
  let dishMenuCache = {}; // as #contentXX : [dishes]
  let contentIdN = 0;

  /**
   * Remove an element given its id, if exists
   * @param {String} id
   */
  function removeElementById(id) {
    const elem = document.getElementById(id);
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
  function showLoading() {
    const html = '<div class="spinner">'
                + '<div class="rect1"></div>'
                + '<div class="rect2"></div>'
                + '<div class="rect3"></div>'
                + '<div class="rect4"></div>'
                + '<div class="rect5"></div>'
              + '</div>';
    const elem = createElementById('div', ID_LOADING, html);
    topBarElem.style.display = 'none';
    containerElem.appendChild(elem);
  }

  /**
   * Remove the loading element
   */
  function hideLoading() {
    removeElementById(ID_LOADING);
    topBarElem.style.display = '';
  }

  /**
   * Create and return the error element
   */
  function showError() {
    const html = '<p>Error retrieving the data.</p>'
               + '<p>You need to be logged in '
                 + `<a href="${URL_RAP}" target="_blank" id="rap-link">RAP</a> `
                 + 'in order to show the <em>confidential</em> menu...'
               + '</p>'
               + `<div class="version">${constants.APP_VERSION}</div>`;
    const elem = createElementById('div', ID_ERROR, html);
    topBarElem.style.display = 'none';
    containerElem.appendChild(elem);

    return elem;
  }

  /**
   * Remove the error element
   */
  function hideError() {
    removeElementById(ID_ERROR);
  }

  /**
   *
   * @param {Object[]} data
   * @param {DOM}      parent
   */
  function createTab(data, parent) {
    const elem = document.createElement('li');
    elem.classList.add(CLASS_TAB);
    elem.classList.add(CLASS_TAB_ID.replace('{{ID}}', data[0].cafeteriaId));
    elem.innerHTML = `${data[0].cafeteriaName}`;

    elem.dataset.floor = data[0].cafeteriaId;
    parent.appendChild(elem);

    return elem;
  }

  function umaiHandler(element, menuId) {
    // avoid double requests
    if (umaiInProgress.indexOf(menuId) !== -1) {
      return;
    }
    umaiInProgress.push(menuId);

    const newStatus = element.classList.contains(CLASS_UMAI_OFF);
    const oldClass = !newStatus ? CLASS_UMAI_ON : CLASS_UMAI_OFF;
    const newClass = newStatus ? CLASS_UMAI_ON : CLASS_UMAI_OFF;
    element.classList.remove(oldClass);
    element.classList.add(newClass);
    const countElem = element.getElementsByClassName(CLASS_UMAI_COUNT)[0];
    countElem.innerHTML = parseInt(countElem.innerHTML, 10) + (newStatus ? 1 : -1);
    const promise = newStatus ? postUmai(element, menuId) : deleteUmai(element, menuId);

    promise.then(() => {
      umaiInProgress.splice(umaiInProgress.indexOf(menuId), 1);
    }).catch((error) => {
      // undo changes
      element.classList.remove(newClass);
      element.classList.add(oldClass);
      countElem.innerHTML = parseInt(countElem.innerHTML, 10) - (newStatus ? 1 : -1);
      if (newStatus) {
        window.storage.remove(`umai-${menuId}`);
      } else {
        window.storage.set(`umai-${menuId}`, 1);
      }
      umaiInProgress.splice(umaiInProgress.indexOf(menuId), 1);
    });
  }

  function postUmai(element, menuId) {
    window.storage.set(`umai-${menuId}`, 1);
    return util.getJson(URL_UMAI_POST, {
      post: true,
      data: { menuId, uuid },
    });
  }

  function deleteUmai(element, menuId) {
    window.storage.remove(`umai-${menuId}`);
    return util.getJson(URL_UMAI_DELETE, {
      post: true,
      data: { menuId, uuid },
    });
  }

  /**
   *
   * @param {*} dish
   * @param {*} parent
   */
  function createDish(dish, parent) {
    function componentHtml(componentClass, componentName, value) {
      return `<div class="${componentClass}">`
               + `<div class="${CLASS_ICON}"></div>`
               + `<span class="${CLASS_COMPONENT_NAME}">${componentName}</span> `
               + `${value ? `${value} gr.` : '?'}`
             + '</div>';
    }

    function ingredientsHtml() {
      let html = `<div class="${CLASS_INGREDIENTS}">`;
      if (dish && dish.ingredients) {
        dish.ingredients.forEach((ingredient) => {
          const className = CLASS_INGREDIENT_NAME.replace('{{NAME}}', ingredient);
          const ingredientName = ingredient.substring(0, 1).toUpperCase() + ingredient.substring(1);
          html += `<div class="${CLASS_INGREDIENT} ${className}" title="${ingredientName}"></div>`;
        });
      }
      return `${html}</div>`;
    }

    function umaiHtml() {
      const status = !!window.storage.get(`umai-${dish.menuId}`);
      const statusClass = status ? CLASS_UMAI_ON : CLASS_UMAI_OFF;
      return `<div class="${CLASS_UMAI} ${statusClass}">`
              + `<div class="${CLASS_ICON}"></div>`
              + `<span class="${CLASS_UMAI_COUNT}">${dish.umaiCount}</span>`
             + '</div>';
    }

    const elem = document.createElement('div');
    const priceHtml = `<div class="${CLASS_DISH_PRICE}">${util.formatNumber(dish.price)}円</div>`;
    const html = `<div class="${CLASS_DISH_PREVIEW}" style="background-image: url(${dish.imageURL})">
            <a target="_blank" href="${dish.imageURL}"></a>
            </div>`
              + '<div class="details">'
                + `<div class="${CLASS_DISH_BOOTH}">`
                  + `<div class="${CLASS_ICON}"></div>`
                  + `<span class="${CLASS_DISH_BOOTH_NAME}">${dish.menuType}</span>`
                + '</div>'
                + `<div class="${CLASS_DISH_NAME}">${dish.title ? dish.title : ''}</div>`
                + `<div class="${CLASS_DISH_CALORIES}">${dish.calories} kcal.</div>`
                + `<div class="${CLASS_DISH_COMPONENTS}">`
                  + componentHtml(CLASS_DISH_CARB, 'Carbs', dish.component.carb)
                  + componentHtml(CLASS_DISH_FAT, 'Fat', dish.component.fat)
                  + componentHtml(CLASS_DISH_PROTEIN, 'Protein', dish.component.protein)
                  + componentHtml(CLASS_DISH_SODIUM, 'Sodium', dish.component.sodium)
                + '</div>'
                + ingredientsHtml()
                + (dish.price ? priceHtml : '')
                + (dish.umaiCount ? umaiHtml() : '')
              + '</div>';

    elem.id = ID_DISH.replace('{{ID}}', dish.menuId);
    elem.classList.add(CLASS_DISH);
    elem.classList.add(dish.menuType.replace(/[ &]/g, '').toLowerCase());
    if (dish.price) {
      elem.classList.add(CLASS_DISH_NOT_FREE);
    }
    elem.innerHTML = html;
    parent.appendChild(elem);

    const umaiElem = elem.getElementsByClassName(CLASS_UMAI)[0];
    if (umaiElem) {
      umaiElem.addEventListener('click', () => umaiHandler(umaiElem, dish.menuId));
    }
  }

  /**
   *
   * @param {Object[]} data
   * @param {DOM}      parent
   */
  function createTabContent(data, parent) {
    const contentId = ID_MENU_CONTENT.replace('{{N}}', ++contentIdN);
    const elem = document.createElement('div');

    elem.classList.add(CLASS_CONTENT);
    elem.id = contentId;
    data.sort(util.getSorterType().fn);
    data.forEach(dish => createDish(dish, elem));
    parent.appendChild(elem);

    dishMenuCache[contentId] = data;

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
    window.scrollTo(0, 0);
  }

  /**
   * Sorter to get the cafeterias in the order defined in `CAFETERIAS_DISPLAY_ORDER` via `Array.sort`
   */
  function cafeteriasSorter(a, b) {
    const ia = constants.CAFETERIAS_DISPLAY_ORDER.indexOf(a);
    const ib = constants.CAFETERIAS_DISPLAY_ORDER.indexOf(b);

    return ia - ib;
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

    Object.keys(data).sort(cafeteriasSorter).forEach((key) => {
      const location = data[key];
      if (!location.length) {
        return;
      }
      const tabElem = createTab(location, tabsElem);
      const contentElem = createTabContent(location, dishesElem);
      allTabs.push(tabElem);
      allContents.push(contentElem);

      tabElem.addEventListener('click', () => {
        activeFloor = tabElem.dataset.floor;
        setCongestion();
        focusTab(tabElem, contentElem, allTabs, allContents);
      });
    });

    if (!activeFloor) {
      activeFloor = allTabs[0].dataset.floor;
    }
    allTabs[0].classList.add(CLASS_ACTIVE);
    allContents[0].classList.add(CLASS_ACTIVE);

    elem.appendChild(tabsElem);
    elem.appendChild(dishesElem);

    return elem;
  }

  /**
   * @returns {DOM} buttons to sort the menus
   */
  function createSorterElement() {
    const sorterButton = createElementById('div', ID_SORT_BUTTON);
    const sorterType = createElementById('span', ID_SORT_TYPE);
    const sorterDirection = createElementById('div', ID_SORT_DIR, '<div class="arrow"></div>');

    sorterButton.addEventListener('click', (ev) => {
      util.switchSorterType(ev.shiftKey ? -1 : 1);
      updateSorterElement(sorterType, sorterDirection);
      resortMenus();
    });
    sorterDirection.addEventListener('click', (ev) => {
      util.switchSorterDirection();
      updateSorterElement(sorterType, sorterDirection);
      resortMenus();
    });

    updateSorterElement(sorterType, sorterDirection);
    sorterButton.appendChild(sorterType);
    sorterButton.appendChild(sorterDirection);

    return sorterButton;
  }

  /**
   * Update the sorter controls class names and titles
   *
   * @param {DOM} [sorterTypeElem]
   * @param {DOM} [sorterDirectionElem]
   */
  function updateSorterElement(sorterTypeElem, sorterDirectionElem) {
    const currentSorterType = util.getSorterType();
    const currentSorterDirection = util.getSorterDirection();
    sorterTypeElem = sorterTypeElem || document.getElementById(ID_SORT_TYPE);
    sorterDirectionElem = sorterDirectionElem || document.getElementById(ID_SORT_DIR);

    sorterTypeElem.innerHTML = currentSorterType.name;
    sorterTypeElem.className = CLASS_SORTER.replace('{{ID}}', currentSorterType.id);
    sorterTypeElem.title = currentSorterType.title;
    sorterDirectionElem.className = currentSorterDirection ? CLASS_SORTER_DESC : CLASS_SORTER_ASC;
  }

  /**
   * Create the html to show all the menus
   * @param {Object}  name       Processed data
   * @param {Boolean} showDinner if <code>true</code> it will show by default the night menu instead of lunch
   */
  function showMenus(data, showDinner) {
    function swap(show, hide) {
      hide.forEach(elem => {
        elem.classList.remove(CLASS_ACTIVE);
      });
      show.forEach(elem => {
        elem.classList.add(CLASS_ACTIVE);
      });
    }

    const lunchElem = createTimeMenu(data[constants.TIME_LUNCH], constants.TIME_LUNCH);
    const dinnerElem = createTimeMenu(data[constants.TIME_DINNER], constants.TIME_DINNER);

    const showDinnerElem = createElementById('div', ID_SHOW_DINNER);
    showDinnerElem.title = 'Displaying lunch.\nClick to show dinner time.';
    topBarElem.appendChild(showDinnerElem);

    const showLunchElem = createElementById('div', ID_SHOW_LUNCH);
    showLunchElem.title = 'Displaying dinner.\nClick to show lunch time.';
    topBarElem.appendChild(showLunchElem);

    const lunch = [lunchElem, showDinnerElem];
    const dinner = [dinnerElem, showLunchElem];

    if (showDinner) {
      swap(dinner, lunch);
    } else {
      swap(lunch, dinner);
    }

    showDinnerElem.addEventListener('click', () => swap(dinner, lunch));
    showLunchElem.addEventListener('click', () => swap(lunch, dinner));

    topBarElem.appendChild(createSorterElement());

    uuid = window.storage.get('uuid');
  }

  /**
   * Resort dishes in all menus
   */
  function resortMenus() {
    const sortDirection = util.getSorterDirection();
    const sortType = util.getSorterType();

    Object.keys(dishMenuCache).forEach((parentId) => {
      const parent = document.getElementById(parentId);
      const data = dishMenuCache[parentId];
      data.sort(sortType.fn).forEach((dish) => {
        parent.appendChild(document.getElementById(ID_DISH.replace('{{ID}}', dish.menuId)));
      });
    });
  }

  /**
   * Create/update/remove the congestion indicator based on the new data
   */
  function setCongestion(newData) {
    if (newData) {
      congestionData = newData;
    }

    const data = congestionData && congestionData[activeFloor];
    if (data !== undefined && data.rate) {
      let elem = document.getElementById(ID_CONGESTION);
      if (!elem) {
        elem = createElementById('div', ID_CONGESTION);
        elem.title = 'Ocuppation percentage';
        topBarElem.appendChild(elem);
      }
      elem.innerHTML = `<span class="${CLASS_CONGESTION_RATE}">${data.rate}%</span>`;
    } else {
      removeElementById(ID_CONGESTION);
    }
  }

  /**
   * Create the title with the name and the version of the app
   */
  function createTitle() {
    const html = `${constants.APP_TITLE} <span>${constants.APP_VERSION}</span>`;
    const elem = createElementById('div', ID_APP_TITLE, html);
    topBarElem.appendChild(elem);
  }

  /*
   * Export public members
   */
  window.html = {
    showLoading,
    hideLoading,
    showError,
    hideError,
    showMenus,
    setCongestion,
    createTitle,
  };
})(window, document);
