import * as React from 'react';

export function Loading(): JSX.Element {
  return (
    <div id='loading' className='spinner'>
      <div className='rect1' />
      <div className='rect2' />
      <div className='rect3' />
      <div className='rect4' />
      <div className='rect5' />
    </div>
  );
}
