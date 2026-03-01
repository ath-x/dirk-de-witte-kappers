import React from 'react';
import EditableText from '../EditableText';

const ProcessSection = ({ sectionName, items, sectionStyle }) => {
  return (
    <section id={sectionName} data-dock-section={sectionName} className="py-24 px-6 bg-[var(--color-background)] overflow-hidden" style={sectionStyle}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-20 text-center">
          <h2 className="text-5xl font-serif font-bold text-primary mb-6 capitalize">
            {sectionName.replace(/_/g, ' ')}
          </h2>
          <div className="h-1.5 w-20 bg-accent rounded-full"></div>
        </div>
        <div className="space-y-12">
          {items.map((item, index) => {
            const titleKey = Object.keys(item).find(k => /naam|titel|stap|header|title/i.test(k));
            const textKey = Object.keys(item).find(k => /beschrijving|omschrijving|tekst|text|uitleg/i.test(k));
            return (
              <div key={index} className="flex gap-8 md:gap-16 items-start group">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl md:text-3xl font-black shadow-xl shadow-primary/20 group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                    {index + 1}
                  </div>
                  {index < items.length - 1 && (
                    <div className="w-1 h-full min-h-[4rem] bg-gradient-to-b from-primary/20 to-transparent mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pt-4 md:pt-6">
                  {titleKey && (
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
                      <EditableText value={item[titleKey]} cmsBind={{ file: sectionName, index: index, key: titleKey }} />
                    </h3>
                  )}
                  {textKey && (
                    <div className="text-xl leading-relaxed text-slate-600 font-light italic">
                      <EditableText value={item[textKey]} cmsBind={{ file: sectionName, index: index, key: textKey }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
