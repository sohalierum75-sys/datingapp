import InteractiveApp from './InteractiveApp.jsx';
import Header from './components/Header.jsx';
import TabBar from './components/TabBar.jsx';
import ChatTab from './components/ChatTab.jsx';
import QuizTab from './components/QuizTab.jsx';
import LanguageModal from './components/LanguageModal.jsx';
import DownloadModal from './components/DownloadModal.jsx';
import { detectLanguage, getTranslation, SUPPORTED_LANGUAGES, QUIZ_QUESTIONS } from './i18n/translations.js';
import { openExternalUrl, isInAppBrowser, isAndroid, isIos } from './utils/iabEscape.js';
import { buildSystemPrompt, sendChatMessage } from './services/aiService.js';

export default InteractiveApp;

export {
  InteractiveApp,
  Header,
  TabBar,
  ChatTab,
  QuizTab,
  LanguageModal,
  DownloadModal,
  detectLanguage,
  getTranslation,
  SUPPORTED_LANGUAGES,
  QUIZ_QUESTIONS,
  openExternalUrl,
  isInAppBrowser,
  isAndroid,
  isIos,
  buildSystemPrompt,
  sendChatMessage
};
