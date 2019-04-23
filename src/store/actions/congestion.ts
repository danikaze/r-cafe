import { ThunkAction } from '..';
import { State, Congestion } from '../../def';
import { loadCongestion as loadCongestionFromApi } from '../service/api/load-congestion';
import { loadCongestion as loadCongestionFromRap } from '../service/rap/load-congestion';

export interface UpdateCurrentCongestion {
  type: 'updateCurrentCongestion';
  data?: Congestion;
}

export function loadCurrentCongestion(): ThunkAction<void, State, null, UpdateCurrentCongestion> {
  return async (dispatch) => {
    const currentHour = new Date().getHours();

    if (currentHour < LUNCH_START
      || (currentHour > LUNCH_END && currentHour < DINNER_START)
      || currentHour > DINNER_END) {
      dispatch({
        type: 'updateCurrentCongestion',
        data: {},
      });
      return;
    }

    let congestion: Congestion;
    try {
      congestion = await loadCongestionFromApi();
    } catch (e) {
      congestion = await loadCongestionFromRap();
    }

    dispatch({
      type: 'updateCurrentCongestion',
      data: congestion,
    });
  };
}
