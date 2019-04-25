import { WeekMenu, State } from '../../def';
import { ThunkAction } from '..';
import { loadMenu as loadMenuFromApi } from '../../store/service/api/load-menu';
import { loadMenu as loadMenuFromRap } from '../../store/service/rap/load-menu';
import { combineMenus } from '../../util/combine-menus';
import { updateRapAccess, updateApiAccess } from './service';
import { Action } from '.';
import { getNumericDate } from '../../util/date';

export interface LoadMenu {
  type: 'loadMenu';
  day: Date;
}

export interface UpdateMenu {
  type: 'updateMenu';
  day: Date;
  data?: WeekMenu;
}

export function loadMenu(day: Date): ThunkAction<void, State, null, Action> {
  return (dispatch, getState) => {
    const dayKey = getNumericDate(day);
    const state = getState() as State;
    const dataState = state.status[dayKey];

    if (dataState === 'loading' || dataState === 'ready') {
      return;
    }

    dispatch({
      day,
      type: 'loadMenu',
    });

    let menu = state.menus;

    function combine(newMenu: WeekMenu): Promise<void> {
      menu = combineMenus(menu, newMenu);
      dispatch({
        day,
        type: 'updateMenu',
        data: menu,
      });

      return Promise.resolve();
    }

    loadMenuFromApi(day)
      .then((menu) => combine(menu)
        .then(() => dispatch(updateApiAccess(true))))
      .catch(() => dispatch(updateApiAccess(false)));

    loadMenuFromRap(day)
      .then((menu) => combine(menu)
      .then(() => dispatch(updateRapAccess(true))))
    .catch(() => dispatch(updateRapAccess(false)));
  };
}
