/**
 * Authentication module using native Web Crypto API
 * Safe, zero-dependency, works directly in Cloudflare Workers
 */

export async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const salt = saltHex ? hexToBuf(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    true,
    ['sign']
  );

  const rawKey = await crypto.subtle.exportKey('raw', derivedKey);
  return {
    hash: bufToHex(rawKey),
    salt: bufToHex(salt)
  };
}

export async function verifyPassword(password, storedHash, storedSalt) {
  const result = await hashPassword(password, storedSalt);
  return result.hash === storedHash;
}

export function generateToken(length = 32) {
  const buffer = crypto.getRandomValues(new Uint8Array(length));
  return bufToHex(buffer);
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Anonymize IP + User-Agent for unique daily visitor tracking
 */
export async function generateVisitorHash(ip, userAgent) {
  const today = new Date().toISOString().slice(0, 10);
  const data = `${ip || 'unknown'}-${userAgent || 'unknown'}-${today}`;
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(data));
  return bufToHex(digest).slice(0, 16);
}

