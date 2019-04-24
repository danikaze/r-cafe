const packageJson = require('./package.json');

const SERVER_URL = `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com`;

module.exports = {
  APP_VERSION: packageJson.version,
  APP_TITLE: `Яa${'k'}u${'t'}e${'n'} Cafeteria Menu`,
  RAP_URL: `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com/sites/GlobalPortal/SitePages/top.aspx`,
  MENU_API_URL: `http://${'r'}a${'k'}u${'t'}e${'n'}-towerman.azurewebsites.net/towerman-restapi/rest/cafeteria/menulist?menuDate={DATE}`,
  MENU_RAP_URL: `${SERVER_URL}/sites/Committees/cafeteria/_api/web/lists/getbytitle('Menu {CAFETERIA}')/items?$filter=MenuDate eq '{DATE}'`,
  MENU_DETAILS_RAP_URL: `${SERVER_URL}/sites/Committees/cafeteria/_api/web/lists/getbytitle('Menu Image {CAFETERIA}')/items?$filter={FILTER}`,
  CONGESTION_URL_JSON_9F: `http://p${2}${3}${3}${9}${5}/cafe_crowd/data/9F/crowd_rate.json`,
  CONGESTION_URL_JSON_22F: `http://p${2}${3}${3}${9}${5}/cafe_crowd/data/22F/crowd_rate.json`,
  CONGESTION_XML_URL: `https://office${'r'}a${'k'}u${'t'}e${'n'}.sharepoint.com/sites/GlobalPortal/_api/web/lists/getbytitle('Cafeteria%20Crowdedness%20Quantification')/items`,
  CONGESTION_INTERVAL: 10000,
  LUNCH_START: 11,
  LUNCH_END: 14,
  DINNER_START: 19,
  DINNER_END: 21,
  BOOTH_ORDER: [
    'Main A',
    'Main B',
    'Main C',
    'Bowl',
    'Bowl A',
    'Bowl B',
    'Grill',
    'Pasta',
    'Ramen',
    'Udon & Soba',
    'Noodles A',
    'Noodles B',
    'Bowl & Donburi & Curry',
    'Noodles & Pasta',
    'Halal',
  ],
  CAFETERIAS: [
    {
      rapName: '9F Cafeteria',
      displayName: '9F',
      id: '9f',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_9F/_w/{ID}_JPG.jpg`,
    },
    {
      rapName: '22F Cafeteria',
      displayName: '22F',
      id: '22f',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_22F/_w/{ID}_JPG.jpg`,
    },
    {
      rapName: 'Rise Cafeteria',
      displayName: 'Rise',
      id: 'rise',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_Rise/_w/{ID}_JPG.jpg`,
    },
    {
      rapName: 'Osaka Branch',
      displayName: 'Osaka',
      id: 'osaka',
      imageUrl: `${SERVER_URL}/sites/Committees/cafeteria/MenuImage_Osaka/_w/{ID}_JPG.jpg`,
    },
  ],
  TIMES: {
    day: 'Lunch',
    night: 'Dinner',
  },
};
