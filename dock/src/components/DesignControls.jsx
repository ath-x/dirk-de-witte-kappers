import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * DesignControls for Athena Dock (v8.4.3 - DEEP DEBUG EDITION)
 */
export default function DesignControls({ onColorChange, siteStructure }) {
  const lastInteractionTime = useRef(0);
  const [localColors, setLocalColors] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ source: 'none', lastSync: null });
  const [showDebugPopup, setShowDebugPopup] = useState(false);

  const [sliderValues, setSliderValues] = useState({
    content_top_offset: 0,
    header_height: 80
  });

  // Helper om data te mergen en te debuggen
  const hydrateData = (sourceName, rawData) => {
    if (!rawData) return;
    
    // Maak een platte lijst van alle settings
    const flat = {
      ...(rawData.site_settings || {}),
      ...(rawData.style_config || {}),
      ...(rawData.header_settings || {}),
      ...(rawData.hero || {}),
      ...(Array.isArray(rawData.hero) ? rawData.hero[0] : {})
    };

    setLocalColors(prev => ({ ...prev, ...flat }));
    setDebugInfo({ 
        source: sourceName, 
        lastSync: new Date().toLocaleTimeString(), 
        raw: flat,
        keysFound: Object.keys(flat).length
    });
    setIsHydrated(true);

    if (flat.header_hoogte || flat.header_height) {
      setSliderValues(prev => ({ 
          ...prev, 
          header_height: parseInt(flat.header_hoogte || flat.header_height || 80)
      }));
    }
    if (flat.content_top_offset) {
      setSliderValues(prev => ({ ...prev, content_top_offset: parseInt(flat.content_top_offset) }));
    }
  };

  useEffect(() => {
    const handleSiteMessage = (event) => {
      const type = event.data?.type;
      // v33 Bridge: SITE_READY of SITE_SYNC_RESPONSE
      if (type === 'SITE_READY' || type === 'SITE_SYNC_RESPONSE') {
        const payload = event.data.structure || { data: event.data.fullRow ? { style_config: event.data.fullRow } : null };
        if (payload.data) hydrateData('v33 Site Bridge', payload.data);
      }
    };
    window.addEventListener('message', handleSiteMessage);

    // Dock API Fallback
    if (siteStructure?.data && !isHydrated) {
        hydrateData('Dock Dashboard API', siteStructure.data);
    }

    return () => window.removeEventListener('message', handleSiteMessage);
  }, [siteStructure, isHydrated]);

  const triggerManualSync = () => {
    const iframe = document.querySelector('iframe');
    if (iframe?.contentWindow) {
      // Vraag specifiek om de style_config
      iframe.contentWindow.postMessage({ type: 'DOCK_REQUEST_SYNC', file: 'style_config', key: 'theme' }, '*');
    }
  };

  const handlePreview = (key, value) => {
    lastInteractionTime.current = Date.now();
    if (key === 'content_top_offset' || key === 'header_hoogte') {
      const sliderKey = key === 'header_hoogte' ? 'header_height' : key;
      setSliderValues(prev => ({ ...prev, [sliderKey]: value }));
    }
    setLocalColors(prev => ({ ...prev, [key]: value }));
    onColorChange(key, value, false);
  };

  const handleSave = (key, value) => {
    lastInteractionTime.current = Date.now();
    setLocalColors(prev => ({ ...prev, [key]: value }));
    onColorChange(key, value, true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto pb-32">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Design Editor</h3>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isHydrated ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isHydrated ? `Connected` : 'Syncing...'}
          </p>
        </div>
        <button 
            onClick={() => setShowDebugPopup(true)} 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
            title="Open Deep Debug Overlay"
        >
            <i className="fa-solid fa-bug"></i>
        </button>
      </div>

      {/* --- DEEP DEBUG OVERLAY --- */}
      {showDebugPopup && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-10 animate-in fade-in duration-300">
            <div className="bg-black border border-green-500/30 rounded-3xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col shadow-2xl shadow-green-500/10">
                <div className="p-6 border-b border-green-500/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-green-500 font-black text-xl tracking-tighter uppercase">Athena Data Debugger</h2>
                        <p className="text-green-800 text-xs font-mono">Source: {debugInfo.source} | Last Sync: {debugInfo.lastSync}</p>
                    </div>
                    <button onClick={() => setShowDebugPopup(false)} className="bg-green-500 text-black px-6 py-2 rounded-full font-black text-xs hover:bg-white transition-colors">CLOSE DEBUGGER</button>
                </div>
                
                <div className="flex-1 overflow-auto p-8 font-mono text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-green-400">
                        <div>
                            <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2">ACTIVE DESIGN STATE ({debugInfo.keysFound} keys)</h4>
                            <div className="space-y-2">
                                {Object.entries(localColors).sort().map(([k, v]) => (
                                    <div key={k} className="flex justify-between hover:bg-green-500/5 p-1 rounded">
                                        <span className="opacity-50">{k}:</span>
                                        <span className={v === '#000000' ? 'text-yellow-500' : 'text-white'}>
                                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2">DIAGNOSTICS</h4>
                            <div className="space-y-4 text-xs">
                                <div className="p-4 bg-green-950/20 rounded-xl border border-green-500/20">
                                    <p className="font-bold text-white mb-2">Checklist:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Iframe detectie: {document.querySelector('iframe') ? '✅ OK' : '❌ Niet gevonden'}</li>
                                        <li>Site Structure API: {siteStructure ? '✅ OK' : '❌ Geen data'}</li>
                                        <li>Hydratatie status: {isHydrated ? '✅ OK' : '❌ Wachten op data'}</li>
                                    </ul>
                                </div>
                                <button 
                                    onClick={triggerManualSync}
                                    className="w-full py-4 bg-green-500 text-black font-black rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-green-500/20"
                                >
                                    FORCE RE-SYNC FROM SITE
                                </button>
                                <p className="text-[10px] text-green-900 italic">
                                    Tip: Als keys zoals 'light_primary_color' ontbreken of zwart zijn, staat de data niet in de juiste JSON bestanden of werkt de Sync Bridge niet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- REGULAR CONTROLS --- */}
      <div className="space-y-8">
        {/* GLOBAL STYLE DROPDOWN */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Global Theme Stijl</label>
          <select
            onChange={(e) => {
                const rawUrl = siteStructure?.url || window.location.origin;
                const siteName = rawUrl.split('/')[3] || 'dock-test-site';
                const baseUrl = rawUrl.split('/' + siteName)[0];
                const url = `${baseUrl}/${siteName}/__athena/update-json`;
                fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'swap-style', value: e.target.value }) })
                .then(() => window.location.reload());
            }}
            className="w-full text-xs p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-white focus:outline-none shadow-sm"
          >
            <option value="">Selecteer stijl...</option>
            {['modern.css', 'classic.css', 'modern-dark.css', 'bold.css', 'corporate.css', 'warm.css'].map(style => (
              <option key={style} value={style}>🎨 {style.replace('.css', '').toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* HEADER CONTROLS */}
        <div>
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-4 border-b border-blue-50 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-window-maximize"></i> Header & Layout
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase text-slate-400">Zichtbaar</label>
              <input
                type="checkbox"
                checked={localColors.header_zichtbaar !== false}
                onChange={(e) => { handlePreview('header_zichtbaar', e.target.checked); handleSave('header_zichtbaar', e.target.checked); }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
            </div>

            <Slider label="Hoogte" value={sliderValues.header_height} min={40} max={250} unit="px" onChange={(v) => { handlePreview('header_hoogte', v); handleSave('header_hoogte', v); }} />
            <Slider label="Transparantie" value={Math.round((parseFloat(localColors.header_transparantie) || 0) * 100)} min={0} max={100} unit="%" onChange={(v) => { handlePreview('header_transparantie', v/100); handleSave('header_transparantie', v/100); }} />
            <Slider label="Content Offset" value={sliderValues.content_top_offset} min={0} max={200} unit="px" onChange={(v) => { handlePreview('content_top_offset', v); handleSave('content_top_offset', v); }} />
          </div>
        </div>

        {/* COLORS */}
        <ColorSection title="Light Mode" prefix="light_" colors={localColors} onPreview={handlePreview} onSave={handleSave} themeColor="blue" />
        <ColorSection title="Dark Mode" prefix="dark_" colors={localColors} onPreview={handlePreview} onSave={handleSave} themeColor="purple" />
      </div>
    </div>
  );
}

const Slider = ({ label, value, min, max, unit, onChange }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-[9px] font-bold uppercase text-slate-400">{label}</label>
      <span className="text-[9px] font-bold text-blue-500">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onInput={(e) => onChange(e.target.value)} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
  </div>
);

const ColorSection = ({ title, prefix, colors, onPreview, onSave, themeColor }) => (
  <div>
    <h4 className={`text-[10px] font-black text-${themeColor}-500 uppercase tracking-tighter mb-4 border-b border-${themeColor}-50 pb-2`}>
      {title} Colors
    </h4>
    <div className="grid grid-cols-2 gap-4">
      {['primary', 'accent', 'button', 'card', 'header', 'footer', 'bg', 'text'].map(key => (
        <div key={key}>
          <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">{key}</label>
          <input
            type="color"
            value={colors[`${prefix}${key}_color`] || '#000000'}
            onInput={(e) => onPreview(`${prefix}${key}_color`, e.target.value)}
            onChange={(e) => onSave(`${prefix}${key}_color`, e.target.value)}
            className="w-full h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent overflow-hidden"
          />
        </div>
      ))}
    </div>
  </div>
);
