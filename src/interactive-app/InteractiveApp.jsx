import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TabBar from './components/TabBar.jsx';
import ChatTab from './components/ChatTab.jsx';
import QuizTab from './components/QuizTab.jsx';
import LanguageModal from './components/LanguageModal.jsx';
import DownloadModal from './components/DownloadModal.jsx';
import { detectLanguage, getTranslation, QUIZ_QUESTIONS } from './i18n/translations.js';

/**
 * Mobile-First Interactive Web App Module
 * Can be rendered directly on any landing page or embedded into existing React apps.
 *
 * @param {Object} props.config Configuration object driving persona, ads, downloads & ai
 */
export default function InteractiveApp({ config = {} }) {
  // Normalize configuration
  const persona = {
    name: config.name || config.title || 'Sophia',
    age: config.age || 22,
    avatar: config.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    distance: config.distance || '2 miles away',
    dailyScenario: config.dailyScenario || config.description || 'Chilling at home, looking for a sweet chat ❤️',
    privatePhoto: config.privatePhoto || config.avatar,
    privateGallery: config.privateGallery || [
      config.privatePhoto || config.avatar,
      config.avatar,
      config.privatePhoto || config.avatar
    ]
  };

  const adsterraDirectLink = config.adsterraDirectLink || config.ad_url || '';
  const apkDownloadUrl = (config.apkDownloadUrl && config.apkDownloadUrl !== '#')
    ? config.apkDownloadUrl
    : '/app.apk';
  const aiApiKey = config.aiApiKey || null;
  const aiProvider = config.aiProvider || 'fallback';

  // Language management
  const [currentLang, setCurrentLang] = useState(() => {
    return config.defaultLanguage || detectLanguage();
  });

  const t = getTranslation(currentLang);
  const quizQuestions = QUIZ_QUESTIONS[currentLang] || QUIZ_QUESTIONS.en;
  const isRtl = currentLang === 'ar';

  // Tab state
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'quiz'

  // Modals state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // PWA Prompt event capture
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsDownloadModalOpen(false);
      }
    } else {
      // Direct instructions / notice
      alert(t.pwaInstallHelp || "To install, tap your browser's share menu and select 'Add to Home Screen'.");
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        margin: '0 auto',
        maxWidth: '480px',
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#f9fafb',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Top Mobile Header */}
      <Header
        persona={persona}
        t={t}
        currentLang={currentLang}
        onOpenLanguage={() => setIsLangModalOpen(true)}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Navigation Tab Bar */}
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
        quizBadge={3}
      />

      {/* Tab Views */}
      <main style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'chat' ? (
          <ChatTab
            persona={persona}
            t={t}
            currentLang={currentLang}
            adsterraDirectLink={adsterraDirectLink}
            aiApiKey={aiApiKey}
            aiProvider={aiProvider}
          />
        ) : (
          <QuizTab
            persona={persona}
            t={t}
            adsterraDirectLink={adsterraDirectLink}
            quizQuestions={quizQuestions}
          />
        )}
      </main>

      {/* Language Switcher Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        t={t}
      />

      {/* PWA & APK Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        t={t}
        pwaPrompt={deferredPrompt}
        onInstallPwa={handleInstallPwa}
        apkDownloadUrl={apkDownloadUrl}
      />

      {/* Global Embedded Styles for Smooth Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
