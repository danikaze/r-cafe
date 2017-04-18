(function(window) {
  'use strict';
  var request = new XMLHttpRequest();
  var url = 'http://rakuten-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/menulist?menuDate=' + getNumericDate();
  const DISH_ORDER = [
    'Main A',
    'Main B',
    'Main C',
    'Bowl A',
    'Bowl B',
    'Grill',
    'Pasta',
    'Ramen',
    'Udon & Soba',
    'Halal'
  ].map(id => { return id.toLowerCase() });
  const CONGESTION_UPDATE_INTERVAL = 10 * 1000;

  /**
   *
   * @param {Object} a
   * @param {Object} b
   */
  function menuSorter(a, b) {
    let ai = DISH_ORDER.indexOf(a.menuType.toLowerCase());
    let bi = DISH_ORDER.indexOf(b.menuType.toLowerCase());

    return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
  }

  /**
   *
   * @param {*} response
   */
  function processJson(response) {
    if (!response.data || response.errorMessage) {
      processError();
      return;
    }

    const menus = {};
    const currentHour = new Date().getHours();
    const showDinner = currentHour > 13;

    response.data.forEach(item => {
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

    each(menus, time => {
      each(time, menu => {
        menu.sort(menuSorter);
      });
    });

    html.hideLoading();
    html.showMenus(menus, showDinner);
  }

  /**
   *
   * @param {*} xhr
   */
  function processError(xhr) {
    html.hideLoading();
    const elem = html.showError();
    elem.addEventListener('click', start);
  }

  /**
   *
   */
  function start() {
    html.hideError();
    html.showLoading();
    const ajaxOptions = {
      mockData: window._mockData
    };
    getJson(url, ajaxOptions)
      .then(processJson, processError)
      .then(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 11 || (currentHour > 14 && currentHour < 19) || currentHour > 21) {
          return;
        }
        congestion.get().then(html.setCongestion, noop);
        setInterval(() => {
          congestion.get().then(html.setCongestion, noop);
        }, CONGESTION_UPDATE_INTERVAL)
      });
  }

  start();
}(window));
