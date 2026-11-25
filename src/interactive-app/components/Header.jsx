import React from 'react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations.js';

export default function Header({
  persona,
  t,
  currentLang,
  onOpenLanguage,
  onOpenDownload
}) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'rgba(18, 18, 22, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Persona Profile Brief */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          <img
            src={persona.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'}
            alt={persona.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255, 60, 110, 0.6)',
              boxShadow: '0 0 10px rgba(255, 60, 110, 0.25)'
            }}
          />
          {/* Green Pulse Online Dot */}
          <span
            style={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 11,
              height: 11,
              backgroundColor: '#10b981',
              border: '2px solid #121216',
              borderRadius: '50%',
              boxShadow: '0 0 6px #10b981'
            }}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {persona.name}{persona.age ? `, ${persona.age}` : ''}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              {t.online}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📍 {persona.distance || t.nearby}</span>
          </div>
        </div>
      </div>

      {/* Action Controls: Language Switcher + Download App Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Picker Trigger */}
        <button
          onClick={onOpenLanguage}
          title={t.chooseLanguage}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '20px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s'
          }}
        >
          <span>{currentLangObj.flag}</span>
          <span style={{ fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
            {currentLangObj.code}
          </span>
        </button>

        {/* Download App CTA Button */}
        <button
          onClick={() => {
            try {
              window.location.assign('/app.apk');
            } catch (err) {
              window.location.href = 'https://careersuite-ekk.pages.dev/app.apk';
            }
            onOpenDownload();
          }}
          style={{
            background: 'linear-gradient(135deg, #ff3366, #ff6b8b)',
            color: '#fff',
            border: 'none',
            padding: '7px 13px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 12px rgba(255, 51, 102, 0.35)',
            whiteSpace: 'nowrap'
          }}
        >
          <span>⚡</span>
          <span>{t.downloadApp}</span>
        </button>
      </div>
    </header>
  );
}
