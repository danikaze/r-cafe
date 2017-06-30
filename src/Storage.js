(function(window) {
  'use strict';

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const STORAGE_TEST_KEY = '__STORAGE_TEST_KEY__';

  function getSeconds() {
    return (new Date().getTime() / 1000) | 0;
  }

  function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  }

  class Storage {
    /**
     * Create an instance of the Storage to access the specified namespace
     *
     * @param {String}  namespace                    Namespace to use. Usually the name of a module.
     *                                               Colon `:` and dots `.` are not allowed in the namespace.
     * @param {Object}  [options]                    Options for the Storage object
     * @param {Boolean} [options.sessionStorage]     If set to `true`, `SessionStorage` will be used
     *                                               instead of `LocalStorage`
     * @param {Number}  [options.maxTtl=31536000]    Max TTL allowed when storing a value, in seconds.
     * @param {Boolean} [options.removeExpired=true] If `true`, when accessing an expired element,
     *                                               it will be removed (purged) automatically from the store.
     */
    constructor(namespace, options, internal) {
      this.options = Object.assign({
        sessionStorage: false,
        maxTtl: 86400 * 365,
        removeExpired: true,
      }, options);

      if (!namespace || namespace.indexOf(':') !== -1 || (namespace.indexOf('.') !== -1 && !internal)) {
        throw new Error('Storage:: Invalid namespace');
      }

      this.store = this.options.sessionStorage ? window.sessionStorage : window.localStorage;
      this.namespace = namespace;
      this.isAvailable = isAvailable(this.store);
    }

    /**
     * Store a value and replaces the previous value in the same key if existing.
     *
     * @param  {String}  key   Key of the value to store.
     * @param  {*}       value Value to store.
     * @param  {Number}  [ttl] TTL in seconds. It will be limited to `options.maxTtl` if specified
     * @return {Boolean}       `true` if success, `false` if couldn't be stored
     */
    set(key, value, ttl) {
      if (!this.isAvailable) {
        return false;
      }

      const maxTtl = this.options.maxTtl;
      const data = {
        d: value,
      };

      if (maxTtl && (!ttl || ttl <= 0 || ttl > maxTtl)) {
        ttl = maxTtl;
      }

      if (ttl >= 0) {
        data.t = getSeconds() + ttl;
      }

      try {
        this.store.setItem(`${this.namespace}:${key}`, window.JSON.stringify(data));
      } catch (e) {
        return false;
      }

      return true;
    }

    /**
     * Get a previously stored value.
     *
     * @param  {String} key Key of the stored value.
     * @return {*}          Requested value, or `undefined` if not found
     */
    get(key) {
      if (!this.isAvailable) {
        return undefined;
      }

      let data = this.store.getItem(`${this.namespace}:${key}`);

      if (!data) {
        return undefined;
      }

      try {
        data = JSON.parse(data);

        if (!isObject(data) || typeof data.d === 'undefined') {
          return undefined;
        }

        if (data.t && data.t < getSeconds()) {
          if (this.options.removeExpired) {
            this.remove(key);
          }
          return undefined;
        }
        return data.d;
      } catch (e) {
        return undefined;
      }
    }

    /**
     * Remove a value from the storage. If the value doesn't exist, does nothing.
     *
     * @param {String} key Key of the stored value to remove
     */
    remove(key) {
      if (!this.isAvailable) {
        return;
      }

      this.store.removeItem(`${this.namespace}:${key}`);
    }

    /**
     * Remove all the values from this namespace.
     * It does not affect to other values stored without using this class.
     */
    clear() {
      if (!this.isAvailable) {
        return;
      }

      const re = new RegExp(`^${this.namespace}:`);
      let i = this.store.length - 1;
      let n;
      let key;
      const keys = [];

      // due to a weird Safari behavior, we need to get all the keys before start removing them
      while (i >= 0) {
        key = this.store.key(i);
        if (key.search(re) === 0) {
          keys.push(key);
        }
        i--;
      }

      for (i = 0, n = keys.length; i < n; i++) {
        this.store.removeItem(keys[i]);
      }
    }
  }

  /**
   * Check if the local storage is currently available (IE8+)
   *
   * @param  {Object}  `window.localStorage` or `window.sessionStorage`
   * @return {Boolean} `true` if available, `false` if not
   */
  function isAvailable(store) {
    try {
      store.setItem(STORAGE_TEST_KEY, '1');
      store.removeItem(STORAGE_TEST_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Return a list with the name of all the namespaces and its stored keys
   *
   * @param  {Object} `window.localStorage` or `window.sessionStorage`
   * @return {Object} List as { namespace : [keys] }
   */
  function getStoredKeys(storage) {
    const data = {};
    let entry;
    let namespace;
    let key;
    let i;

    if (typeof storage === 'object') {
      for (entry in storage) {
        if (hasOwnProperty.call(storage, entry)) {
          i = entry.indexOf(':');
          if (i === -1) {
            continue;
          }

          namespace = entry.substring(0, i);
          key = entry.substring(i + 1);

          if (namespace in data) {
            data[namespace].push(key);
          } else {
            data[namespace] = [key];
          }
        }
      }
    }

    return data;
  }

  /**
   * Remove the expired elements
   *
   * @param  {Object} `window.localStorage` or `window.sessionStorage`
   */
  function purge(storage) {
    const data = getStoredKeys(storage);
    let namespace;
    let keys;
    let i;
    let store;

    for (namespace in data) {
      if (hasOwnProperty.call(data, namespace)) {
        store = new Storage(namespace, false, true);
        keys = data[namespace];

        for (i = 0; i < keys.length; i++) {
          store.get(keys[i]);
        }
      }
    }
  }

  window.Storage = Storage;
}(window));
