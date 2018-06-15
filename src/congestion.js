/* global util */
((window) => {
  'use strict';
  const URL_XML = `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com/sites/GlobalPortal/_api/web/lists/getbytitle('Cafeteria%20Crowdedness%20Quantification')/items`;
  const URL_JSON_9F = `http://p${2}${3}${3}${9}${5}/cafe_crowd/data/9F/crowd_rate.json`;
  const URL_JSON_22F = `http://p${2}${3}${3}${9}${5}/cafe_crowd/data/22F/crowd_rate.json`;

  /**
   * Get a list of the content of a xml tag
   *
   * @param {any} xml
   * @param {any} open
   * @param {any} close
   * @returns
   */
  function getXmlTags(xml, open, close) {
    const res = [];
    let i;
    let j;

    i = xml.indexOf(open);
    while (i !== -1) {
      i += open.length;
      j = xml.indexOf(close, i);
      if (j === -1) {
        break;
      }

      res.push(xml.substring(i, j));
      i = xml.indexOf(open, i);
    }

    return res;
  }

  /**
   * @returns {Promise} resolved to an object as { floor: { rate } }
   */
  function getCongestionXml() {
    return new Promise((resolve, reject) => {
      util.request(URL_XML).then(([xml, xhr]) => {
        const items = getXmlTags(xml, '<m:properties>', '</m:properties>');
        const res = {};
        items.forEach((itemXml) => {
          const floor = getXmlTags(itemXml, '<d:Title>', '</d:Title>');
          // const time = getXmlTags(itemXml, '<d:Modified m:type="Edm.DateTime">', '</d:Modified>');
          let rate = getXmlTags(itemXml, '<d:CongestionRate m:type="Edm.Double">', '</d:CongestionRate>');
          if (floor.length) {
            const obj = {};
            if (rate.length) {
              rate = parseInt(rate[0], 10);
              if (!isNaN(rate)) {
                obj.rate = Math.max(0, rate);
              }
            }
            // if (time.length) {
            //   obj.time = new Date(time[0]).getTime();
            // }
            res[floor[0]] = obj;
          }
        });

        resolve(res);
      });
    });
  }

  /**
   * @returns {Promise} resolved to an object as { floor: { rate, time } }
   */
  function getCongestionJson() {
    const res = {};
    let done = 0;
    const promise9f = util.getJson(URL_JSON_9F);
    const promise22f = util.getJson(URL_JSON_22F);

    function getResponse(floor, resolve, reject, data) {
      try {
        res[`${floor}f`] = {
          rate: data.crowd_rate,
          time: data.unixtime * 1000,
        };
        done++;
        if (done === 2) {
          resolve(res);
        }
      } catch (e) {
        reject(e);
      }
    }

    return new Promise((resolve, reject) => {
      promise9f.then(getResponse.bind(null, 9, resolve, reject));
      promise22f.then(getResponse.bind(null, 22, resolve, reject));
    });
  }

  /**
   * @returns {Promise} resolved to an object as { floor: { rate, time } }
   */
  function getCongestion() {
    const currentHour = 12; // new Date().getHours();
    if (currentHour < 11 || (currentHour > 14 && currentHour < 19) || currentHour > 21) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      getCongestionJson()
        .then(resolve)
        .catch(() => {
          getCongestionXml()
            .then(resolve);
        });
    });
  }

  /*
   * Export public methods
   */
  window.congestion = {
    get: getCongestion,
  };
})(window);
