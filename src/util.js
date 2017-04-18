/**
 * Does nothing
 * Returns undefined
 */
function noop () {}

/**
 * Check if an object is a string
 *
 * @param   {*}       obj Object to check
 * @returns {Boolean}     true if {@link obj} is a string, false otherwise
 */
function isString(obj) {
  return typeof obj === "string" || obj instanceof String;
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
  var i;
  var n;
  text = String(text);

  if(filler === undefined) {
    filler = '0';
  }

  for(i = 0, n = len - text.length; i < n; i++) {
    text = filler + text;
  }

  return text;
}

/**
 * @returns {String} Current date as YYYYMMDD
 */
function getNumericDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = padLeft(date.getMonth() + 1, 2, '0');
  var day = padLeft(date.getDate(), 2, '0');

  return `${year}${month}${day}`;
};

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
        json = JSON.parse(data);
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
    if (options.mockData) {
      resolve(options.mockData);
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve([xhr.responseText, xhr]);
        } else {
          reject(xhr);
        }
      }
    };

    xhr.send();
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
  if(value == null) {
    return '';
  }

  return (value + '').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

/**
 *
 * @param {*} object
 * @param {*} callback as function(value, key)
 */
function each(object, callback) {
  for (let i in object) {
    if (Object.prototype.hasOwnProperty.call(object, i)) {
      callback(object[i], i);
    }
  }
}
