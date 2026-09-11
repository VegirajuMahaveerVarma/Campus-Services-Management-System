import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Phase2App';
import './styles.css';
import './eventRegistrationEnhancer';
import './noticeEnhancer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
