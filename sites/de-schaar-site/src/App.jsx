import React, { useMemo } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import StyleInjector from './components/StyleInjector';

const App = ({ data }) => {
  const primaryTable = data['basis'] || [];
  
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
      <StyleInjector hero={data['hero']} headerSettings={data['header_settings']} />
      
      <Header 
        primaryTable={primaryTable} 
        tableName="basis" 
        hero={data['hero']} 
        headerSettings={data['header_settings']}
        navData={data['paginastructuur']}
      />
      
      <main>
        <Section data={data} />
      </main>

      <Footer 
        primaryTable={data['basis']} 
        socialData={data['social_media']}
      />
    </div>
  );
};

export default App;
