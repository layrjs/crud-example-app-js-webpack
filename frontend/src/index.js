import React from 'react';
import ReactDOM from 'react-dom';

import {getFrontend} from './components/frontend';

const backendURL = process.env.BACKEND_URL;

if (!backendURL) {
  throw new Error(`'BACKEND_URL' environment variable is missing`);
}

(async () => {
  let content;

  try {
    const Frontend = await getFrontend({backendURL});

    if (process.env.NODE_ENV !== 'production') {
      window.Frontend = Frontend; // For debugging
    }

    content = <Frontend.Root.Main />;
  } catch (err) {
    console.error(err);

    content = <pre>{err.stack}</pre>;
  }

  ReactDOM.render(content, document.getElementById('root'));
})();
