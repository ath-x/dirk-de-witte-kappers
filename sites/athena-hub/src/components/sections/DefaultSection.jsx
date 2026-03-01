import React from 'react';
import EditableMedia from '../EditableMedia';
import EditableText from '../EditableText';
import EditableLink from '../EditableLink';

const DefaultSection = ({ sectionName, items, sectionStyle, currentLayout, iconMap }) => {
  return (
    <section id={sectionName} data-dock-section={sectionName} className="py-24 px-6 bg-[var(--color-background)]" style={sectionStyle}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 capitalize">
            {sectionName.replace(/_/g, ' ')}
          </h2>
          <div className="h-1.5 w-24 bg-accent rounded-full"></div>
        </div>

        <div className={currentLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12' : 'space-y-20'}>
          {items.map((item, index) => {
            const titleKey = Object.keys(item).find(k => /naam|titel|onderwerp|header|title/i.test(k));
            const textKeys = Object.keys(item).filter(k => k !== titleKey && !/foto|afbeelding|url|image|img|link|id|icon/i.test(k));
            const imgKey = Object.keys(item).find(k => /foto|afbeelding|url|image|img/i.test(k));
            const isEven = index % 2 === 0;

            if (currentLayout === 'grid') {
              const iconClass = item.icon ? (iconMap[item.icon.toLowerCase()] || `fa-${item.icon.toLowerCase()}`) : null;
              return (
                <div key={index} className="flex flex-col items-center text-center bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
                  {iconClass && (
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 text-accent text-4xl shadow-inner">
                      <i className={`fa-solid ${iconClass}`}></i>
                    </div>
                  )}
                  {titleKey && (
                    <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">
                      <EditableText value={item[titleKey]} cmsBind={{ file: sectionName, index: index, key: titleKey }} />
                    </h3>
                  )}
                  {textKeys.map(tk => (
                    <div key={tk} className="text-slate-600 text-lg leading-relaxed">
                      <EditableText value={item[tk]} cmsBind={{ file: sectionName, index: index, key: tk }} />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={index} className={`flex flex-col items-center text-center ${currentLayout === 'list' ? '' : (isEven ? 'md:flex-row' : 'md:flex-row-reverse')} gap-12 md:gap-20`}>
                {imgKey && item[imgKey] && (
                  <div className="w-full md:w-1/2 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl rotate-1 group hover:rotate-0 transition-transform duration-500 border-8 border-white">
                    <EditableMedia src={item[imgKey]} cmsBind={{ file: sectionName, index: index, key: imgKey }} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  {titleKey && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                      <h3 className="text-3xl font-serif font-bold text-primary leading-tight flex-1">
                        <EditableText value={item[titleKey]} cmsBind={{ file: sectionName, index: index, key: titleKey }} />
                      </h3>
                    </div>
                  )}
                  {textKeys.map(tk => (
                    <div key={tk} className="text-xl leading-relaxed text-slate-600 mb-6 font-light">
                      <EditableText value={item[tk]} cmsBind={{ file: sectionName, index: index, key: tk }} />
                    </div>
                  ))}
                  {(item.link || item.link_url) && (
                    <EditableLink
                      label={item.link || "Lees meer"}
                      url={item.link_url || item.link}
                      table={sectionName}
                      field="link"
                      id={index}
                      className="inline-flex items-center gap-2 text-accent font-bold hover:underline text-lg mt-4"
                    >
                      {item.link || "Lees meer"} <i className="fa-solid fa-arrow-right text-sm ml-1"></i>
                    </EditableLink>
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

export default DefaultSection;
