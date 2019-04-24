// tslint:disable:no-boolean-literal-compare
import * as React from 'react';
import { Cafeteria, DayMenu, State } from '../def';
import { selectTime, toggleOrderType, toggleOrderDirection, selectCafeteria } from '../store/actions/ui';
import { loadCurrentCongestion } from '../store/actions/congestion';
import { loadTodayMenu } from '../store/actions/menu';
import { getNumericDate } from '../util/date';
import { sortDishes } from '../util/sort-dishes';
import { AppTitle } from './app-title';
import { Congestion } from './congestion';
import { CafeteriaList } from './cafeteria-list';
import { Time } from './time';
import { Loading } from './loading';
import { Error } from './error';
import { DishDetails } from './dish-details';
import { SortButton } from './sort-button';
import { ErrorRap } from './error-rap';

export function App({ useStateValue }) {
  const [state, dispatch] = useStateValue();
  const { status, time, cafeteria, sortBy, sortOrder, rapAccess, apiAccess } = state as State;

  React.useEffect(() => {
    dispatch(loadTodayMenu());
    dispatch(loadCurrentCongestion());

    const congestionHandler = setInterval(() => dispatch(loadCurrentCongestion()), CONGESTION_INTERVAL);

    return () => {
      clearInterval(congestionHandler);
    };
  }, []);

  if (status === 'waiting' || status === 'loading') {
    return <Loading />;
  }

  if (rapAccess === false && apiAccess === false) {
    return <Error />;
  }

  const today = getNumericDate();
  const todayMenu = state.menus[today] as DayMenu;

  if (!todayMenu) {
    return <Error />;
  }

  const cafeterias = (Object.keys(todayMenu) as Cafeteria[]).filter((c) => todayMenu[c][time].length);
  const dishes = sortDishes(sortBy, sortOrder, todayMenu && todayMenu[cafeteria] && todayMenu[cafeteria][time]);
  const congestion = state.congestion[cafeteria];

  function handleTimeSelect(time) {
    dispatch(selectTime(time));
  }

  function handleOrderTypeSelect() {
    dispatch(toggleOrderType());
  }

  function handleOrderDirectionSelect() {
    dispatch(toggleOrderDirection());
  }

  function handleCafeteriaSelect(cafeteria) {
    dispatch(selectCafeteria(cafeteria));
  }

  return (
    <>
      <div id='top-bar'>
        <AppTitle />
        {rapAccess === false ? <ErrorRap /> : null}
        <Congestion rate={congestion} />
        <Time time={time} onClick={handleTimeSelect} />
        <SortButton
          type={sortBy}
          direction={sortOrder}
          onClickType={handleOrderTypeSelect}
          onClickDirection={handleOrderDirectionSelect}
        />
        <CafeteriaList
          list={cafeterias}
          active={cafeteria}
          onClick={handleCafeteriaSelect}
        />
      </div>
      <div className='dishes'>
        {dishes.map((dish) => <DishDetails key={dish.id} {...dish} />)}
      </div>
    </>
  );
}
