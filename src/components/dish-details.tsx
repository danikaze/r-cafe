import * as React from 'react';
import { Dish, Booth } from '../def';
import { formatNumber } from '../util/format-number';
import { Nutrition } from './nutrition';
import { Ingredients } from './ingredients';

export type Props = Dish;

function boothToClass(booth: Booth): string {
  return booth.replace(/[ &]/g, '').toLowerCase();
}

export function DishDetails(props: Props) {
  const { id, booth, title, ingredients, nutrition, price, image } = props;

  const priceElem = price && <div className='price'>{formatNumber(price)}円</div> || null;

  return (
    <div id={`dish-${id}`} className={`dish ${boothToClass(booth)}${price ? ' paid' : ''}`}>
      <div className='preview' style={{ backgroundImage: `url(${image})` }}>
        <a target='_blank' rel='noreferrer' href={image} />
      </div>
      <div className='details'>
        <div className='booth'>
          <div className='icon' />
          <span className='booth-name'>{booth}</span>
        </div>
        <div className='dish-name'>{title}</div>
        <Nutrition {...nutrition} />
        <Ingredients list={ingredients} />
        {priceElem}
      </div>
    </div>
  );
}
