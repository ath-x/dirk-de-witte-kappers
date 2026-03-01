import React from 'react';
import EditableMedia from '../EditableMedia';
import EditableText from '../EditableText';
import EditableLink from '../EditableLink';

const HeroSection = ({ sectionName, items, sectionStyle }) => {
  const hero = items[0];
  const heroTitle = hero.title || hero.titel || hero.hero_header || hero.site_naam;
  const heroSubtitle = hero.subtitle || hero.ondertitel || hero.introductie;
  const imgKey = Object.keys(hero).find(k => /foto|afbeelding|url|image|img/i.test(k)) || 'image';

  return (
    <section
      id="hero"
      data-dock-section={sectionName}
      className="relative w-full h-auto min-h-[var(--hero-height,85vh)] max-h-[var(--hero-max-height,150vh)] aspect-[var(--hero-aspect-ratio,16/9)] flex items-center justify-center overflow-hidden bg-[var(--color-hero-bg)] pt-24"
      style={sectionStyle}
    >
      <div className="absolute inset-0 z-0">
        <EditableMedia
          src={hero[imgKey]}
          cmsBind={{ file: sectionName, index: 0, key: imgKey }}
          className="w-full h-full object-cover object-top"
          priority={true}
        />
        <div className="absolute inset-0 z-20 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to bottom, var(--hero-overlay-start, rgba(0,0,0,0.6)), var(--hero-overlay-end, rgba(0,0,0,0.6)))'
        }}></div>
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {!hero[imgKey] && <div className="h-2 w-32 bg-accent mx-auto mb-10 rounded-full shadow-lg shadow-accent/50"></div>}
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
          <EditableText value={heroTitle} cmsBind={{ file: sectionName, index: 0, key: Object.keys(hero).find(k => k === 'title' || k === 'titel' || k === 'hero_header' || k === 'site_naam') || 'title' }} />
        </h1>
        <div className="flex flex-col items-center gap-12">
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light italic">
            <EditableText value={heroSubtitle} cmsBind={{ file: sectionName, index: 0, key: Object.keys(hero).find(k => k === 'subtitle' || k === 'ondertitel' || k === 'introductie') || 'subtitle' }} />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <EditableLink
              as="button"
              label={hero.cta_text || hero.cta_label || "Contact"}
              url={hero.cta_url || "#showcase"}
              cmsBind={{ file: sectionName, index: 0, key: hero.cta_text ? 'cta_text' : (hero.cta_label ? 'cta_label' : 'cta') }}
              className="bg-[var(--color-button-bg)] text-white px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:opacity-90 transition-all transform hover:scale-105"
              onClick={(e) => {
                const url = hero.cta_url || "#showcase";
                if (url.startsWith('#')) {
                  e.preventDefault();
                  document.getElementById(url.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
