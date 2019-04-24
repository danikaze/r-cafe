import * as React from 'react';

export function ErrorRap(): JSX.Element {
  const linkOptions = {
    href: RAP_URL,
    target: '_blank',
    rel: 'noreferrer',
    title: 'You need to be logged into RAP in order to access to the full contents of the menu\n'
         + 'Click here to sign in',
  };

  return <a id='error-rap' {...linkOptions} />;
}
