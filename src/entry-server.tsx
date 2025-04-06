import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { HelmetProvider, FilledContext } from 'react-helmet-async';

export function render(url: string) {
  const helmetContext = {};
  
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  const { helmet } = helmetContext as FilledContext;
  const meta = helmet.meta.toString();
  const title = helmet.title.toString();
  const link = helmet.link.toString();
  const script = helmet.script.toString();

  return {
    html,
    meta,
    title,
    link,
    script
  };
} 