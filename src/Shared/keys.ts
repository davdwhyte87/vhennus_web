

// types.ts
export interface GeneratedKeys {
  privateKey: string; // Hex string
  publicKey: string;  // Hex string (compressed)
}

// keyGenerator.ts
import { ec } from 'elliptic';

const EC = new ec('secp256k1');

/**
 * Generates ECDSA keys from a seed phrase.
 * @param seedPhrase - The input seed phrase string.
 * @returns A promise resolving to the private and public keys (hex strings).
 */
export async function generateKeysFromString(seedPhrase: string): Promise<GeneratedKeys> {
  // 1. Hash the seed phrase (using Web Crypto API - SHA-256)
  const encoder = new TextEncoder();
  const seedData = encoder.encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest('SHA-256', seedData);
  
  // Convert hash to hex string (this becomes the private key seed)
  const seedHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // 2. Generate keys from the seed using elliptic library
  const keyPair = EC.keyFromPrivate(seedHex, 'hex');
  
  // 3. Extract keys in the desired format
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic(true, 'hex'); // 'true' for compressed format
  
  return {
    privateKey,
    publicKey
  };
}