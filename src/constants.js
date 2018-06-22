((window) => {
  'use strict';

  /*
   * Export public constants
   */
  window.constants = {
    APP_TITLE: 'Яakuten Cafeteria Menu',
    APP_VERSION: '0.7.3',
    ENABLE_MENU_CACHE: false,
    STORAGE_NAMESPACE: `${'r'}a${'k'}u${'t'}e${'n'}Cafeteria`,
    CONGESTION_UPDATE_INTERVAL: 10 * 1000, // 10s
    TIME_LUNCH: 1,
    TIME_DINNER: 2,
    CAFETERIAS_DISPLAY_ORDER: [
      '9F',
      '22F',
      'Rise',
      'Osaka',
    ]
  };
})(window);
