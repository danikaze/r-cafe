((window) => {
  'use strict';

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
    'Halal',
  ].map(id => id.toLowerCase());

  const sorterTypes = [{
    id: 'booth',
    name: 'Booth',
    title: 'Sorting by Booth type',
    fn: menuSorterProperty.bind(null, (obj) => DISH_ORDER.indexOf(obj.menuType.toLowerCase())),
  }, {
    id: 'kcal',
    name: 'Kcal',
    title: 'Sorting by Calory quantity',
    fn: menuSorterProperty.bind(null, (obj) => obj.calories),
  }, {
    id: 'carbs',
    name: 'Carbs',
    title: 'Sorting by Carbs quantity',
    fn: menuSorterProperty.bind(null, (obj) => obj.component.carb),
  }, {
    id: 'fat',
    name: 'Fats',
    title: 'Sorting by Fat quantity',
    fn: menuSorterProperty.bind(null, (obj) => obj.component.fat),
  }, {
    id: 'protein',
    name: 'Proteins',
    title: 'Sorting by Protein quantity',
    fn: menuSorterProperty.bind(null, (obj) => obj.component.protein),
  }, {
    id: 'sodium',
    name: 'Sodium',
    title: 'Sorting by Sodium quantity',
    fn: menuSorterProperty.bind(null, (obj) => obj.component.sodium),
  }, {
    id: 'umai',
    name: 'Umai',
    title: 'Sorting by number of Likes',
    fn: menuSorterProperty.bind(null, (obj) => obj.umaiCount),
  }];
  let currentSorterType = 0;
  let currentSorterDirection = false;

  /**
   * Does nothing
   * Returns undefined
   */
  function noop() {
  }

  /**
   * Check if an object is a string
   *
   * @param   {*}       obj Object to check
   * @returns {Boolean}     true if {@link obj} is a string, false otherwise
   */
  function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
  }

  /**
   * Add {@link filler} until {@link text} length is {@link len}.
   * If {@link text.length} is originally greater or equal to {@link len}, nothing is done
   *
   * @param   {String} text   String to pad
   * @param   {Number} len    Desired length for {@link text}
   * @param   {String} filler 1 character length string to be added to the left of {@link text}
   * @returns {String}        padded string as padLeft("123", 5, 0) => "00123"
   *
   * @example padLeft("123", 5, "0"); // "00123"
   */
  function padLeft(text, len, filler) {
    let i;
    let n;
    text = String(text);

    if (filler === undefined) {
      filler = '0';
    }

    for (i = 0, n = len - text.length; i < n; i++) {
      text = filler + text;
    }

    return text;
  }

  /**
   * @returns {String} Current date as YYYYMMDD
   */
  function getNumericDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = padLeft(date.getMonth() + 1, 2, '0');
    const day = padLeft(date.getDate(), 2, '0');

    return `${year}${month}${day}`;
  }

  /**
   * Opens a URL and load a JSON object
   *
   * @param   {String}  url URL to open
   * @returns {Promise}     Promise resolved to the JSON object
   */
  function getJson(url, options) {
    return new Promise((resolve, reject) => {
      function resolveJson([data, xhr]) {
        if (!isString(data)) {
          data = JSON.stringify(data);
        }
        try {
          const json = JSON.parse(data);
          resolve(json, xhr);
        } catch (error) {
          reject(xhr, error);
        }
      }

      request(url, options).then(resolveJson, reject);
    });
  }

  /**
   * Request a URL and return the content as plain text
   *
   * @param   {String}  url       url to open
   * @param   {Object}  [options]
   * @returns {Promise}           Promise resolved to a String
   */
  function request(url, options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      if (options.mockData) {
        resolve(options.mockData);
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(options.post ? 'POST' : 'GET', url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            resolve([xhr.responseText, xhr]);
          } else {
            reject(xhr);
          }
        }
      };

      if (options.post) {
        xhr.setRequestHeader('Content-type', 'application/json');
      }

      try {
        xhr.send(options.post && options.data ? JSON.stringify(options.data) : undefined);
      } catch (e) {
        reject(xhr, e);
      }
    });
  }

  /**
   * Format a number separating each 3 value with commas
   *
   * @param  {Number|String} value Value to format
   * @return {String}              Formatted value
   *
   * @example
   * formatNumber(12345678); // 12,345,678
   *
   */
  function formatNumber(value) {
    if (value == null) {
      return '';
    }

    return String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }

  /**
   *
   * @param {*} object
   * @param {*} callback as function(value, key)
   */
  function each(object, callback) {
    for (const i in object) {
      if (Object.prototype.hasOwnProperty.call(object, i)) {
        callback(object[i], i);
      }
    }
  }

  /**
   * @returns {String} Random type 4 uuid rfc-compliant
   */
  function generateRandomUuid() {
    let uuid = '';
    let random;
    for (let i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      if (i === 12) {
        uuid += '4';
      } else {
        uuid += (i === 16 ? (random & 3 | 8) : random).toString(16);
      }
    }
    return uuid;
  }

  /**
   * Sorter based on generic properties
   *
   * @param {Function} getProperty function(object) returning the object property value to compare
   * @param {Object}   a           First object to compare
   * @param {Object}   b           Second object to compare
   */
  function menuSorterProperty(getProperty, a, b) {
    const av = parseInt(getProperty(a), 10);
    const bv = parseInt(getProperty(b), 10);

    return (av - bv) * (currentSorterDirection ? -1 : 1);
  }

  /**
   * Update and return the sorter type
   *
   * @param {Number} delta If `1`/`-1`, it will move to the next/prev one
   * @returns {Object} Sorter as `{ id, title, fn }`
   */
  function switchSorterType(delta) {
    currentSorterType = (currentSorterType + sorterTypes.length + delta) % sorterTypes.length;

    return sorterTypes[currentSorterType];
  }

  /**
   * Update and return the sorter direction
   *
   * @param {Boolean} init If `true` will initialize it. If not, it will switch the direction to the other one
   * @returns {Boolean} `true` for ascending, `false` for descending direction.
   */
  function switchSorterDirection(init) {
    if (!init) {
      currentSorterDirection = !currentSorterDirection;
    }
    return currentSorterDirection;
  }

  /**
   * @returns {Object} Sorter as `{ id, title, fn }`
   */
  function getSorterType() {
    return sorterTypes[currentSorterType];
  }

  /**
   * @returns {Boolean} `true` for ascending, `false` for descending direction.
   */
  function getSorterDirection() {
    return currentSorterDirection;
  }

  /*
   * Export public members
   */
  window.util = {
    noop,
    isString,
    padLeft,
    getNumericDate,
    getJson,
    request,
    formatNumber,
    each,
    generateRandomUuid,
    switchSorterType,
    switchSorterDirection,
    getSorterType,
    getSorterDirection,
  };
})(window);
