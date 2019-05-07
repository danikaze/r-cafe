import { WeekMenu } from '../def';

/**
 * Return the menu using rap data over the api
 */
export function combineMenus(apiMenu: WeekMenu, rapMenu: WeekMenu): WeekMenu {
  return rapMenu || apiMenu;
}
