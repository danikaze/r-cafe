import { WeekMenu, State } from '../../def';
import { ThunkAction } from '..';
import { loadMenu as loadMenuFromApi } from '../../store/service/api/load-menu';
import { loadMenu as loadMenuFromRap } from '../../store/service/rap/load-menu';
import { combineMenus } from '../../util/combine-menus';
import { updateRapAccess, updateApiAccess } from './service';
import { Action } from '.';

export interface LoadMenu {
  type: 'loadMenu';
}

export interface UpdateMenu {
  type: 'updateMenu';
  data?: WeekMenu;
}

export function loadTodayMenu(): ThunkAction<void, State, null, Action> {
  return (dispatch) => {
    const today = new Date();
    let menu: WeekMenu = {};

    function combine(newMenu: WeekMenu): Promise<void> {
      menu = combineMenus(menu, newMenu);
      dispatch({
        type: 'updateMenu',
        data: menu,
      });

      return Promise.resolve();
    }

    loadMenuFromApi(today)
      .then((menu) => combine(menu)
        .then(() => dispatch(updateApiAccess(true))))
      .catch(() => dispatch(updateApiAccess(false)));

    loadMenuFromRap(today)
      .then((menu) => combine(menu)
      .then(() => dispatch(updateRapAccess(true))))
    .catch(() => dispatch(updateRapAccess(false)));
  };
}
