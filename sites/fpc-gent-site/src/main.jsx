import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './dock-connector.js';

async function init() {
  const data = {};
  try {
    const dataModules = import.meta.glob('./data/**/*.json', { eager: true });

    // We fetch site_settings manually
    const getData = (name) => {
      const decodedName = decodeURIComponent(name).toLowerCase();
      const key = Object.keys(dataModules).find(k => decodeURIComponent(k).toLowerCase().endsWith(`/${decodedName}.json`));
      return key ? dataModules[key].default : null;
    };

    data['site_settings'] = getData('site_settings') || {};

  } catch (e) {
    console.error("Data load error:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();