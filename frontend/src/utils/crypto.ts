/**
 * AES-GCM Encryption utilities for client-side journal security.
 * Uses the Web Crypto API.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // bytes
const SALT_LENGTH = 16; // bytes

/**
 * Derives a cryptographic key from a master password and salt.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts content using AES-GCM.
 * Returns a base64 encoded string containing [salt][iv][ciphertext].
 */
export async function encryptContent(content: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv as unknown as BufferSource,
    },
    key,
    enc.encode(content)
  );

  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts content using AES-GCM.
 */
export async function decryptContent(encryptedDataB64: string, password: string): Promise<string> {
  const combined = new Uint8Array(
    atob(encryptedDataB64)
      .split('')
      .map((c) => c.charCodeAt(0))
  );

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv as unknown as BufferSource,
    },
    key,
    ciphertext as unknown as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

/**
 * Gets the vault master key from local storage or prompts user.
 * In a real app, this should be handled securely (e.g., derived from session).
 * For MindVault AI, we'll use a consistent UID-based seed or a stored vault key.
 */
export function getVaultMasterKey(): string {
  let key = localStorage.getItem('mindvault_master_key');
  if (!key) {
    // Fallback/Default for V1 - in reality, user should set this
    key = 'mindvault-default-neural-key-v1';
    localStorage.setItem('mindvault_master_key', key);
  }
  return key;
}
