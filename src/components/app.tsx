// tslint:disable:no-boolean-literal-compare
import * as React from 'react';
import { Cafeteria, DayMenu, State } from '../def';
import { selectTime, toggleOrderType, toggleOrderDirection, selectCafeteria, showDaySelection, selectDay } from '../store/actions/ui';
import { loadCurrentCongestion } from '../store/actions/congestion';
import { loadMenu } from '../store/actions/menu';
import { getNumericDate, getWorkDays } from '../util/date';
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
import { WeekDay } from './week-day';
import { WeekDaySelector } from './week-day-selector';

export function App({ useStateValue }) {
  const [state, dispatch] = useStateValue();
  const { status, selectingDay, day, time, cafeteria, sortBy, sortOrder, rapAccess, apiAccess } = state as State;

  React.useEffect(() => {
    dispatch(loadMenu(day));
    dispatch(loadCurrentCongestion());

    const congestionHandler = setInterval(() => dispatch(loadCurrentCongestion()), CONGESTION_INTERVAL);

    return () => {
      clearInterval(congestionHandler);
    };
  }, []);

  const dayKey = getNumericDate(day);
  const dayStatus = status[dayKey];
  if (dayStatus === 'waiting' || dayStatus === 'loading') {
    return <Loading />;
  }

  if (rapAccess === false && apiAccess === false) {
    return <Error />;
  }

  const todayMenu = state.menus[dayKey] as DayMenu;

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

  function handleShowDaySelection() {
    dispatch(showDaySelection(true));
  }

  function handleDaySelection(day: Date) {
    dispatch(loadMenu(day));
    dispatch(selectDay(day));
  }

  function handleHideDaySelection() {
    dispatch(showDaySelection(false));
  }

  const calendarSheet = selectingDay
    ? <WeekDaySelector days={getWorkDays()} active={day} onClick={handleDaySelection} />
    : (
        <div id='day'>
          <WeekDay day={day} onClick={handleShowDaySelection} className='active' />;
        </div>
      );

  return (
    <div onClick={handleHideDaySelection}>
      <div id='top-bar'>
        <AppTitle />
        {rapAccess === false ? <ErrorRap /> : null}
        <Congestion rate={congestion} />
        {calendarSheet}
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
    </div>
  );
}
