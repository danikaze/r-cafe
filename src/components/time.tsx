import * as React from 'react';
import { Time } from '../def';

export interface Props {
  time: Time;
  onClick(t: Time): void;
}

const map = {
  day: {
    id: 'show-dinner',
    title: 'Displaying lunch.\nClick to show dinner time.',
  },
  night: {
    id: 'show-lunch',
    title: 'Displaying dinner.\nClick to show lunch time.',
  },
};

export function Time(props: Props) {
  const { time, onClick } = props;

  function clickHandler() {
    onClick(time === 'day' ? 'night' : 'day');
  }

  return (
    <div
      {...map[time]}
      onClick={clickHandler}
    />
  );
}
