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
  type: 'toggleOrderType';
}

export interface ToggleOrderDirection {
  type: 'toggleOrderDirection';
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

export function toggleOrderType(): ToggleOrderType {
  return {
    type: 'toggleOrderType',
  };
}

export function toggleOrderDirection(): ToggleOrderDirection {
  return {
    type: 'toggleOrderDirection',
  };
}
