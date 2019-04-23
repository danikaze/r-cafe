import * as React from 'react';

export function AppTitle(): JSX.Element {
  return (
    <div id='app-title'>
      {APP_TITLE}
      <span>{APP_VERSION}</span>
    </div>
  );
}
