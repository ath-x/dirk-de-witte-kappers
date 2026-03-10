import React, { useState } from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';
import EditableLink from './EditableLink';
import { Link } from 'react-router-dom';

function Header({ data = {} }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Robuuste data extractie
  const headerSource = data.header || [];
  const headerData = Array.isArray(headerSource) ? (headerSource[0] || {}) : headerSource;
  
  const siteName = headerData.site_naam || 'Cloud Architects';
  const tagline = headerData.tagline || '';
  const displayLogo = headerData.logo || "site-logo.svg";
  const logoChar = siteName.charAt(0).toUpperCase();

  const handleScroll = (e) => {
    const url = headerData.knop_link || "#contact";
    setIsMenuOpen(false);
    if (url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.substring(1);
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] px-6 transition-all duration-500 flex items-center shadow-sm"
      style={{
        backgroundColor: 'var(--color-header-bg, rgba(255,255,255,0.95))',
        backdropFilter: 'blur(16px)',
        height: '80px',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo & Identity */}
        <Link to="/" className="flex items-center gap-4 group" onClick={() => setIsMenuOpen(false)}>
          <div className="relative w-12 h-12 overflow-hidden transition-transform duration-500">
            <EditableMedia
              src={displayLogo}
              cmsBind={{ file: 'header', index: 0, key: 'logo' }}
              className="w-full h-full object-contain"
              fallback={logoChar}
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-2xl font-serif font-black tracking-tight text-primary leading-tight">
              <EditableText value={siteName} cmsBind={{ file: 'header', index: 0, key: 'site_naam' }} />
            </span>
            {tagline && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-black block mt-0.5" style={{ color: 'var(--color-accent, #3b82f6)' }}>
                <EditableText value={tagline} cmsBind={{ file: 'header', index: 0, key: 'tagline' }} />
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Action Menu */}
        <div className="hidden md:flex items-center gap-8">
          <EditableLink
            as="button"
            label={headerData.knop_tekst || "Contact"}
            url={headerData.knop_link || "#contact"}
            className="bg-primary text-white px-8 py-3 font-bold hover:bg-accent transition-all duration-300"
            style={{ borderRadius: 'var(--radius-custom, 2.5rem)' }}
            onClick={handleScroll}
          />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl text-primary p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-x-0 top-[80px] bg-white border-b border-gray-100 shadow-xl md:hidden transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
        <div className="p-6 flex flex-col gap-4">
          <Link to="/" className="text-lg font-bold text-primary py-2 border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <EditableLink
            as="button"
            label={headerData.knop_tekst || "Contact"}
            url={headerData.knop_link || "#contact"}
            className="w-full bg-primary text-white px-6 py-3 font-bold hover:bg-accent transition-colors text-center mt-2"
            style={{ borderRadius: 'var(--radius-custom, 2.5rem)' }}
            onClick={handleScroll}
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;