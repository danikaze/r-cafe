import * as React from 'react';
import { SorterType, SorterDirection } from '../def';

export interface Props {
  type: SorterType;
  direction: SorterDirection;
  onClickType(currentType: SorterType): void;
  onClickDirection(currentDirection: SorterDirection): void;
}

const map = {
  booth: {
    name: 'Booth',
    title: 'Sorting by Booth type',
  },
  kcal: {
    name: 'Kcal',
    title: 'Sorting by Calory quantity',
  },
  carbs: {
    name: 'Carbs',
    title: 'Sorting by Carbs quantity',
  },
  fat: {
    name: 'Fats',
    title: 'Sorting by Fat quantity',
  },
  protein: {
    name: 'Proteins',
    title: 'Sorting by Protein quantity',
  },
  sodium: {
    name: 'Sodium',
    title: 'Sorting by Sodium quantity',
  },
  // umai: {
  //   name: 'Umai',
  //   title: 'Sorting by number of Likes',
  // },
};

export function SortButton(props: Props) {
  const data = map[props.type];

  function typeClickHandler() {
    props.onClickType(props.type);
  }

  function directionClickHandler(ev: React.MouseEvent) {
    ev.stopPropagation();
    props.onClickDirection(props.direction);
  }

  return (
    <div id='sort-button' onClick={typeClickHandler}>
      <span id='sort-type' className={`sorter-${props.type}`} title={data.title}>{data.name}</span>
      <div id='sort-direction' className={props.direction} onClick={directionClickHandler}>
        <div className='arrow' />
      </div>
    </div>
  );
}
