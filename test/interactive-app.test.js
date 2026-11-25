import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  detectLanguage,
  getTranslation,
  SUPPORTED_LANGUAGES,
  QUIZ_QUESTIONS
} from '../src/interactive-app/i18n/translations.js';
import {
  isInAppBrowser,
  isAndroid,
  isIos
} from '../src/interactive-app/utils/iabEscape.js';
import {
  buildSystemPrompt,
  sendChatMessage
} from '../src/interactive-app/services/aiService.js';

async function testInteractiveAppModule() {
  console.log('--- 1. Testing Translations & i18n ---');
  assert(SUPPORTED_LANGUAGES.length >= 10, 'Should support at least 10 languages');
  const requiredLangCodes = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ar', 'hi', 'si', 'ru'];
  
  for (const code of requiredLangCodes) {
    const t = getTranslation(code);
    assert(t, `Translation for ${code} must exist`);
    assert(t.online, `Translation ${code} should have 'online'`);
    assert(t.tabChat, `Translation ${code} should have 'tabChat'`);
    assert(t.tabQuiz, `Translation ${code} should have 'tabQuiz'`);
    assert(t.downloadApp, `Translation ${code} should have 'downloadApp'`);
    assert(t.unlockPhotoBtn, `Translation ${code} should have 'unlockPhotoBtn'`);
    assert(t.chatLockedTitle, `Translation ${code} should have 'chatLockedTitle'`);
    assert(QUIZ_QUESTIONS[code] && QUIZ_QUESTIONS[code].length >= 3, `Quiz questions for ${code} must have at least 3 questions`);
  }
  console.log('✓ All 10 languages and quiz questions validated');

  console.log('--- 2. Testing In-App Browser (IAB) Escape Utils ---');
  const fbUserAgent = 'Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SD1A.210817.036; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/345.0.0.34.116;]';
  const igUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B74 Instagram 215.0.0.21.119';
  const desktopChrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  assert.strictEqual(isInAppBrowser(fbUserAgent), true, 'Should detect Facebook in-app browser');
  assert.strictEqual(isInAppBrowser(igUserAgent), true, 'Should detect Instagram in-app browser');
  assert.strictEqual(isInAppBrowser(desktopChrome), false, 'Regular Chrome is not IAB');

  assert.strictEqual(isAndroid(fbUserAgent), true, 'Should detect Android user agent');
  assert.strictEqual(isAndroid(igUserAgent), false, 'iOS should not be detected as Android');
  assert.strictEqual(isIos(igUserAgent), true, 'Should detect iOS user agent');
  console.log('✓ IAB detection and escape utils validated');

  console.log('--- 3. Testing AI Companion Prompt & Fallbacks ---');
  const persona = {
    name: 'Chloe',
    age: 23,
    distance: '3 miles',
    dailyScenario: 'Getting ready for a weekend trip!'
  };

  const promptEn = buildSystemPrompt(persona, 'en');
  assert(promptEn.includes('Chloe'), 'System prompt should contain persona name');
  assert(promptEn.includes('23'), 'System prompt should contain persona age');
  assert(promptEn.includes('en'), 'System prompt should contain language code');

  // Test companion fallback without API keys
  const replyEn = await sendChatMessage({
    message: 'Hello!',
    history: [],
    persona,
    lang: 'en'
  });
  assert(typeof replyEn === 'string' && replyEn.length > 0, 'Companion should return valid English fallback string');

  const replyEs = await sendChatMessage({
    message: '¡Hola!',
    history: [],
    persona,
    lang: 'es'
  });
  assert(typeof replyEs === 'string' && replyEs.length > 0, 'Companion should return valid Spanish fallback string');

  const replySi = await sendChatMessage({
    message: 'හායි',
    history: [],
    persona,
    lang: 'si'
  });
  assert(typeof replySi === 'string' && replySi.length > 0, 'Companion should return valid Sinhala fallback string');
  console.log('✓ AI companion prompt generation and multi-language fallbacks validated');

  console.log('--- 4. Validating React Component Files Integrity ---');
  const componentFiles = [
    'src/interactive-app/InteractiveApp.jsx',
    'src/interactive-app/index.js',
    'src/interactive-app/components/Header.jsx',
    'src/interactive-app/components/TabBar.jsx',
    'src/interactive-app/components/ChatTab.jsx',
    'src/interactive-app/components/QuizTab.jsx',
    'src/interactive-app/components/LanguageModal.jsx',
    'src/interactive-app/components/DownloadModal.jsx'
  ];

  for (const relPath of componentFiles) {
    const fullPath = path.resolve(relPath);
    assert(fs.existsSync(fullPath), `File must exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.length > 50, `File content should not be empty: ${relPath}`);
    assert(content.includes('export default'), `Component file must export default: ${relPath}`);
  }
  console.log('✓ All 8 React component source files verified and intact');

  console.log('\n🎉 ALL INTERACTIVE APP TESTS PASSED SUCCESSFULLY! 🎉');
}

testInteractiveAppModule().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
