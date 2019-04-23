import * as React from 'react';
import { Ingredient } from '../def';
import { capitalise } from '../util/capitalise';

export interface Props {
  list: Ingredient[];
}

export function Ingredients(props: Props) {
  return (
    <div className='ingredients'>
      {props.list.map((ing) => <div key={ing} className={`ingredient ingredient-${ing}`} title={capitalise(ing)} />)}
    </div>
  );
}
