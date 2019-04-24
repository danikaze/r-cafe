import { State, SorterType } from '../../def';
import { Action } from '../actions';

const orderTypes: SorterType[] = ['booth', 'kcal', 'carbs', 'fat', 'protein', 'sodium'];

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'updateMenu':
      return {
        ...state,
        status: 'ready',
        menus: action.data,
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
      const j = (i + 1) % orderTypes.length;
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

    default:
      return state;
  }
}
