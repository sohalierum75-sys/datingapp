import assert from 'node:assert';
import { hashPassword, verifyPassword, generateVisitorHash, generateToken } from '../src/auth.js';
import { renderLandingPage, renderNotFoundPage, renderAppRedirectPage } from '../src/templates.js';
import { renderAdminApp } from '../src/admin_ui.js';

async function runTests() {
  console.log('--- 1. Testing Web Crypto Auth & Hashing ---');
  const password = 'TestSecretPassword123!';
  const { hash, salt } = await hashPassword(password);
  assert(hash && salt, 'Hash and salt must be generated');
  
  const isValid = await verifyPassword(password, hash, salt);
  assert.strictEqual(isValid, true, 'Valid password verification failed');

  const isInvalid = await verifyPassword('WrongPassword', hash, salt);
  assert.strictEqual(isInvalid, false, 'Invalid password should not verify');

  const token = generateToken(32);
  assert.strictEqual(token.length, 64, 'Token length should be 64 hex chars');

  const visitorHash = await generateVisitorHash('192.168.1.1', 'Mozilla/5.0');
  assert(visitorHash && visitorHash.length === 16, 'Visitor hash should be 16 chars');
  console.log('✓ Web Crypto Auth passed');

  console.log('--- 2. Testing Pre-lander Template (Chrome Intent Mode) ---');
  const testPageA = {
    id: 'page-123',
    subdomain: 'nethmi',
    title: 'Nethmi Official',
    persona_name: 'Nethmi',
    avatar_url: 'https://example.com/avatar.jpg',
    chat_message: 'Hey love! Tap below to chat with me privately.',
    typing_delay_ms: 1500,
    routing_mode: 'chrome_intent',
    routing_target: 'highratecpm.com/code123',
    fallback_url: 'https://highratecpm.com/code123',
    cta_buttons_json: JSON.stringify([
      { label: 'Reply in Private Chat ❤️', color: '#ff4081' }
    ]),
    og_title: 'Nethmi ✨ - Online Now',
    og_description: 'Check out my profile.',
    og_image: 'https://example.com/og.jpg',
    theme_accent: '#ff4081'
  };

  const htmlA = renderLandingPage(testPageA);
  assert(htmlA.includes('Online Now'), 'Should contain Online Now indicator');
  assert(htmlA.includes('Nethmi is typing a message...'), 'Should contain typing text');
  assert(htmlA.includes('intent://'), 'Should contain Chrome Intent logic');
  assert(htmlA.includes('com.android.chrome'), 'Should contain Chrome package name');
  assert(htmlA.includes('property="og:title" content="Nethmi ✨ - Online Now"'), 'Should contain OG title');
  console.log('✓ Chrome Intent Pre-lander passed');

  console.log('--- 2b. Testing Multi-Step Micro-Commitments & Auto-Language Translation ---');
  // 1. Verify UI elements for micro-commitments
  assert(htmlA.includes('id="choice-area"'), 'Should contain micro-commitment YES/NO choice area');
  assert(htmlA.includes('id="btn-yes"'), 'Should contain YES button');
  assert(htmlA.includes('id="btn-no"'), 'Should contain NO button');
  assert(htmlA.includes('id="typing-bubble"'), 'Should contain typing bubble element');
  assert(htmlA.includes('id="bubble-final"'), 'Should contain final message bubble');
  assert(htmlA.includes('id="cta-area"'), 'Should contain CTA area');
  assert(htmlA.includes('1500'), 'Should contain 1.5s typing delay');
  assert(htmlA.includes('navigator.vibrate'), 'Should contain navigator.vibrate API call');
  assert(htmlA.includes('navigator.vibrate([200, 100, 200])'), 'Should contain [200, 100, 200] double buzz vibration pattern');

  // 2. Test Spanish (ES) translation
  const htmlES = renderLandingPage(testPageA, 'ES');
  assert(htmlES.includes('¿Tienes más de 18 años?'), 'ES should have translated question');
  assert(htmlES.includes('SÍ'), 'ES should have translated YES');
  assert(htmlES.includes('Chat Privado'), 'ES should have translated CTA');
  assert(htmlES.includes('¡Genial! Estoy buscando un chat privado.'), 'ES should have translated final message');

  // 3. Test Hindi / India (IN) translation
  const htmlIN = renderLandingPage(testPageA, 'IN');
  assert(htmlIN.includes('क्या आप 18 वर्ष से अधिक के हैं?'), 'IN should have translated Hindi question');
  assert(htmlIN.includes('हाँ'), 'IN should have translated Hindi YES');
  assert(htmlIN.includes('प्राइवेट चैट'), 'IN should have translated Hindi CTA');

  // 4. Test Sinhala / Sri Lanka (LK) translation
  const htmlLK = renderLandingPage(testPageA, 'LK');
  assert(htmlLK.includes('ඔබ වයස අවුරුදු 18ට වැඩිද?'), 'LK should have translated Sinhala question');
  assert(htmlLK.includes('ඔව්'), 'LK should have translated Sinhala YES');
  assert(htmlLK.includes('ප්‍රයිවෙට් චැට්'), 'LK should have translated Sinhala CTA');

  // 5. Test Portuguese / Brazil (BR) translation
  const htmlBR = renderLandingPage(testPageA, 'BR');
  assert(htmlBR.includes('Você tem mais de 18 anos?'), 'BR should have translated Portuguese question');
  assert(htmlBR.includes('SIM'), 'BR should have translated Portuguese YES');

  // 6. Test French (FR) translation
  const htmlFR = renderLandingPage(testPageA, 'FR');
  assert(htmlFR.includes('Avez-vous plus de 18 ans ?'), 'FR should have translated French question');
  assert(htmlFR.includes('OUI'), 'FR should have translated French YES');
  assert(htmlFR.includes('Chat Privé'), 'FR should have translated French CTA');

  // 7. Test German (DE) translation
  const htmlDE = renderLandingPage(testPageA, 'DE');
  assert(htmlDE.includes('Bist du über 18 Jahre alt?'), 'DE should have translated German question');
  assert(htmlDE.includes('JA'), 'DE should have translated German YES');
  assert(htmlDE.includes('Privater Chat'), 'DE should have translated German CTA');

  // 8. Test Unknown / Fallback (Default English)
  const htmlFallback = renderLandingPage(testPageA, 'ZZ');
  assert(htmlFallback.includes('Are you over 18?'), 'Fallback should default to English question');
  assert(htmlFallback.includes('YES'), 'Fallback should default to English YES');
  assert(htmlFallback.includes('Private Chat'), 'Fallback should default to English CTA');
  console.log('✓ Multi-Step Micro-Commitments & Auto-Language Translations (US, ES, IN, LK, BR, FR, DE, fallback) passed');

  console.log('--- 3. Testing Pre-lander Template (App Deep Link Mode) ---');
  const testPageB = {
    ...testPageA,
    subdomain: 'sophia',
    persona_name: 'Sophia',
    routing_mode: 'app_deep_link',
    routing_target: 'sophia_ai',
    fallback_url: 'https://x.com/sophia_ai'
  };

  const htmlB = renderLandingPage(testPageB);
  assert(htmlB.includes('intent://user?screen_name='), 'Should contain Android Intent for X/Twitter');
  assert(htmlB.includes('package=com.twitter.android'), 'Should contain twitter android package');
  assert(htmlB.includes('twitter://user?screen_name='), 'Should contain twitter deep link scheme for iOS');
  assert(htmlB.includes('https://x.com/sophia_ai'), 'Should contain web fallback URL');
  assert(htmlB.includes('1500'), 'Should contain 1500ms fallback timeout');
  console.log('✓ App Deep Link Pre-lander passed');

  console.log('--- 3b. Testing AppRouter Instant Auto-Redirect Minimal Page ---');
  const redirectPageNoAd = {
    id: 'page-redirect-1',
    subdomain: 'apptest',
    routing_mode: 'AppRouter',
    routing_target: 'my_brand',
    fallback_url: 'https://x.com/my_brand'
  };
  const htmlRedirectNoAd = renderAppRedirectPage(redirectPageNoAd);
  assert(htmlRedirectNoAd.includes('<div class="loader"></div>'), 'Should contain loader spinner');
  assert(htmlRedirectNoAd.includes('var adUrl = "";'), 'adUrl should be empty string when not provided');
  assert(htmlRedirectNoAd.includes('var intentUrl = "intent://user?screen_name=" + targetUser'), 'Should contain Android Intent with targetUser');
  assert(htmlRedirectNoAd.includes('window.location.href = intentUrl;'), 'Android should assign href');
  assert(htmlRedirectNoAd.includes('com.twitter.android'), 'Should contain Twitter Android package name');
  assert(htmlRedirectNoAd.includes('"twitter://user?screen_name=" + targetUser'), 'Should contain iOS URI scheme');
  assert(htmlRedirectNoAd.includes('window.location.href = "twitter://user?screen_name=" + targetUser;'), 'iOS should assign href');
  assert(htmlRedirectNoAd.includes('https://x.com/my_brand'), 'Should contain webUrl fallback');
  assert(htmlRedirectNoAd.includes('/android/i.test(navigator.userAgent)'), 'Should test for Android OS');
  assert(htmlRedirectNoAd.includes('/ipad|iphone|ipod/i.test(navigator.userAgent)'), 'Should test for iOS');
  assert(htmlRedirectNoAd.includes('1500'), 'Should contain 1500ms fallback when no adUrl');
  assert(!htmlRedirectNoAd.includes('chat-card'), 'Must NOT render chat pre-lander UI in AppRouter mode');

  // Test with dynamic Background Ad URL
  const redirectPageWithAd = {
    id: 'page-redirect-2',
    subdomain: 'apptest2',
    routing_mode: 'AppRouter',
    routing_target: 'my_brand',
    fallback_url: 'https://x.com/my_brand',
    ad_url: 'https://www.adsterra-direct-link.com/code999'
  };
  const htmlRedirectWithAd = renderAppRedirectPage(redirectPageWithAd);
  assert(htmlRedirectWithAd.includes('var adUrl = "https://www.adsterra-direct-link.com/code999";'), 'Dynamic adUrl must be injected into template');
  assert(htmlRedirectWithAd.includes('setTimeout(function() { window.location.replace(adUrl); }, 600);'), 'Must contain 600ms adUrl redirect timeout');
  console.log('✓ AppRouter Instant Auto-Redirect (with and without Background Ad URL) passed');

  console.log('--- 4. Testing Ad Injection & Independent Toggles ---');
  // Default pages must NEVER contain hardcoded Adsterra ad links
  const defaultPageHtml = renderLandingPage(testPageA);
  assert(!defaultPageHtml.includes('https://ahuramazda.org'), 'Default landing page must NEVER contain hardcoded Adsterra popunder ad link');
  assert(!defaultPageHtml.includes('https://brijmohan.org'), 'Default landing page must NEVER contain hardcoded Adsterra social bar ad link');

  // Explicit custom scripts when configured
  const pageWithAds = {
    ...testPageA,
    ad_popunder_enabled: 1,
    ad_socialbar_enabled: 1,
    ad_popunder_code: 'https://custom-ads.example.com/pop.js',
    ad_socialbar_code: 'https://custom-ads.example.com/bar.js',
    monetag_direct_link: 'https://otieuwai.net/4/test_monetag_page_a',
    cta_buttons_json: JSON.stringify([
      { label: 'Chat With Me (Monetag) ❤️', color: '#e91e63', use_monetag: true },
      { label: 'Standard Deep Link 📸', color: '#9c27b0', use_monetag: false }
    ])
  };
  const htmlAds = renderLandingPage(pageWithAds);
  assert(htmlAds.includes('<script data-cfasync="false" src="https://custom-ads.example.com/pop.js"></script>'), 'Popunder script must be present with data-cfasync="false"');
  assert(htmlAds.includes('<script data-cfasync="false" src="https://custom-ads.example.com/bar.js"></script>'), 'Social Bar script must be present with data-cfasync="false"');
  assert(htmlAds.indexOf('https://custom-ads.example.com/pop.js') < htmlAds.indexOf('</body>'), 'Popunder must be before closing body tag');
  assert(htmlAds.indexOf('https://custom-ads.example.com/bar.js') < htmlAds.indexOf('</body>'), 'Social Bar must be before closing body tag');

  // Verify Monetag Direct Link script generation
  assert(htmlAds.includes('window.open(dest, \'_blank\', \'noopener,noreferrer\')'), 'Monetag button must open in new tab via window.open');
  assert(htmlAds.includes('https://otieuwai.net/4/test_monetag_page_a'), 'Page Monetag Direct Link must be injected');

  // Test independent Monetag link per page
  const pageWithDiffMonetag = {
    ...testPageA,
    monetag_direct_link: 'https://otieuwai.net/4/different_campaign_link',
    cta_buttons_json: JSON.stringify([
      { label: 'Different Page Monetag', color: '#10b981', use_monetag: true }
    ])
  };
  const htmlDiffMonetag = renderLandingPage(pageWithDiffMonetag);
  assert(htmlDiffMonetag.includes('https://otieuwai.net/4/different_campaign_link'), 'Different page must support different Monetag link');
  assert(!htmlDiffMonetag.includes('test_monetag_page_a'), 'Page must only use its own configured Monetag link');

  // Popunder disabled, Social Bar enabled
  const pageSocialOnly = {
    ...testPageA,
    ad_popunder_enabled: 0,
    ad_socialbar_enabled: 1,
    ad_socialbar_code: 'https://custom-ads.example.com/bar.js'
  };
  const htmlSocialOnly = renderLandingPage(pageSocialOnly);
  assert(!htmlSocialOnly.includes('https://custom-ads.example.com/pop.js'), 'Popunder must NOT be present when disabled');
  assert(htmlSocialOnly.includes('https://custom-ads.example.com/bar.js'), 'Social Bar MUST be present when enabled');

  // Popunder enabled, Social Bar disabled
  const pagePopOnly = {
    ...testPageA,
    ad_popunder_enabled: 1,
    ad_socialbar_enabled: 0,
    ad_popunder_code: 'https://custom-ads.example.com/pop.js'
  };
  const htmlPopOnly = renderLandingPage(pagePopOnly);
  assert(htmlPopOnly.includes('https://custom-ads.example.com/pop.js'), 'Popunder MUST be present when enabled');
  assert(!htmlPopOnly.includes('https://custom-ads.example.com/bar.js'), 'Social Bar must NOT be present when disabled');

  // Both disabled
  const pageNoAds = {
    ...testPageA,
    ad_popunder_enabled: 0,
    ad_socialbar_enabled: 0
  };
  const htmlNoAds = renderLandingPage(pageNoAds);
  assert(!htmlNoAds.includes('https://ahuramazda.org'), 'No popunder when both disabled');
  assert(!htmlNoAds.includes('https://brijmohan.org'), 'No social bar when both disabled');
  console.log('✓ Ad Injection & Independent Toggles (without Adsterra adlinks) passed');

  // Test dynamic raw script injection for ad_popunder and ad_socialbar
  const pageWithRawScripts = {
    ...testPageA,
    ad_popunder: '<script data-cfasync="false" src="https://myadnetwork.com/popunder123.js"></script>',
    ad_socialbar: '<script type="text/javascript">console.log("socialbar");</script>'
  };
  const htmlRaw = renderLandingPage(pageWithRawScripts);
  assert(htmlRaw.includes('<script data-cfasync="false" src="https://myadnetwork.com/popunder123.js"></script>'), 'Dynamic raw popunder script must be injected');
  assert(htmlRaw.includes('<script type="text/javascript">console.log("socialbar");</script>'), 'Dynamic raw social bar script must be injected');
  assert(htmlRaw.indexOf('popunder123.js') < htmlRaw.indexOf('</body>'), 'Raw popunder script must be right before closing body tag');
  assert(htmlRaw.indexOf('console.log("socialbar")') < htmlRaw.indexOf('</body>'), 'Raw social bar script must be right before closing body tag');
  console.log('✓ Dynamic raw Adsterra Popunder and Social Bar script injection passed');

  console.log('--- 5. Testing Admin UI ---');
  const adminHtml = renderAdminApp('mydomain.com');
  assert(adminHtml.includes('Landing Page Builder'), 'Admin HTML should include title');
  assert(adminHtml.includes('*.mydomain.com'), 'Admin HTML should format root domain');
  assert(adminHtml.includes('Adsterra Popunder Script (Optional)'), 'Admin UI must contain Adsterra Popunder Script textarea label');
  assert(adminHtml.includes('Adsterra Social Bar Script (Optional)'), 'Admin UI must contain Adsterra Social Bar Script textarea label');
  assert(adminHtml.includes('Background Ad URL (Direct Link)'), 'Admin HTML should include Background Ad URL field');
  assert(adminHtml.includes('id="p-ad-url"'), 'Admin HTML should include p-ad-url input id');
  assert(adminHtml.includes('App Download URL (APK Link)'), 'Admin UI should include App Download URL field');
  assert(adminHtml.includes('id="p-apk-url"'), 'Admin UI should include p-apk-url input');
  assert(adminHtml.includes('id="p-app-download-enabled"'), 'Admin UI should include p-app-download-enabled checkbox');
  // Ensure Admin UI and 404 pages never contain ad scripts
  assert(!adminHtml.includes('https://ahuramazda.org'), 'Admin UI must NEVER have popunder ad');
  assert(!adminHtml.includes('https://brijmohan.org'), 'Admin UI must NEVER have social bar ad');
  const notFoundHtml = renderNotFoundPage('test');
  assert(!notFoundHtml.includes('https://ahuramazda.org'), '404 page must not have ads');
  assert(!notFoundHtml.includes('https://brijmohan.org'), '404 page must not have ads');
  console.log('✓ Admin UI passed');

  console.log('--- 6. Testing Always-Visible App Download UI, Smart Single-Button Modal & Multi-Language ---');
  // 1. Single-button modal with clean subtitle badge and inline toast
  const appTestDefaultHtml = renderLandingPage(testPageA);
  assert(appTestDefaultHtml.includes('class="top-sticky-bar"'), 'Should contain top sticky header bar');
  assert(appTestDefaultHtml.includes('class="top-download-btn"'), 'Should contain top download button');
  assert(appTestDefaultHtml.includes('id="app-download-card"'), 'Should contain dedicated app download card');
  assert(appTestDefaultHtml.includes('id="download-modal"'), 'Should contain smart download modal');
  assert(appTestDefaultHtml.includes('Official Web App • Instant Install'), 'Should contain clean subtitle badge');
  assert(appTestDefaultHtml.includes('id="modal-download-btn"'), 'Should contain single primary download button');
  assert(appTestDefaultHtml.includes('modal-btn-green'), 'Should style single button as primary green CTA');
  assert(appTestDefaultHtml.includes('id="modal-install-toast"'), 'Should contain clean inline toast for Add to Home Screen hint');
  // Ensure broken/extra elements are removed:
  assert(!appTestDefaultHtml.includes('id="modal-apk-btn"'), 'APK download button should be completely removed from modal');
  assert(!appTestDefaultHtml.includes('v2.4 • Verified Safe APK'), 'v2.4 APK subtitle should be removed');
  assert(!appTestDefaultHtml.includes('id="ios-guidance-box"'), 'Bottom iPhone/iPad instruction box should be removed');

  // 2. Multi-language App Download labels
  const esAppHtml = renderLandingPage(testPageA, 'ES');
  assert(esAppHtml.includes('Descargar App 📲'), 'ES should have translated Download App button');
  assert(esAppHtml.includes('Obtén la App Oficial 🔥'), 'ES should have translated App Promo Title');

  const inAppHtml = renderLandingPage(testPageA, 'IN');
  assert(inAppHtml.includes('ऐप डाउनलोड करें 📲'), 'IN should have translated Hindi Download App button');
  assert(inAppHtml.includes('ऑफिशियल ऐप प्राप्त करें 🔥'), 'IN should have translated Hindi App Promo Title');

  const lkAppHtml = renderLandingPage(testPageA, 'LK');
  assert(lkAppHtml.includes('ඇප් එක ඩවුන්ලෝඩ් කරන්න 📲'), 'LK should have translated Sinhala Download App button');

  // 3. Toggle disabled state
  const disabledAppPage = {
    ...testPageA,
    app_download_enabled: 0
  };
  const disabledAppHtml = renderLandingPage(disabledAppPage);
  assert(!disabledAppHtml.includes('class="top-sticky-bar"'), 'Should NOT contain top sticky bar when disabled');
  assert(!disabledAppHtml.includes('id="app-download-card"'), 'Should NOT contain app download card when disabled');
  assert(!disabledAppHtml.includes('id="download-modal"'), 'Should NOT contain download modal when disabled');
  console.log('✓ Always-Visible App Download UI, Smart Single-Button Modal & Multi-Language passed');

  console.log('====================================');
  console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ✅');
  console.log('====================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

