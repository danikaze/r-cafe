import * as React from 'react';

export interface Props {
  rate: number;
}

export function Congestion(props: Props) {
  if (!props.rate) {
    return null;
  }

  return (
    <div id='congestion' title='Ocuppation percentage'>
      <span className='rate'>
        {props.rate}%
      </span>
    </div>
  );
}
