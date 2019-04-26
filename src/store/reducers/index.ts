import { State, SorterType } from '../../def';
import { Action } from '../actions';
import { getNumericDate } from '../../util/date';

const orderTypes: SorterType[] = ['booth', 'kcal', 'carbs', 'fat', 'protein', 'sodium'];

export function reducer(state: State, action: Action): State {
  let dayKey: string;

  switch (action.type) {
    case 'loadMenu':
      dayKey = getNumericDate(action.day);
      return {
        ...state,
        status: {
          ...state.status,
          [dayKey]: 'loading',
        },
      };

    case 'updateMenu':
      dayKey = getNumericDate(action.day);
      return {
        ...state,
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
        time: action.time,
      };

    case 'selectCafeteria':
      return {
        ...state,
        cafeteria: action.cafeteria,
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
        selectingDay: false,
        day: action.day,
      };
    }

    default:
      return state;
  }
}
