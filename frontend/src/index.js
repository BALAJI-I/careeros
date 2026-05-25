import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import posthog from 'posthog-js';

posthog.init('phc_your_key_here', {
  api_host: 'https://app.posthog.com',
  autocapture: true,
  capture_pageview: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);