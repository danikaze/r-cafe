import { Time, Cafeteria } from '../../def';

export interface SelectTime {
  type: 'selectTime';
  time: Time;
}

export interface SelectCafeteria {
  type: 'selectCafeteria';
  cafeteria: Cafeteria;
}

export interface ToggleOrderType {
  prev?: boolean;
  type: 'toggleOrderType';
}

export interface ToggleOrderDirection {
  type: 'toggleOrderDirection';
}

export interface ShowDaySelection {
  type: 'showDaySelection';
  display: boolean;
}

export interface SelectDay {
  type: 'selectDay';
  day: Date;
}

export function selectTime(time: Time): SelectTime {
  return {
    time,
    type: 'selectTime',
  };
}

export function selectCafeteria(cafeteria: Cafeteria): SelectCafeteria {
  return {
    cafeteria,
    type: 'selectCafeteria',
  };
}

export function toggleOrderType(prev?: boolean): ToggleOrderType {
  return {
    prev,
    type: 'toggleOrderType',
  };
}

export function toggleOrderDirection(): ToggleOrderDirection {
  return {
    type: 'toggleOrderDirection',
  };
}

export function showDaySelection(display: boolean): ShowDaySelection {
  return {
    display,
    type: 'showDaySelection',
  };
}

export function selectDay(day: Date): SelectDay {
  return {
    day,
    type: 'selectDay',
  };
}
