/* global util, html, congestion */
((window) => {
  'use strict';

  const URL_DATA = `http://${'r'}a${'k'}u${'t'}e${'n'}-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/menulist?menuDate=${util.getNumericDate()}`;
  const STORAGE_NAMESPACE = `${'r'}a${'k'}u${'t'}e${'n'}Cafeteria`;
  const CONGESTION_UPDATE_INTERVAL = 10 * 1000;

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

    // API is shit and menuID is different even for duplicated elements, so we filter manually
    const uniques = [];

    response.data.forEach(item => {
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

    util.getJson(URL_DATA)
      .then(processJson, processError)
      .then(() => {
        congestion.get().then((data) => {
          html.setCongestion(data);
          const intervalHandler = setInterval(() => {
            congestion.get().then(html.setCongestion, () => clearInterval(intervalHandler));
          }, CONGESTION_UPDATE_INTERVAL);
        }, util.noop);
      });
  }

  function initialize() {
    const storage = new Storage(STORAGE_NAMESPACE);
    window.storage = storage;

    if (storage.get('uuid')) {
      return;
    }

    const uuid = util.generateRandomUuid();
    storage.set('uuid', uuid);
  }

  initialize();
  start();
})(window);
