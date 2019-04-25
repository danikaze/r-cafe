import * as React from 'react';

export interface Props {
  day: Date;
  className?: string;
  onClick(): void;
}

export function WeekDay({ day, className, onClick }: Props) {
  const dayNumber = day.getDate();
  const dayShortName = day.toLocaleDateString('en', { weekday: 'short' });
  const dayName = day.toLocaleDateString('en', { weekday: 'long' });

  function clickHandler(ev: React.MouseEvent) {
    ev.stopPropagation();
    onClick();
  }

  return (
    <div
      className={`weekday ${className}`}
      title={`${dayName} ${dayNumber}`}
      onClick={clickHandler}
    >
      <div className='name'>
        {dayShortName}
      </div>
      <div className='number'>
        {dayNumber}
      </div>
    </div>
  );
}
