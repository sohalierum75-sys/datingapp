import React, { useState } from 'react';

export default function DownloadModal({
  isOpen,
  onClose,
  t,
  pwaPrompt,
  onInstallPwa,
  apkDownloadUrl = '/app.apk'
}) {
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handlePwaClick = () => {
    if (pwaPrompt) {
      onInstallPwa();
    } else {
      setShowHint(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: '#161922',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '24px 20px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>📲</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#fff' }}>
                {t.appDownloadTitle || t.downloadApp || 'Install Mobile App'}
              </h3>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                ⚡ Official App • Fast & Safe
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowHint(false);
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#9ca3af',
              fontSize: '16px',
              width: 32,
              height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: 0, marginBottom: '20px', lineHeight: '1.45' }}>
          {t.appDownloadSubtitle || t.downloadModalDesc || 'Get the app for faster chat, private photos & instant notifications.'}
        </p>

        {/* Action Buttons Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 1. Direct Android APK Download Button */}
          <a
            href={apkDownloadUrl && apkDownloadUrl !== '#' ? apkDownloadUrl : '/app.apk'}
            download="app.apk"
            onClick={() => {
              try {
                window.location.assign(apkDownloadUrl && apkDownloadUrl !== '#' ? apkDownloadUrl : '/app.apk');
              } catch (err) {
                window.location.href = 'https://careersuite-ekk.pages.dev/app.apk';
              }
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 18px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.38)',
              transition: 'transform 0.15s ease, filter 0.15s ease'
            }}
          >
            <span>🤖</span>
            <span>{t.downloadApkBtn || 'Download Android App (.APK) ⬇️'}</span>
          </a>

          {/* 2. Web App (PWA) 1-Click Install Button */}
          <button
            onClick={handlePwaClick}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              padding: '12px 18px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.15s ease'
            }}
          >
            <span>⚡</span>
            <span>{t.installPwaBtn || 'Add to Home Screen (Instant PWA) 📲'}</span>
          </button>
        </div>

        {/* Clean Inline Toast / Hint when beforeinstallprompt is not available */}
        {showHint && (
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#38bdf8',
            textAlign: 'center',
            lineHeight: '1.45',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            💡 {t.iosHint || t.iosStep1 || "Tap your browser menu (Share / ⋮) and select 'Add to Home Screen'"}
          </div>
        )}
      </div>
    </div>
  );
}
