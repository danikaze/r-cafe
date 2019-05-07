import { WeekMenu, State } from '../../def';
import { ThunkAction } from '..';
import { loadMenu as loadMenuFromApi } from '../../store/service/api/load-menu';
import { loadMenu as loadMenuFromRap } from '../../store/service/rap/load-menu';
import { combineMenus } from '../../util/combine-menus';
import { updateRapAccess, updateApiAccess } from './service';
import { Action } from '.';
import { getNumericDate } from '../../util/date';
import { preloadMenuImages } from '../../util/preload-menu-images';

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

    let apiMenu: WeekMenu;
    let rapMenu: WeekMenu;

    function combine(): void {
      const menu = combineMenus(apiMenu, rapMenu);
      dispatch({
        day,
        type: 'updateMenu',
        data: menu,
      });

      preloadMenuImages(menu[dayKey]);
    }

    function error(type: 'rap' | 'api'): void {
      dispatch(type === 'api' ? updateApiAccess(false) : updateRapAccess(false));
    }

    loadMenuFromApi(day)
      .then((menu) => {
        apiMenu = menu;
        combine();
        dispatch(updateApiAccess(true));
      })
      .catch(() => error('api'));

    loadMenuFromRap(day)
      .then((menu) => {
        rapMenu = menu;
        combine();
        dispatch(updateRapAccess(true));
      })
    .catch(() => error('rap'));
  };
}
