
// --- 1. CONFIGURATION & HELPERS ---
const DB_NAME = 'CRYPTO_STORE';
const DB_VERSION = 1;
const STORE_NAME = 'keys';

// Wrap the db operations in a promise
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Utility: Convert String to ArrayBuffer
const enc = new TextEncoder();
const dec = new TextDecoder();

// Generate keys from a passphrase and salt
async function generateAsymmetricKeys(passphrase, salt) {
  // a. Derive a password-based key from passphrase/salt using PBKDF2
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits", "deriveKey"]
  );

  const derivationKey = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false, // Derived key not extractable
    ["encrypt", "decrypt"]
  );

  // b. Generate RSA Key Pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // Private key exportable so we can wrap it
    ["encrypt", "decrypt"]
  );

  // c. Wrap (encrypt) the private key with our derived password key
  const wrappedPrivateKey = await window.crypto.subtle.wrapKey(
    "pkcs8", keyPair.privateKey, derivationKey, { name: "AES-GCM", iv: salt.slice(0, 12) }
  );

  return {
    publicKey: keyPair.publicKey,
    wrappedPrivateKey: wrappedPrivateKey
  };
}

// Store the keys in indexed DB
async function saveKeysToDB(wrappedKey, publicKey, salt) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(wrappedKey, 'privateKey');
  tx.objectStore(STORE_NAME).put(publicKey, 'publicKey');
  tx.objectStore(STORE_NAME).put(salt, 'salt');
  await tx.done;
  console.log("Keys saved to IndexedDB");
}

// Encryptions of text with public key
async function encryptText(text, publicKey) {
  const encoded = enc.encode(text);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encoded
  );
  return ciphertext; // Returns ArrayBuffer
}

// Decryption of Text with private key
async function decryptText(ciphertext, privateKey) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    ciphertext
  );
  return dec.decode(decrypted);
}

// to laod keys from the indexed DB
async function load_keys_from_db()
{
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const storedPrivate = await store.get('privateKey');
  const storedSalt = await store.get('salt');

  // 5. Unwrap (decrypt) private key using same password/salt
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits", "deriveKey"]
  );
  const derivationKey = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: storedSalt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["unwrapKey"]
  );

  const unwrappedPrivateKey = await window.crypto.subtle.unwrapKey(
    "pkcs8", storedPrivate, derivationKey, { name: "AES-GCM", iv: storedSalt.slice(0, 12) },
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );


}

// --- 5. COMPLETE FLOW EXAMPLE ---
async function runExample() {
  const passphrase = "correct-horse-battery-staple";
  const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Random salt
  const secretText = "Hello World: Secure Data";

  // 1. Generate keys
  const { publicKey, wrappedPrivateKey } = await generateAsymmetricKeys(passphrase, salt);

  // 2. Save keys
  await saveKeysToDB(wrappedPrivateKey, publicKey, salt);

  // 3. Encrypt data with public key
  const encrypted = await encryptText(secretText, publicKey);
  console.log("Encrypted (Buffer):", encrypted);

  // 4. Load keys and salt back from IndexedDB (Simulating new session)
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const storedPrivate = await store.get('privateKey');
  const storedSalt = await store.get('salt');

  // 5. Unwrap (decrypt) private key using same password/salt
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits", "deriveKey"]
  );
  const derivationKey = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: storedSalt, iterations: 250000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["unwrapKey"]
  );

  const unwrappedPrivateKey = await window.crypto.subtle.unwrapKey(
    "pkcs8", storedPrivate, derivationKey, { name: "AES-GCM", iv: storedSalt.slice(0, 12) },
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );

  // 6. Decrypt data
  const decryptedText = await decryptText(encrypted, unwrappedPrivateKey);
  console.log("Decrypted Message:", decryptedText);
}

