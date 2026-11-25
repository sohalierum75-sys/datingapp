/**
 * Facebook & Instagram In-App Browser (IAB) Escape Utility
 * Breaks out of in-app webviews on Android to open external Google Chrome,
 * ensuring high conversion rates and preventing blocked links/popups.
 */

export function isAndroid(userAgent = null) {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  return /android/i.test(ua);
}

export function isIos(userAgent = null) {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  return /ipad|iphone|ipod/i.test(ua);
}

export function isInAppBrowser(userAgent = null) {
  const ua = (userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '').toLowerCase();
  return (
    ua.includes('fban') ||
    ua.includes('fbav') ||
    ua.includes('instagram') ||
    ua.includes('fb_iab') ||
    ua.includes('threads')
  );
}

/**
 * Triggers an external direct link with automatic Android Chrome Intent breakout
 * @param {string} rawUrl - The destination ad / sponsor / direct link
 * @param {Object} [options]
 * @param {boolean} [options.openInNewTab=true]
 */
export function openExternalUrl(rawUrl, options = { openInNewTab: true }) {
  if (!rawUrl || typeof window === 'undefined') return;

  const url = rawUrl.trim();
  if (!url) return;

  // Clean protocol for intent
  const cleanTarget = url.replace(/^https?:\/\//i, '');

  if (isAndroid() && isInAppBrowser()) {
    // Android Intent breaking out of Facebook / Instagram In-App Browser to Google Chrome
    const intentUrl = `intent://${cleanTarget}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    return;
  }

  // Standard browser or iOS: open in new tab
  if (options.openInNewTab) {
    const dest = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const win = window.open(dest, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = dest;
    }
  } else {
    window.location.href = url.startsWith('http') ? url : `https://${url}`;
  }
}
