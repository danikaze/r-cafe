import { WeekMenu, State } from '../../def';
import { ThunkAction } from '..';
import { loadMenu as loadMenuFromApi } from '../../store/service/api/load-menu';
import { loadMenu as loadMenuFromRap } from '../../store/service/rap/load-menu';
import { combineMenus } from '../../util/combine-menus';

export interface LoadMenu {
  type: 'loadMenu';
}

export interface UpdateMenu {
  type: 'updateMenu';
  data?: WeekMenu;
}

export function loadTodayMenu(): ThunkAction<void, State, null, LoadMenu | UpdateMenu> {
  return (dispatch) => {
    const today = new Date();
    let menu: WeekMenu = {};

    function combine(newMenu: WeekMenu) {
      menu = combineMenus(menu, newMenu);
      dispatch({
        type: 'updateMenu',
        data: menu,
      });
    }

    loadMenuFromApi(today).then(combine);
    loadMenuFromRap(today).then(combine);
  };
}
