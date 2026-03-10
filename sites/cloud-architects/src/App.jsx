import React, { useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import StyleInjector from './components/StyleInjector';

import { DisplayConfigProvider } from './components/DisplayConfigContext';

const App = ({ data = {} }) => {
  // Zorg dat data altijd een object is
  const safeData = data || {};

  return (
    <DisplayConfigProvider data={safeData}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
          <StyleInjector siteSettings={safeData.header?.[0] || {}} />
          
          <Header data={safeData} />
          
          <main style={{ paddingTop: 'var(--content-top-offset, 0px)' }}>
            <Section data={safeData} />
          </main>

          <Footer data={safeData} />
        </div>
      </Router>
    </DisplayConfigProvider>
  );
};

export default App;