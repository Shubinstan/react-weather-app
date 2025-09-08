import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';      // 1. Import our main App component
import './style.css';    // 2. Import global styles

// 3. Find the root element and "turn on" our application inside it
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

