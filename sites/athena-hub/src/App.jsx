import StyleInjector from './components/StyleInjector';
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';

import { DisplayConfigProvider } from './components/DisplayConfigContext';

const App = ({ data: initialData }) => {
  // 1. Initialiseer state met data + eventuele live-overrides uit de sessie
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem('athena_live_overrides');
    if (saved) {
      try {
        const overrides = JSON.parse(saved);
        console.log('🛡️ [App] Restoring live overrides:', overrides);
        const merged = { ...initialData };
        
        Object.keys(overrides).forEach(file => {
          if (merged[file]) {
            if (Array.isArray(merged[file])) {
              // Merge in de eerste rij van het array
              merged[file] = [{ ...merged[file][0], ...overrides[file] }];
            } else {
              merged[file] = { ...merged[file], ...overrides[file] };
            }
          }
        });
        return merged;
      } catch (e) { return initialData; }
    }
    return initialData;
  });

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, key, value, file, index } = event.data;
      if (!type) return;

      if (type.startsWith('DOCK_UPDATE_')) {
        setData(prev => {
          const newData = { ...prev };
          const settingsKey = file || 'site_settings';
          
          if (newData[settingsKey]) {
            let updatedValue;
            if (Array.isArray(newData[settingsKey])) {
              const row = { ...newData[settingsKey][index || 0], [key]: value };
              newData[settingsKey] = [...newData[settingsKey]];
              newData[settingsKey][index || 0] = row;
              updatedValue = row;
            } else {
              newData[settingsKey] = { ...newData[settingsKey], [key]: value };
              updatedValue = newData[settingsKey];
            }

            // Save override
            const currentOverrides = JSON.parse(sessionStorage.getItem('athena_live_overrides') || '{}');
            if (!currentOverrides[settingsKey]) currentOverrides[settingsKey] = {};
            currentOverrides[settingsKey][key] = value;
            sessionStorage.setItem('athena_live_overrides', JSON.stringify(currentOverrides));
          }
          return newData;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const primaryTable = Object.keys(data)[0];

  return (
    <DisplayConfigProvider data={data}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
          <StyleInjector siteSettings={data['site_settings']} />
          <Header primaryTable={data[primaryTable]} tableName={primaryTable} siteSettings={data['site_settings']} />

          <main style={{ paddingTop: 'var(--content-top-offset, 0px)' }}>
            <Section data={data} />
          </main>

          <Footer data={data} />
        </div>
      </Router>
    </DisplayConfigProvider>
  );
};

export default App;
