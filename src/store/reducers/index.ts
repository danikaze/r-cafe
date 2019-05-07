import { State, SorterType } from '../../def';
import { Action } from '../actions';
import { getNumericDate } from '../../util/date';
import { selectDefaultMenu, MenuSelection } from '../../util/select-default-menu';
import { LoadMenu } from '../actions/menu';
import { SelectTime, SelectCafeteria } from '../actions/ui';

const orderTypes: SorterType[] = ['booth', 'kcal', 'carbs', 'fat', 'protein', 'sodium'];
const checkSelection = ['updateMenu', 'selectTime', 'selectCafeteria', 'selectDay'];

export function reducer(state: State, action: Action): State {
  const dayKey = getNumericDate((action as LoadMenu).day || state.day);
  let selection: MenuSelection;

  if (checkSelection.indexOf(action.type) !== -1) {
    const weeklyMenu = action.type === 'updateMenu' ? action.data : state.menus;
    selection = selectDefaultMenu(weeklyMenu[dayKey], {
      cafeteria: (action as SelectCafeteria).cafeteria || state.cafeteria,
      time: (action as SelectTime).time || state.time,
    });
  }

  switch (action.type) {
    case 'loadMenu':
      return {
        ...state,
        status: {
          ...state.status,
          [dayKey]: 'loading',
        },
      };

    case 'loadMenuError':
      return {
        ...state,
        status: {
          ...state.status,
          [dayKey]: 'error',
        },
      };

    case 'updateMenu':
      return {
        ...state,
        ...selection,
        menus: action.data,
        status: {
          ...state.status,
          [dayKey]: 'ready',
        },
      };

    case 'updateCurrentCongestion':
      return {
        ...state,
        congestion: action.data,
      };

    case 'selectTime':
      return {
        ...state,
        ...selection,
      };

    case 'selectCafeteria':
      return {
        ...state,
        ...selection,
      };

    case 'toggleOrderType':
      const i = orderTypes.indexOf(state.sortBy);
      const j = (i + orderTypes.length + (action.prev ? -1 : 1)) % orderTypes.length;
      return {
        ...state,
        sortBy: orderTypes[j],
      };

    case 'toggleOrderDirection':
      return {
        ...state,
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
      };

    case 'updateApiAccess':
      return {
        ...state,
        apiAccess: action.status,
      };

    case 'updateRapAccess':
      return {
        ...state,
        rapAccess: action.status,
      };

    case 'showDaySelection':
      return {
        ...state,
        selectingDay: action.display,
      };

    case 'selectDay': {
      return {
        ...state,
        ...selection,
        day: action.day,
        selectingDay: false,
      };
    }

    default:
      return state;
  }
}
