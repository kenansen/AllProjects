/**
 * index.js
 * --------
 * React uygulama giriş noktası.
 * App bileşenini DOM'a bağlar.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
