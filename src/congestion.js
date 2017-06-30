(function(window) {
  'use strict';
  const url = `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com/sites/GlobalPortal/_api/web/lists/getbytitle('Cafeteria%20Crowdedness%20Quantification')/items`;

  const congestion = {};
  window.congestion = congestion;

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
   * Return a Promise resolved to an object as { floor: congestionRate }
   */
  congestion.get = function() {
    return new Promise((resolve, reject) => {
      const ajaxOptions = {
        mockData: window._mockDataCongestion
      };
      request(url, ajaxOptions).then(([xml, xhr]) => {
        const items = getXmlTags(xml, '<m:properties>', '</m:properties>');
        const res = {};
        items.forEach((itemXml) => {
          const floor = getXmlTags(itemXml, '<d:Title>', '</d:Title>');
          const updated = getXmlTags(itemXml, '<d:Modified m:type="Edm.DateTime">', '</d:Modified>');
          let rate = getXmlTags(itemXml, '<d:CongestionRate m:type="Edm.Double">', '</d:CongestionRate>');
          if (rate.length && floor.length) {
            rate = parseInt(rate[0]);
            if (!isNaN(rate)) {
              res[floor[0]] = Math.max(0, rate);
            }
          }
        });

        resolve(res);
      });
    });
  };

}(window));
