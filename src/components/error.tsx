import * as React from 'react';

export function Error(): JSX.Element {
  const linkOptions = { href: RAP_URL, target: '_blank', rel: 'noreferrer' };

  return (
    <div id='error'>
      <div className='img' />
      <p>Error retrieving the data.</p>
      <p>
        You need to be logged into <a {...linkOptions}>RAP</a> in order to see
        the contents of the <em>confidential</em> menu...
      </p>
    </div>
  );
}
