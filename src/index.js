/* global util, html, congestion, constants */
((window) => {
  'use strict';

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
        html.hideLoading();
        html.createTitle();
        html.showMenus(menus, isDinerTime());
      })
      .catch(menuLoadingError)
      .then(() => {
        congestion.get().then((data) => {
          html.setCongestion(data);
          const intervalHandler = setInterval(() => {
            congestion.get().then(html.setCongestion, () => clearInterval(intervalHandler));
          }, constants.CONGESTION_UPDATE_INTERVAL);
        }, util.noop);
      });
  }

  /**
   *
   */
  function initialize() {
    document.title = `${constants.APP_TITLE} ${constants.APP_VERSION}`;
    const storage = new Storage(constants.STORAGE_NAMESPACE);
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
