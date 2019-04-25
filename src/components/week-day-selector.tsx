import * as React from 'react';
import { WeekDay } from './week-day';

export interface Props {
  days: Date[];
  active: Date;
  onClick(day: Date): void;
}

export function WeekDaySelector({ days, active, onClick }: Props) {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const activeDay = active.getDate();

  const dayList = days.map((day, i) => {
    const classes = [`day${i}`];
    if (day.getDate() === activeDay) {
      classes.push('active');
    }
    if (day < today) {
      classes.push('past');
    }

    function clickHandler() {
      onClick(day);
    }

    return (
      <WeekDay
        key={i}
        day={day}
        className={classes.join(' ')}
        onClick={clickHandler}
      />
    );
  });

  return (
    <div id='day-selector'>
      {dayList}
    </div>
  );
}
