import * as React from 'react';
import { render } from 'react-dom';

import { App } from './components/app';
import { createState } from './store';
import { reducer } from './store/reducers';
import { State } from './def';

const now = new Date();
const initialState: State = {
  status: {},
  day: now,
  selectingDay: false,
  cafeteria: '9f',
  time: now.getHours() >= LUNCH_END ? 'night' : 'day',
  menus: {},
  congestion: {},
  sortBy: 'booth',
  sortOrder: 'asc',
};

const container = document.createElement('div');
document.body.appendChild(container);

const { StateProvider, useStateValue } = createState();

const app = (
  <StateProvider reducer={reducer} initialState={initialState}>
    <App useStateValue={useStateValue} />
  </StateProvider>
);

render(app, container);
