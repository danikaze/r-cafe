import * as React from 'react';
import { Nutrition } from '../def';

export type Props = Nutrition;

export function Nutrition(props: Props) {
  const { kcal, carbs, fat, protein, sodium } = props;

  return (
    <>
      <div className='calories'>{kcal} kcal.</div>
      <div className='components'>
        <div className='carb'>
          <div className='icon' /><span className='component-name'>Carbs</span> {carbs} gr
        </div>
        <div className='fat'>
          <div className='icon' /><span className='component-name'>Fat</span> {fat} gr.
        </div>
        <div className='protein'>
          <div className='icon' /><span className='component-name'>Protein</span> {protein} gr.
        </div>
        <div className='sodium'>
          <div className='icon' /><span className='component-name'>Sodium</span> {sodium} gr.
        </div>
      </div>
    </>
  );
}
