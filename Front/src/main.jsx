import React from 'react';  // Ensure React is imported
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './CSS/index.css';
import App from './JSXcomponents/App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
