import * as React from 'react';
import { Cafeteria } from '../def';

export interface Props {
  list: Cafeteria[];
  active: Cafeteria;
  onClick: (c: Cafeteria) => void;
}

const namingMap: { [key in Cafeteria]: string } = {
  '9f': '9F',
  '22f': '22F',
  rise: 'Rise',
  osaka: 'Osaka',
};

function renderTab(tab: Cafeteria, props: Props): JSX.Element {
  const { active, onClick } = props;

  function clickHandler() {
    onClick(tab);
  }

  return (
    <li
      key={tab}
      className={`tab tab-${tab}${tab === active ? ' active' : ''}`}
      onClick={clickHandler}
    >
      {namingMap[tab]}
    </li>
  );
}

export function CafeteriaList(props: Props) {
  return (
    <ul className='tabs'>
      {props.list.map((c) => renderTab(c, props))}
    </ul>
  );
}
