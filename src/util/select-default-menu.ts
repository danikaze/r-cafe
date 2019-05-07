import { DayMenu, Cafeteria, Time, CafeteriaMenu } from '../def';

export interface MenuSelection {
  time: Time;
  cafeteria: Cafeteria;
}

function getFirstTime(menu: CafeteriaMenu, defaultTime?: Time): Time {
  if (!menu) {
    return;
  }

  if (menu[defaultTime] && menu[defaultTime].length !== 0) {
    return defaultTime;
  }

  const times = Object.keys(menu) as Time[];
  for (const time of times) {
    if (menu[time].length !== 0) {
      return time;
    }
  }
}

function getFirstCafeteria(menu: DayMenu, defaultCafeteria: Cafeteria): Cafeteria {
  if (getFirstTime(menu[defaultCafeteria])) {
    return defaultCafeteria;
  }

  const cafeterias = Object.keys(menu) as Cafeteria[];
  for (const cafeteria of cafeterias) {
    if (getFirstTime(menu[cafeteria])) {
      return cafeteria;
    }
  }
}

/**
 * Tries to select the desired time and cafeteria for a menu, but if they doesn't exist,
 * try to guess default values based on the existing keys
 */
export function selectDefaultMenu(menu: DayMenu, selection: MenuSelection): MenuSelection {
  if (!menu) {
    return;
  }

  let cafeteria = selection.cafeteria;
  let time = getFirstTime(menu[cafeteria], selection.time);

  if (!time) {
    cafeteria = getFirstCafeteria(menu, cafeteria);
    time = getFirstTime(menu[cafeteria], selection.time);
  }

  return {
    time,
    cafeteria,
  };
}
