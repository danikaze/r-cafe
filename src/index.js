/* global util, html, congestion */
((window) => {
  'use strict';

  const STORAGE_NAMESPACE = `${'r'}a${'k'}u${'t'}e${'n'}Cafeteria`;
  const CONGESTION_UPDATE_INTERVAL = 10 * 1000;

  /**
   *
   * @param {*} xhr
   */
  function menuLoadingError(xhr) {
    html.hideLoading();
    const elem = html.showError();
    elem.addEventListener('click', start);
  }

  /**
   * @return `true` if the diner needs to be shown, `false` for lunch time
   */
  function isDinerTime() {
    const currentHour = new Date().getHours();
    return currentHour >= 14;
  }

  /**
   *
   */
  function start() {
    html.hideError();
    html.showLoading();

    menus.get()
      .then((menus) => {
        console.log('menus', menus);
        html.hideLoading();
        html.showMenus(menus, isDinerTime());
      })
      // .catch(menuLoadingError)
      .then(() => {
        congestion.get().then((data) => {
          html.setCongestion(data);
          const intervalHandler = setInterval(() => {
            congestion.get().then(html.setCongestion, () => clearInterval(intervalHandler));
          }, CONGESTION_UPDATE_INTERVAL);
        }, util.noop);
      });
  }

  /**
   *
   */
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
