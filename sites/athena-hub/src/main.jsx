import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './dock-connector.js';

import rawData from './data/all_data.json';

async function init() {
  const data = {};
  
  try {
    // Phase 8: Static Aggregation (v8 Standard)
    Object.keys(rawData).forEach(key => {
      const sectionData = rawData[key];
      data[key] = sectionData;
    });

    // Ensure backwards compatibility for naming
    data['section_order'] = data['section_order'] || [];
    data['site_settings'] = data['site_settings'] || {};
    data['display_config'] = data['display_config'] || { sections: {} };
    data['layout_settings'] = data['layout_settings'] || {};

    if (window.athenaScan) window.athenaScan(data);
  } catch (e) {
    console.error("Data laad fout:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
