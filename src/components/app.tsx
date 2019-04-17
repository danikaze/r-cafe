import * as React from 'react';
import * as DayImg from '../img/booth-grill.jpg';

export function App() {
  return (
    <>
      <img src={DayImg} />
      <div>{APP_VERSION}</div>
    </>
  );
}
