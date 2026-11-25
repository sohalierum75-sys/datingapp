/**
 * Interactive Pre-lander Templates and Dynamic SEO Generator
 */

/**
 * Multi-Language Auto-Translation Dictionary
 * Covers major traffic regions with fallback to US (English)
 */
export const TRANSLATIONS = {
  US: {
    question: "Are you over 18?",
    yes: "YES",
    no: "NO",
    typing: "is typing a message...",
    message: "Great! I'm looking for a private chat. Click below 👇",
    cta: "Private Chat",
    status: "Online Now",
    notice: "Sorry, you must be 18+ to enter.",
    downloadApp: "Download App 📲",
    appPromoTitle: "Get the Official App 🔥",
    appPromoDesc: "Faster private chat, exclusive HD photos & instant notifications.",
    downloadApkBtn: "Download Android App (.APK) ⬇️",
    installPwaBtn: "Install Web App (1-Click) ⚡",
    iosHint: "iPhone / iPad: Tap Share at bottom of Safari & select 'Add to Home Screen'",
    fbHint: "Facebook / Instagram: Tap ⋮ in top right and choose 'Open in Chrome / Browser' to download."
  },
  ES: {
    question: "¿Tienes más de 18 años?",
    yes: "SÍ",
    no: "NO",
    typing: "está escribiendo un mensaje...",
    message: "¡Genial! Estoy buscando un chat privado. Haz clic abajo 👇",
    cta: "Chat Privado",
    status: "En línea",
    notice: "Lo sentimos, debes ser mayor de 18 años para entrar.",
    downloadApp: "Descargar App 📲",
    appPromoTitle: "Obtén la App Oficial 🔥",
    appPromoDesc: "Chat privado más rápido, fotos HD exclusivas y notificaciones al instante.",
    downloadApkBtn: "Descargar App Android (.APK) ⬇️",
    installPwaBtn: "Instalar App Web (1-Clic) ⚡",
    iosHint: "iPhone / iPad: Toca Compartir en Safari y selecciona 'Agregar a inicio'",
    fbHint: "Facebook / Instagram: Toca ⋮ arriba a la derecha y selecciona 'Abrir en Chrome / Navegador'."
  },
  IN: {
    question: "क्या आप 18 वर्ष से अधिक के हैं?",
    yes: "हाँ",
    no: "नहीं",
    typing: "टाइप कर रहे हैं...",
    message: "बहुत बढ़िया! मैं एक प्राइवेट चैट ढूंढ रही हूँ। नीचे क्लिक करें 👇",
    cta: "प्राइवेट चैट",
    status: "अभी ऑनलाइन",
    notice: "क्षमा करें, आपकी आयु 18+ होनी चाहिए।",
    downloadApp: "ऐप डाउनलोड करें 📲",
    appPromoTitle: "ऑफिशियल ऐप प्राप्त करें 🔥",
    appPromoDesc: "तेज प्राइवेट चैट, एक्सक्लूसिव एचडी फोटो और तुरंत नोटिफिकेशन।",
    downloadApkBtn: "एंड्रॉइड ऐप डाउनलोड करें (.APK) ⬇️",
    installPwaBtn: "वेब ऐप इंस्टॉल करें (1-क्लिक) ⚡",
    iosHint: "iPhone / iPad: Safari में शेयर पर टैप करें और 'Add to Home Screen' चुनें",
    fbHint: "फेसबुक / इंस्टाग्राम: ऊपर दाईं ओर ⋮ पर टैप करें और 'Open in Chrome' चुनें।"
  },
  LK: {
    question: "ඔබ වයස අවුරුදු 18ට වැඩිද?",
    yes: "ඔව්",
    no: "නැත",
    typing: "ටයිප් කරමින්...",
    message: "නියමයි! මම ප්‍රයිවෙට් චැට් එකක් හොයනවා. පහත ක්ලික් කරන්න 👇",
    cta: "ප්‍රයිවෙට් චැට්",
    status: "දැන් ඔන්ලයින්",
    notice: "සමාවෙන්න, ඔබට අවුරුදු 18 සම්පූර්ණ විය යුතුය.",
    downloadApp: "ඇප් එක ඩවුන්ලෝඩ් කරන්න 📲",
    appPromoTitle: "නිල ඇප් එක ලබාගන්න 🔥",
    appPromoDesc: "වේගවත් ප්‍රයිවෙට් චැට්, විශේෂ HD ඡායාරූප සහ ක්ෂණික දැනුම්දීම්.",
    downloadApkBtn: "Android App (.APK) ඩවුන්ලෝඩ් කරන්න ⬇️",
    installPwaBtn: "වෙබ් ඇප් එක ස්ථාපනය කරන්න (1-Click) ⚡",
    iosHint: "iPhone / iPad: Safari හි Share ඔබා 'Add to Home Screen' තෝරන්න",
    fbHint: "Facebook / Instagram: ඉහළ දකුණේ ⋮ ඔබා 'Open in Chrome' තෝරන්න."
  },
  BR: {
    question: "Você tem mais de 18 anos?",
    yes: "SIM",
    no: "NÃO",
    typing: "está digitando uma mensagem...",
    message: "Ótimo! Estou procurando um chat privado. Clique abaixo 👇",
    cta: "Chat Privado",
    status: "Online agora",
    notice: "Desculpe, você deve ter mais de 18 anos para entrar.",
    downloadApp: "Baixar Aplicativo 📲",
    appPromoTitle: "Baixe o App Oficial 🔥",
    appPromoDesc: "Chat privado mais rápido, fotos HD exclusivas e notificações instantâneas.",
    downloadApkBtn: "Baixar App Android (.APK) ⬇️",
    installPwaBtn: "Instalar Web App (1-Clique) ⚡",
    iosHint: "iPhone / iPad: Toque em Compartilhar no Safari e selecione 'Adicionar à Tela de Início'",
    fbHint: "Facebook / Instagram: Toque em ⋮ no topo direito e selecione 'Abrir no Chrome'."
  },
  FR: {
    question: "Avez-vous plus de 18 ans ?",
    yes: "OUI",
    no: "NON",
    typing: "est en train d'écrire...",
    message: "Super ! Je cherche un chat privé. Cliquez ci-dessous 👇",
    cta: "Chat Privé",
    status: "En ligne",
    notice: "Désolé, vous devez avoir plus de 18 ans pour entrer.",
    downloadApp: "Télécharger l'app 📲",
    appPromoTitle: "Obtenez l'application officielle 🔥",
    appPromoDesc: "Chat privé plus rapide, photos HD exclusives et notifications instantanées.",
    downloadApkBtn: "Télécharger l'app Android (.APK) ⬇️",
    installPwaBtn: "Installer l'app Web (1-Clic) ⚡",
    iosHint: "iPhone / iPad : Appuyez sur Partager dans Safari et 'Sur l'écran d'accueil'",
    fbHint: "Facebook / Instagram : Appuyez sur ⋮ en haut à droite et 'Ouvrir dans Chrome'."
  },
  DE: {
    question: "Bist du über 18 Jahre alt?",
    yes: "JA",
    no: "NEIN",
    typing: "schreibt eine Nachricht...",
    message: "Super! Ich suche nach einem privaten Chat. Klicke unten 👇",
    cta: "Privater Chat",
    status: "Jetzt online",
    notice: "Entschuldigung, du musst mindestens 18 Jahre alt sein.",
    downloadApp: "App herunterladen 📲",
    appPromoTitle: "Offizielle App holen 🔥",
    appPromoDesc: "Schnellerer privater Chat, exklusive HD-Fotos & Sofortbenachrichtigungen.",
    downloadApkBtn: "Android App (.APK) herunterladen ⬇️",
    installPwaBtn: "Web App installieren (1-Klick) ⚡",
    iosHint: "iPhone / iPad: Auf Teilen tippen und 'Zum Home-Bildschirm' wählen",
    fbHint: "Facebook / Instagram Browser: Oben rechts auf ⋮ tippen und 'In Chrome öffnen' wählen."
  },
  IT: {
    question: "Hai più di 18 anni?",
    yes: "SÌ",
    no: "NO",
    typing: "sta scrivendo un messaggio...",
    message: "Ottimo! Sto cercando una chat privata. Clicca sotto 👇",
    cta: "Chat Privata",
    status: "Online adesso",
    notice: "Spiacenti, devi avere almeno 18 anni per entrare.",
    downloadApp: "Scarica l'app 📲",
    appPromoTitle: "Ottieni l'app ufficiale 🔥",
    appPromoDesc: "Chat privata più veloce, foto HD esclusive e notifiche istantanee.",
    downloadApkBtn: "Scarica app Android (.APK) ⬇️",
    installPwaBtn: "Installa Web App (1-Click) ⚡",
    iosHint: "iPhone / iPad: Tocca Condividi in Safari e seleziona 'Aggiungi a Home'",
    fbHint: "Facebook / Instagram: Tocca ⋮ in alto a destra e seleziona 'Apri in Chrome'."
  }
};

export function renderLandingPage(page, options = {}) {
  const countryCode = (typeof options === 'string' ? options : (options.countryCode || 'US')).toUpperCase();
  const ctaButtons = parseButtons(page.cta_buttons_json);
  const themeColor = page.theme_accent || '#e91e63';
  const persona = page.persona_name || 'Nethmi';
  const initialTrans = TRANSLATIONS[countryCode] || TRANSLATIONS['US'];
  const appDownloadEnabled = page.app_download_enabled !== undefined ? (Number(page.app_download_enabled) ? 1 : 0) : 1;
  const apkUrl = page.apk_download_url && page.apk_download_url.trim() ? page.apk_download_url.trim() : '/app.apk';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(page.og_title || page.title || persona)}</title>
  
  <!-- Dynamic Open Graph & Social SEO -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(page.og_title || persona)}">
  <meta property="og:description" content="${escapeHtml(page.og_description || 'Check out my profile and connect with me.')}">
  <meta property="og:image" content="${escapeHtml(page.og_image || page.avatar_url)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.og_title || persona)}">
  <meta name="twitter:description" content="${escapeHtml(page.og_description || '')}">
  <meta name="twitter:image" content="${escapeHtml(page.og_image || page.avatar_url)}">
  <meta name="theme-color" content="${escapeHtml(themeColor)}">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background: radial-gradient(circle at 50% 10%, #171b26 0%, #0a0d14 100%);
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      padding-top: ${appDownloadEnabled ? '68px' : '16px'};
      overflow-x: hidden;
    }

    /* Top Sticky App Download Bar */
    .top-sticky-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      background: rgba(15, 18, 26, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 999;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .top-bar-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid ${themeColor};
      flex-shrink: 0;
    }
    .top-bar-name {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top-download-btn {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #ffffff;
      border: none;
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
      transition: transform 0.15s ease, filter 0.15s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .top-download-btn:active {
      transform: scale(0.96);
      filter: brightness(1.1);
    }

    /* Dedicated App Download Card below chat */
    .app-download-card {
      width: 100%;
      max-width: 430px;
      margin-top: 16px;
      background: rgba(22, 27, 38, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-radius: 24px;
      padding: 18px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .app-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .app-badge-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 8px;
      border-radius: 6px;
    }
    .app-verified-tag {
      font-size: 11px;
      color: #22c55e;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .app-card-main {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .app-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, ${themeColor} 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      flex-shrink: 0;
      box-shadow: 0 6px 18px ${themeColor}44;
    }
    .app-card-info {
      flex: 1;
      min-width: 0;
    }
    .app-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 3px;
    }
    .app-card-desc {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .app-download-action-btn {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: 16px;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
      transition: transform 0.15s ease, filter 0.15s ease;
      text-decoration: none;
    }
    .app-download-action-btn:active {
      transform: scale(0.98);
      filter: brightness(1.1);
    }

    /* Smart Download Modal */
    .download-modal-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: modalFadeIn 0.25s ease-out forwards;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .download-modal-box {
      width: 100%;
      max-width: 420px;
      background: #141824;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 26px;
      padding: 24px 20px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 30px ${themeColor}22;
      position: relative;
      animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes modalSlideUp {
      from { transform: translateY(20px) scale(0.96); }
      to { transform: translateY(0) scale(1); }
    }
    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .modal-app-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .modal-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${themeColor};
    }
    .modal-app-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
    }
    .modal-app-tag {
      font-size: 11px;
      color: #10b981;
      font-weight: 600;
    }
    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #94a3b8;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .modal-close:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
    }
    .modal-desc {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.45;
      margin-bottom: 20px;
    }
    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 4px;
    }
    .modal-btn-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      padding: 16px 20px;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: transform 0.15s ease, filter 0.15s ease;
      width: 100%;
    }
    .modal-btn-green:active {
      transform: scale(0.98);
      filter: brightness(1.1);
    }
    .modal-action-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 16px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      width: 100%;
    }
    .modal-btn-apk {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
    }
    .modal-btn-apk:active {
      transform: scale(0.98);
      filter: brightness(1.1);
    }
    .modal-btn-pwa {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #ffffff;
    }
    .modal-btn-pwa:active {
      background: rgba(255, 255, 255, 0.14);
    }
    .btn-left {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
    }
    .btn-icon-large {
      font-size: 24px;
    }
    .btn-titles {
      display: flex;
      flex-direction: column;
    }
    .btn-title-main {
      font-size: 14px;
      font-weight: 700;
    }
    .btn-subtitle {
      font-size: 11px;
      opacity: 0.8;
    }
    .guidance-section {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .guidance-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .chat-card {
      width: 100%;
      max-width: 430px;
      background: rgba(22, 27, 38, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-radius: 28px;
      padding: 24px 20px 20px 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${themeColor}1a;
      position: relative;
      overflow: hidden;
    }
    .profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
    }
    .avatar-wrapper {
      position: relative;
      width: 96px;
      height: 96px;
      margin-bottom: 12px;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid ${themeColor};
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    }
    .online-badge {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      background-color: #22c55e;
      border-radius: 50%;
      border: 3px solid #161b26;
    }
    .online-badge::after {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #22c55e;
      animation: pulse 1.8s infinite ease-out;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.9; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .persona-name {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .verified-icon {
      color: #38bdf8;
      width: 18px;
      height: 18px;
      display: inline-block;
      flex-shrink: 0;
    }
    .status-container {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 4px;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
    }
    .status-text {
      font-size: 13px;
      color: #22c55e;
      font-weight: 500;
    }

    /* Chat Messages Thread */
    .chat-thread {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 18px;
    }
    .bubble {
      max-width: 88%;
      padding: 14px 18px;
      font-size: 15px;
      line-height: 1.45;
      position: relative;
      animation: slideIn 0.35s ease-out forwards;
    }
    .bubble-incoming {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 20px 20px 20px 6px;
      color: #f8fafc;
    }
    .bubble-outgoing {
      align-self: flex-end;
      background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
      border-radius: 20px 20px 6px 20px;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 122, 255, 0.35);
    }
    .bubble-time {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 3px;
    }
    .bubble-outgoing .bubble-time {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Typing Indicator Bubble */
    .typing-bubble {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 20px 20px 20px 6px;
      padding: 12px 16px;
      display: none;
      align-items: center;
      gap: 8px;
      width: fit-content;
      animation: slideIn 0.3s ease-out forwards;
    }
    .typing-dots {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .dot {
      width: 6px;
      height: 6px;
      background-color: #cbd5e1;
      border-radius: 50%;
      animation: appleBounce 1.4s infinite ease-in-out both;
    }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes appleBounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1.15); opacity: 1; }
    }
    .typing-text {
      font-size: 13px;
      color: #94a3b8;
      font-style: italic;
    }

    /* Micro-commitments YES/NO Section */
    .micro-commitments {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      transition: all 0.35s ease;
    }
    .btn-yes {
      flex: 1.3;
      padding: 14px 20px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      border: none;
      color: #ffffff;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .btn-yes:active {
      transform: scale(0.96);
      filter: brightness(1.1);
    }
    .btn-no {
      flex: 1;
      padding: 14px 20px;
      border-radius: 16px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-no:active {
      transform: scale(0.96);
      background: rgba(255, 255, 255, 0.1);
    }
    .shake-anim {
      animation: shake 0.45s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
    .notice-18 {
      font-size: 12px;
      color: #f43f5e;
      text-align: center;
      margin-top: 8px;
      display: none;
    }

    /* Final CTA Area */
    .cta-container {
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      margin-top: 10px;
    }
    .cta-container.show {
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 1;
      transform: translateY(0);
    }
    .cta-btn {
      width: 100%;
      padding: 18px 22px;
      border-radius: 18px;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.2px;
      cursor: pointer;
      border: none;
      color: #ffffff;
      background: linear-gradient(135deg, ${themeColor} 0%, #a855f7 100%);
      box-shadow: 0 10px 30px ${themeColor}55;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      animation: pulseGlow 2.5s infinite;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .cta-btn:active {
      transform: scale(0.98);
      filter: brightness(1.1);
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 10px 30px ${themeColor}55; }
      50% { box-shadow: 0 14px 40px ${themeColor}88, 0 0 20px ${themeColor}44; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .footer-note {
      text-align: center;
      font-size: 11px;
      color: #64748b;
      margin-top: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  </style>
</head>
<body>
${appDownloadEnabled ? `
  <!-- Top Sticky App Download Bar (Always Visible) -->
  <header class="top-sticky-bar">
    <div class="top-bar-left">
      <img src="${escapeHtml(page.avatar_url)}" class="top-bar-avatar" alt="${escapeHtml(persona)}">
      <span class="top-bar-name">${escapeHtml(persona)} Official</span>
    </div>
    <button type="button" class="top-download-btn" onclick="handleDownloadTrigger()">
      <span>📲</span>
      <span id="top-download-label">${escapeHtml(initialTrans.downloadApp || 'Download App 📲')}</span>
    </button>
  </header>
` : ''}
  <div class="chat-card">
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img class="avatar-img" src="${escapeHtml(page.avatar_url)}" alt="${escapeHtml(persona)}">
        <div class="online-badge"></div>
      </div>
      <div class="persona-name">
        ${escapeHtml(persona)}
        <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div class="status-container">
        <div class="status-dot"></div>
        <div class="status-text" id="status-label">${escapeHtml(initialTrans.status)}</div>
      </div>
    </div>

    <!-- Chat Messages Flow -->
    <div class="chat-thread" id="chat-thread">
      <!-- Step 1: Initial Question Bubble -->
      <div class="bubble bubble-incoming" id="bubble-question">
        <span id="question-text">${escapeHtml(initialTrans.question)}</span>
        <div class="bubble-time">Just now</div>
      </div>

      <!-- Step 1 Actions: YES/NO Micro-commitments -->
      <div class="micro-commitments" id="choice-area">
        <button type="button" class="btn-yes" id="btn-yes" onclick="handleYesClick()">
          <span id="yes-label">${escapeHtml(initialTrans.yes)}</span>
          <span style="font-size: 14px;">✓</span>
        </button>
        <button type="button" class="btn-no" id="btn-no" onclick="handleNoClick()">
          <span id="no-label">${escapeHtml(initialTrans.no)}</span>
        </button>
      </div>
      <div class="notice-18" id="notice-18">${escapeHtml(initialTrans.notice)}</div>

      <!-- Step 2: Typing Bubble (Shown after YES click for 1.5s) -->
      <div class="typing-bubble" id="typing-bubble">
        <div class="typing-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <span class="typing-text" id="typing-label">${escapeHtml(persona)} ${escapeHtml(initialTrans.typing)}</span>
      </div>

      <!-- Step 3: Final Message Bubble (Appears after 1.5s) -->
      <div class="bubble bubble-incoming" id="bubble-final" style="display: none;">
        <span id="final-message-text">${escapeHtml(initialTrans.message)}</span>
        <div class="bubble-time">Just now</div>
      </div>
    </div>

    <!-- Step 4: Final CTA Container -->
    <div class="cta-container" id="cta-area">
      <button 
        class="cta-btn" 
        id="main-cta-btn"
        onclick="handleCtaClick(currentTranslation.cta, 0)"
      >
        <span>💬</span>
        <span id="cta-label">${escapeHtml(initialTrans.cta)}</span>
        <span>👉</span>
      </button>
    </div>

    <div class="footer-note">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
      <span>End-to-end encrypted</span>
    </div>
  </div>

${appDownloadEnabled ? `
  <!-- Dedicated App Download Card (Always Visible) -->
  <div class="app-download-card" id="app-download-card">
    <div class="app-card-top">
      <span class="app-badge-tag">⚡ OFFICIAL MOBILE APP</span>
      <span class="app-verified-tag">✓ 100% Free & Safe</span>
    </div>
    <div class="app-card-main">
      <div class="app-icon-box">📱</div>
      <div class="app-card-info">
        <div class="app-card-title" id="app-promo-title">${escapeHtml(initialTrans.appPromoTitle)}</div>
        <div class="app-card-desc" id="app-promo-desc">${escapeHtml(initialTrans.appPromoDesc)}</div>
      </div>
    </div>
    <button type="button" class="app-download-action-btn" onclick="handleDownloadTrigger()">
      <span>📲</span>
      <span id="app-card-download-label">${escapeHtml(initialTrans.downloadApp || 'Download App 📲')}</span>
      <span>⬇️</span>
    </button>
  </div>

  <!-- Smart Download Modal -->
  <div id="download-modal" class="download-modal-backdrop" onclick="handleModalBackdropClick(event)">
    <div class="download-modal-box">
      <div class="modal-head">
        <div class="modal-app-brand">
          <img src="${escapeHtml(page.avatar_url)}" class="modal-avatar" alt="${escapeHtml(persona)}">
          <div>
            <div class="modal-app-title">${escapeHtml(persona)} Mobile App</div>
            <div class="modal-app-tag">⚡ Official Web App • Instant Install</div>
          </div>
        </div>
        <button type="button" class="modal-close" onclick="closeDownloadModal()">✕</button>
      </div>

      <p class="modal-desc" id="modal-desc-text">
        ${escapeHtml(initialTrans.appPromoDesc)}
      </p>

      <div class="modal-actions">
        <!-- ONLY ONE Primary Green Download Button -->
        <button type="button" id="modal-download-btn" class="modal-action-btn modal-btn-green" onclick="handleMainDownloadClick()">
          <span>📲</span>
          <span id="modal-download-label">${escapeHtml(initialTrans.downloadApp || 'Download App 📲')}</span>
          <span>⚡</span>
        </button>
      </div>

      <!-- Clean Inline Toast / Hint right under the button -->
      <div id="modal-install-toast" style="display:none; margin-top: 12px; padding: 12px 14px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; font-size: 12px; color: #38bdf8; text-align: center; line-height: 1.45;">
        💡 <span id="modal-toast-hint">${escapeHtml(initialTrans.iosHint || "Tap browser menu (Share / ⋮) and select 'Add to Home Screen'")}</span>
      </div>
    </div>
  </div>
` : ''}

  <script>
    // 1. Multi-Language Auto-Translation Dictionary
    var TRANSLATIONS = ${JSON.stringify(TRANSLATIONS)};

    // 2. Resolve Visitor Country & Language
    var params = new URLSearchParams(window.location.search);
    var detectedCountry = (params.get('country') || '${countryCode || 'US'}').toUpperCase();
    var currentTranslation = TRANSLATIONS[detectedCountry] || TRANSLATIONS['US'];

    // Dynamically apply translations to ensure client-side synchronization
    try {
      document.getElementById('question-text').textContent = currentTranslation.question;
      document.getElementById('yes-label').textContent = currentTranslation.yes;
      document.getElementById('no-label').textContent = currentTranslation.no;
      document.getElementById('status-label').textContent = currentTranslation.status;
      document.getElementById('typing-label').textContent = '${escapeJs(persona)} ' + currentTranslation.typing;
      document.getElementById('final-message-text').textContent = currentTranslation.message;
      document.getElementById('cta-label').textContent = currentTranslation.cta;
      document.getElementById('notice-18').textContent = currentTranslation.notice;
      
      if (document.getElementById('top-download-label')) document.getElementById('top-download-label').textContent = currentTranslation.downloadApp;
      if (document.getElementById('app-promo-title')) document.getElementById('app-promo-title').textContent = currentTranslation.appPromoTitle;
      if (document.getElementById('app-promo-desc')) document.getElementById('app-promo-desc').textContent = currentTranslation.appPromoDesc;
      if (document.getElementById('app-card-download-label')) document.getElementById('app-card-download-label').textContent = currentTranslation.downloadApp;
      if (document.getElementById('modal-desc-text')) document.getElementById('modal-desc-text').textContent = currentTranslation.appPromoDesc;
      if (document.getElementById('modal-download-label')) document.getElementById('modal-download-label').textContent = currentTranslation.downloadApp;
      if (document.getElementById('modal-toast-hint')) document.getElementById('modal-toast-hint').textContent = currentTranslation.iosHint;
    } catch(e) {}

    // 3. Multi-Step Micro-Commitment Interaction Flow
    var isAnswered = false;

    function handleNoClick() {
      var choiceEl = document.getElementById('choice-area');
      var noticeEl = document.getElementById('notice-18');
      if (choiceEl) {
        choiceEl.classList.remove('shake-anim');
        void choiceEl.offsetWidth; // trigger reflow
        choiceEl.classList.add('shake-anim');
      }
      if (noticeEl) {
        noticeEl.style.display = 'block';
      }
    }

    function handleYesClick() {
      if (isAnswered) return;
      isAnswered = true;

      var choiceArea = document.getElementById('choice-area');
      var noticeArea = document.getElementById('notice-18');
      var chatThread = document.getElementById('chat-thread');
      var typingBubble = document.getElementById('typing-bubble');
      var bubbleFinal = document.getElementById('bubble-final');
      var ctaArea = document.getElementById('cta-area');

      if (noticeArea) noticeArea.style.display = 'none';

      // Smoothly hide YES/NO buttons
      if (choiceArea) {
        choiceArea.style.opacity = '0';
        choiceArea.style.transform = 'translateY(-6px)';
        setTimeout(function() {
          choiceArea.style.display = 'none';
        }, 250);
      }

      // Show visitor's outgoing response bubble (YES ✓)
      var userBubble = document.createElement('div');
      userBubble.className = 'bubble bubble-outgoing';
      userBubble.innerHTML = '<span>' + currentTranslation.yes + ' ✓</span><div class="bubble-time">Just now</div>';
      chatThread.insertBefore(userBubble, typingBubble);

      // Show iMessage-style typing indicator bubble for 1.5 seconds
      typingBubble.style.display = 'inline-flex';

      setTimeout(function() {
        typingBubble.style.display = 'none';
        bubbleFinal.style.display = 'block';

        // Check if the browser supports vibration
        if (navigator.vibrate) {
          // Vibrate for 200ms, pause for 100ms, vibrate for 200ms (Double Buzz)
          navigator.vibrate([200, 100, 200]);
        }

        // Smoothly fade in final CTA button
        setTimeout(function() {
          ctaArea.classList.add('show');
        }, 150);
      }, 1500);
    }

    // 4. Built-in Analytics tracking on page load
    (function recordView() {
      var payload = {
        pageId: '${page.id || ''}',
        subdomain: '${escapeJs(page.subdomain || '')}',
        eventType: 'page_view',
        referrer: document.referrer || 'direct',
        platform: detectPlatform()
      };
      sendAnalytics(payload);
    })();

    // 5. Platform Detection
    function detectPlatform() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.includes('android')) {
        if (ua.includes('fban') || ua.includes('fbav') || ua.includes('instagram')) {
          return 'android_fb';
        }
        return 'android';
      }
      if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        if (ua.includes('fban') || ua.includes('fbav') || ua.includes('instagram')) {
          return 'ios_fb';
        }
        return 'ios';
      }
      return 'desktop';
    }

    function sendAnalytics(data) {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/track', JSON.stringify(data));
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true
          });
        }
      } catch (e) {}
    }

    // 6. Advanced Smart Traffic Routing Engine & Monetag Direct Link
    var ctaButtonsData = ${JSON.stringify(ctaButtons)};
    var pageMonetagLink = ${JSON.stringify(page.monetag_direct_link || '')};

    function handleCtaClick(label, btnIndex) {
      // Record click event in analytics
      sendAnalytics({
        pageId: '${page.id || ''}',
        subdomain: '${escapeJs(page.subdomain || '')}',
        eventType: 'cta_click',
        ctaLabel: label || currentTranslation.cta,
        referrer: document.referrer || 'direct',
        platform: detectPlatform()
      });

      var btnConfig = ctaButtonsData[btnIndex || 0] || {};
      var isMonetag = btnConfig.use_monetag === true || btnConfig.use_monetag === 'true' || btnConfig.use_monetag === 1;
      var monetagUrl = (btnConfig.monetag_url || pageMonetagLink || '').trim();

      /* 
       * MONETAG DIRECT LINK INTEGRATION:
       * When configured for Monetag, open in a new browser tab
       * and keep the original landing page open in the current tab.
       */
      if (isMonetag && monetagUrl) {
        var dest = monetagUrl.startsWith('http') ? monetagUrl : ('https://' + monetagUrl);
        window.open(dest, '_blank', 'noopener,noreferrer');
        return;
      }

      var mode = '${page.routing_mode || 'direct'}';
      var target = '${escapeJs(page.routing_target || '')}';
      var fallback = '${escapeJs(page.fallback_url || '')}';
      var ua = navigator.userAgent.toLowerCase();

      /* 
       * OPTION A: Chrome Intent Mode
       * Gracefully escapes mobile in-app webviews (FB/IG) on Android to Google Chrome
       */
      if (mode === 'chrome_intent') {
        var isEmbedded = ua.includes('android') && (ua.includes('fban') || ua.includes('fbav') || ua.includes('instagram'));
        var cleanTarget = target.replace(/^https?:\\/\\//, '');
        if (isEmbedded) {
          window.location.href = "intent://" + cleanTarget + "#Intent;scheme=https;package=com.android.chrome;end";
        } else {
          window.location.replace("https://" + cleanTarget);
        }
        return;
      }

      /* 
       * OPTION B: App Deep Link Mode (e.g. Twitter / X)
       * Uses smart OS deep linking: Android Intent for Android, twitter:// for iOS, webUrl for desktop
       */
      if (mode === 'app_deep_link' || mode === 'AppRouter') {
        var targetUser = target.replace(/^@/, '');
        var webUrl = fallback || ("https://x.com/" + encodeURIComponent(targetUser));
        var isAndroid = /android/i.test(navigator.userAgent);
        var isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);

        if (isAndroid) {
          var intentUrl = "intent://user?screen_name=" + targetUser + "#Intent;scheme=twitter;package=com.twitter.android;end;";
          window.location.replace(intentUrl);
        } else if (isIOS) {
          window.location.replace("twitter://user?screen_name=" + targetUser);
        } else {
          window.location.replace(webUrl);
        }

        setTimeout(function() {
          window.location.replace(webUrl);
        }, 1500);
        return;
      }

      /* 
       * OPTION C: Standard Direct Link Mode
       */
      var destUrl = target.startsWith('http') ? target : ('https://' + target);
      window.location.href = destUrl;
    }

    // 7. Smart App Download Action & Modal Handlers
    var deferredPwaPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      deferredPwaPrompt = e;
    });

    var apkDirectUrl = '${escapeJs(apkUrl)}' || '/app.apk';
    var apkFallbackUrl = 'https://companion-live.pages.dev/app.apk';

    // 8. Real-time Live Stats & Anonymous Client Tracking
    function getOrCreateClientId() {
      try {
        var cid = localStorage.getItem('cs_client_id');
        if (!cid) {
          cid = 'c_web_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
          localStorage.setItem('cs_client_id', cid);
        }
        return cid;
      } catch(e) {
        return 'c_web_' + Math.random().toString(36).substring(2, 10);
      }
    }

    var currentClientId = getOrCreateClientId();

    function trackRealtimeEvent(eventType) {
      try {
        var data = JSON.stringify({
          type: eventType,
          source: 'web',
          clientId: currentClientId,
          pageSlug: '${escapeJs(page.subdomain || '')}'
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track', new Blob([data], { type: 'application/json' }));
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true
          }).catch(function() {});
        }
      } catch(e) {}
    }

    // Automatically record visit on page load
    trackRealtimeEvent('visit');

    // Send heartbeat every 60 seconds to maintain 2-minute live online status
    setInterval(function() {
      trackRealtimeEvent('heartbeat');
    }, 60000);

    function triggerApkDownload() {
      trackRealtimeEvent('download');
      try {
        window.location.assign(apkDirectUrl);
      } catch (e) {
        window.location.href = apkFallbackUrl;
      }
    }

    function handleDownloadTrigger() {
      triggerApkDownload();
      openDownloadModal();
    }

    function openDownloadModal() {
      var modal = document.getElementById('download-modal');
      var toast = document.getElementById('modal-install-toast');
      if (toast) toast.style.display = 'none';
      if (modal) modal.style.display = 'flex';
    }

    function closeDownloadModal() {
      var modal = document.getElementById('download-modal');
      var toast = document.getElementById('modal-install-toast');
      if (toast) toast.style.display = 'none';
      if (modal) modal.style.display = 'none';
    }

    function handleModalBackdropClick(e) {
      if (e && e.target && e.target.id === 'download-modal') {
        closeDownloadModal();
      }
    }

    function handleMainDownloadClick() {
      triggerApkDownload();
      if (deferredPwaPrompt) {
        try {
          deferredPwaPrompt.prompt();
          deferredPwaPrompt.userChoice.then(function(choice) {
            if (choice && choice.outcome === 'accepted') {
              closeDownloadModal();
            }
          });
        } catch (e) {}
      } else {
        var toast = document.getElementById('modal-install-toast');
        if (toast) {
          toast.style.display = 'block';
        }
      }
    }
  </script>
  ${renderAdScriptTag(page.ad_socialbar || page.ad_socialbar_code)}
  ${renderAdScriptTag(page.ad_popunder || page.ad_popunder_code)}
</body>
</html>`;
}

function renderAdScriptTag(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('<') || trimmed.includes('<script')) {
    return trimmed;
  }
  return `<script data-cfasync="false" src="${escapeHtml(trimmed)}"></script>`;
}

/**
 * Safely generate ad scripts (only if explicitly configured)
 * Preserves data-cfasync="false" and prevents unauthorized or default ad injection
 */
function generateAdScripts(page) {
  let scripts = [];
  const popunderEnabled = page.ad_popunder_enabled !== 0 && page.ad_popunder_enabled !== '0' && page.ad_popunder_enabled !== false;
  const socialbarEnabled = page.ad_socialbar_enabled !== 0 && page.ad_socialbar_enabled !== '0' && page.ad_socialbar_enabled !== false;

  const popunderSrc = (page.ad_popunder_code || '').trim();
  if (popunderEnabled && popunderSrc) {
    scripts.push(`  <!-- Popunder -->\n  <script data-cfasync="false" src="${escapeHtml(popunderSrc)}"></script>`);
  }

  const socialbarSrc = (page.ad_socialbar_code || '').trim();
  if (socialbarEnabled && socialbarSrc) {
    scripts.push(`  <!-- Social Bar -->\n  <script data-cfasync="false" src="${escapeHtml(socialbarSrc)}"></script>`);
  }

  return scripts.length > 0 ? ('\n' + scripts.join('\n') + '\n') : '';
}

export function renderNotFoundPage(subdomain) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <style>
    body {
      background: #0d0c15;
      color: #fff;
      font-family: -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #1b1a2b;
      padding: 40px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 400px;
    }
    h1 { font-size: 24px; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Page Offline</h1>
    <p>The landing page for <strong>${escapeHtml(subdomain || '')}</strong> is currently not published or does not exist.</p>
  </div>
</body>
</html>`;
}

/**
 * Minimal fast loader template for External App Router mode (Zero-Click Auto-Redirect)
 * Utilizes OS-level deep linking and Android Intents (OpenInApp style)
 */
export function renderAppRedirectPage(page) {
  const rawTarget = (page.routing_target || '').trim();
  const username = rawTarget.replace(/^@/, '');

  // Fallback web URL
  const webUrl = page.fallback_url?.trim() 
    ? page.fallback_url.trim() 
    : (username ? `https://x.com/${encodeURIComponent(username)}` : 'https://x.com');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
  <style>
    body { background: #0f0f0f; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .loader { border: 4px solid #333; border-top: 4px solid #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader"></div>
  <script>
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          pageId: '${page.id || ''}',
          subdomain: '${escapeJs(page.subdomain || '')}',
          eventType: 'page_view',
          referrer: document.referrer || 'direct'
        }));
      }
    } catch(e) {}

    var targetUser = "${escapeJs(username)}";
    var webUrl = "${escapeJs(webUrl)}";
    var adUrl = "${escapeJs(page.ad_url || '')}";
    var isAndroid = /android/i.test(navigator.userAgent);
    var isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Professional OpenInApp-style Android Intent for X/Twitter
      // This forcefully breaks out of the Facebook In-App Browser
      var intentUrl = "intent://user?screen_name=" + targetUser + "#Intent;scheme=twitter;package=com.twitter.android;end;";
      window.location.href = intentUrl;
      if (adUrl) {
        setTimeout(function() { window.location.replace(adUrl); }, 600);
      }
    } else if (isIOS) {
      // iOS URI Scheme
      window.location.href = "twitter://user?screen_name=" + targetUser;
      if (adUrl) {
        setTimeout(function() { window.location.replace(adUrl); }, 600);
      }
    } else {
      // Desktop
      window.location.replace(webUrl);
    }

    if (!adUrl) {
      // Fallback to web URL if no Ad URL is provided and app fails to open
      setTimeout(function() { 
        window.location.replace(webUrl); 
      }, 1500);
    }
  </script>
</body>
</html>`;
}

function parseButtons(jsonStr) {
  try {
    const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {}
  return [
    { label: 'Reply in Private Chat ❤️', color: '#e91e63' },
    { label: 'View Private Photos 📸', color: '#9c27b0' }
  ];
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

