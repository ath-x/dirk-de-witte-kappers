import React, { useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import ProductSection from './sections/ProductSection';
import ShowcaseSection from './sections/ShowcaseSection';
import ProcessSection from './sections/ProcessSection';
import DefaultSection from './sections/DefaultSection';

const Section = ({ data }) => {
  const sectionOrder = data.section_order || [];
  const layoutSettings = data.layout_settings || {};

  const iconMap = {
    'table': 'fa-table-columns',
    'zap': 'fa-bolt-lightning',
    'smartphone': 'fa-mobile-screen-button',
    'laptop': 'fa-laptop',
    'gear': 'fa-gear',
    'check': 'fa-circle-check',
    'star': 'fa-star',
    'globe': 'fa-globe',
    'users': 'fa-users',
    'rocket': 'fa-rocket'
  };

  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data, sectionOrder]);

  return (
    <div className="flex flex-col">
      {sectionOrder.filter(name => name !== 'site_settings').map((sectionName, idx) => {
        const items = data[sectionName] || [];
        if (items.length === 0) return null;

        const sectionSettings = data.section_settings?.[sectionName] || {};
        const sectionBgColor = sectionSettings.backgroundColor || null;
        const sectionStyle = sectionBgColor ? { backgroundColor: sectionBgColor } : {};
        const currentLayout = layoutSettings[sectionName] || 'list';

        // 1. Hero Sections
        if (sectionName === 'basisgegevens' || sectionName === 'hero') {
          return <HeroSection key={idx} sectionName={sectionName} items={items} sectionStyle={sectionStyle} />;
        }

        // 2. Product/Shop Sections
        if (sectionName.includes('product') || sectionName.includes('shop')) {
          return <ProductSection key={idx} sectionName={sectionName} items={items} sectionStyle={sectionStyle} />;
        }

        // 3. Showcase/Portfolio Sections
        if (sectionName === 'showcase' || sectionName === 'portfolio') {
          return <ShowcaseSection key={idx} sectionName={sectionName} items={items} sectionStyle={sectionStyle} />;
        }

        // 4. Process/Stappen Sections
        if (sectionName === 'proces' || sectionName === 'stappen') {
          return <ProcessSection key={idx} sectionName={sectionName} items={items} sectionStyle={sectionStyle} />;
        }

        // 5. Default Sections (Grid/List/Z-Pattern)
        return (
          <DefaultSection 
            key={idx} 
            sectionName={sectionName} 
            items={items} 
            sectionStyle={sectionStyle} 
            currentLayout={currentLayout} 
            iconMap={iconMap} 
          />
        );
      })}
    </div>
  );
};

export default Section;
