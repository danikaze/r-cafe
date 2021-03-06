// tslint:disable:no-boolean-literal-compare
import * as React from 'react';
import { Cafeteria, DayMenu, State, Dish, Time } from '../def';
import { selectTime, toggleOrderType, toggleOrderDirection, selectCafeteria, showDaySelection, selectDay } from '../store/actions/ui';
import { loadCurrentCongestion } from '../store/actions/congestion';
import { loadMenu } from '../store/actions/menu';
import { getNumericDate, getWorkDays } from '../util/date';
import { sortDishes } from '../util/sort-dishes';
import { AppTitle } from './app-title';
import { Congestion } from './congestion';
import { CafeteriaList } from './cafeteria-list';
import { Time as TimeElem } from './time';
import { Loading } from './loading';
import { Error } from './error';
import { DishDetails } from './dish-details';
import { SortButton } from './sort-button';
import { ErrorRap } from './error-rap';
import { WeekDay } from './week-day';
import { WeekDaySelector } from './week-day-selector';

export function App({ useStateValue }) {
  function handleTimeSelect(time: Time) {
    resetScroll({ time });
    dispatch(selectTime(time));
  }

  function handleOrderTypeSelect(prev?: boolean) {
    dispatch(toggleOrderType(prev));
  }

  function handleOrderDirectionSelect() {
    dispatch(toggleOrderDirection());
  }

  function handleCafeteriaSelect(cafeteria) {
    resetScroll({ cafeteria });
    dispatch(selectCafeteria(cafeteria));
  }

  function handleShowDaySelection() {
    dispatch(showDaySelection(true));
  }

  function handleDaySelection(day: Date) {
    resetScroll({ day });
    dispatch(loadMenu(day));
    dispatch(selectDay(day));
  }

  function handleHideDaySelection() {
    dispatch(showDaySelection(false));
  }

  function resetScroll(changes: { time?: Time, day?: Date, cafeteria?: Cafeteria }): void {
    if ((changes.time && (changes.time !== time))
        || (changes.day && (changes.day.getDate() !== day.getDate()))
        || (changes.cafeteria && (changes.cafeteria !== cafeteria))) {
      window.scrollTo(0, 0);
    }
  }

  const [state, dispatch] = useStateValue();
  const { status, selectingDay, day, time, cafeteria, sortBy, sortOrder, rapAccess } = state as State;

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
  const todayMenu = state.menus[dayKey] as DayMenu;
  const congestion = state.congestion[cafeteria];
  let cafeterias: Cafeteria[] = [];
  let dishes: Dish[];
  let contents: JSX.Element;

  const calendarSheet = selectingDay
    ? <WeekDaySelector days={getWorkDays()} active={day} onClick={handleDaySelection} />
    : (
        <div id='day'>
          <WeekDay day={day} onClick={handleShowDaySelection} className='active' />;
        </div>
      );

  if (dayStatus === 'error') {
    contents = <Error />;
  } else if (dayStatus === 'loading' || !todayMenu) {
    contents = <Loading />;
  } else {
    cafeterias = (Object.keys(todayMenu) as Cafeteria[]).filter((c) => todayMenu[c][time].length);
    dishes = sortDishes(sortBy, sortOrder, todayMenu && todayMenu[cafeteria] && todayMenu[cafeteria][time]);
    contents = (
      <div className='dishes'>
        {dishes.map((dish) => <DishDetails key={dish.id} {...dish} />)}
      </div>
    );
  }

  return (
    <div onClick={handleHideDaySelection}>
      <div id='top-bar'>
        <AppTitle />
        {rapAccess === false ? <ErrorRap /> : null}
        <Congestion rate={congestion} />
        {calendarSheet}
        <TimeElem time={time} onClick={handleTimeSelect} />
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
      {contents}
    </div>
  );
}
