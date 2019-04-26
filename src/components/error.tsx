import * as React from 'react';

export function Error(): JSX.Element {
  const linkOptions = { href: RAP_URL, target: '_blank', rel: 'noreferrer' };

  return (
    <div id='error'>
      <div className='img' />
      <p>Error retrieving the data.</p>
      <p>
        Try logging into <a {...linkOptions}>RAP</a> to access the contents of the <em>confidential</em> menu.
      </p>
      <p>
        If not, try a moments later.
      </p>
    </div>
  );
}
