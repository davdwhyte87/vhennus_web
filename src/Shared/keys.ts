

// types.ts
export interface GeneratedKeys {
  privateKey: string; // Hex string
  publicKey: string;  // Hex string (compressed)
}
import { ec as EC } from 'elliptic';
// keyGenerator.ts


const ec = new EC('secp256k1');

import { sha256 } from 'js-sha256';



export function getTxId(sender: string, receiver: string, amount: string, timestamp: bigint): string {
  // Convert timestamp to 8-byte big-endian (like Kotlin's ByteBuffer.putLong)
  const timestampBuffer = new ArrayBuffer(8);
  const timestampView = new DataView(timestampBuffer);
  
  // Kotlin uses Long (64-bit signed), but treats it as u64 for hashing
  // We'll use setBigUint64 for unsigned representation
  timestampView.setBigUint64(0, timestamp, false); // false for big-endian
  
  // Get timestamp bytes
  const timestampBytes = new Uint8Array(timestampBuffer);
  
  // Create text encoder for string to UTF-8 bytes
  const encoder = new TextEncoder();
  const senderBytes = encoder.encode(sender);
  const receiverBytes = encoder.encode(receiver);
  const amountBytes = encoder.encode(amount);
  
  // Combine all bytes
  const combinedLength = timestampBytes.length + senderBytes.length + receiverBytes.length + amountBytes.length;
  const combined = new Uint8Array(combinedLength);
  
  let offset = 0;
  combined.set(timestampBytes, offset);
  offset += timestampBytes.length;
  combined.set(senderBytes, offset);
  offset += senderBytes.length;
  combined.set(receiverBytes, offset);
  offset += receiverBytes.length;
  combined.set(amountBytes, offset);
  
  // Calculate SHA-256 hash
  const hashBytes = new Uint8Array(sha256.arrayBuffer(combined));
  
  // Convert to hex string
  return Array.from(hashBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function signTransaction(
  sender: string,
  receiver: string,
  amount: string,
  timestamp: bigint,
  id: string,
  privateKeyHex: string
): string {
  // 1) Build exactly the same transaction string as Kotlin
  // Convert BigInt to string for concatenation (just like Kotlin's Long.toString())
  const txData = `${sender}${receiver}${amount}${timestamp.toString()}${id}`;
  console.log('🔏 tx_data to sign:', txData);
  
  // 2) Convert to UTF-8 bytes and get raw hex
  const encoder = new TextEncoder();
  const raw = encoder.encode(txData);
  console.log('raw hex:', Array.from(raw).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // 3) SHA-256 the raw bytes
  const hashBytes = new Uint8Array(sha256.arrayBuffer(raw));
  
  // 4) Load private key
  const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
  
  // 5) Sign the hash
  const signature = keyPair.sign(hashBytes, {
    canonical: true,
    pers: undefined
  });
  
  // 6) Convert r and s to 32-byte arrays (big-endian)
  function to32Bytes(bigInt: any): Uint8Array {
    const hex = bigInt.toString(16).padStart(64, '0'); // 64 hex chars = 32 bytes
    const bytes = new Uint8Array(32);
    
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    
    return bytes;
  }
  
  const rBytes = to32Bytes(signature.r);
  const sBytes = to32Bytes(signature.s);
  
  // 7) Concatenate r and s and return as hex
  const signatureBytes = new Uint8Array(64);
  signatureBytes.set(rBytes, 0);
  signatureBytes.set(sBytes, 32);
  
  return Array.from(signatureBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function signTransactionAsync(
  sender: string,
  receiver: string,
  amount: string,
  timestamp: bigint,
  id: string,
  privateKeyHex: string
): Promise<string> {
  // 1) Build transaction string
  const txData = `${sender}${receiver}${amount}${timestamp.toString()}${id}`;
  
  // 2) Convert to UTF-8 bytes
  const encoder = new TextEncoder();
  const raw = encoder.encode(txData);
  
  // 3) SHA-256 using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', raw);
  const hashBytes = new Uint8Array(hashBuffer);
  
  // 4) Load private key and sign
  const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
  const signature = keyPair.sign(hashBytes, { canonical: true });
  
  // 5) Get r and s as 32-byte hex strings
  const rHex = signature.r.toString(16).padStart(64, '0');
  const sHex = signature.s.toString(16).padStart(64, '0');
  
  // 6) Concatenate and return
  return rHex + sHex;
}
/**
 * Helper function to verify a signature (for testing)
 */
export function verifySignature(
  sender: string,
  receiver: string,
  amount: string,
  timestamp: number,
  id: string,
  signatureHex: string,
  publicKeyHex: string
): boolean {
  // Build transaction string
  const txData = `${sender}${receiver}${amount}${timestamp}${id}`;
  const encoder = new TextEncoder();
  const raw = encoder.encode(txData);
  
  // SHA-256
  const hash = sha256(raw);
  const hashBytes = new Uint8Array(sha256.arrayBuffer(raw));
  
  // Extract r and s from signature
  const rHex = signatureHex.substring(0, 64);
  const sHex = signatureHex.substring(64, 128);
  
  const r = ec.keyFromPrivate(rHex, 'hex').getPrivate();
  const s = ec.keyFromPrivate(sHex, 'hex').getPrivate();
  
  // Create signature object
  const signature = { r, s };
  
  // Verify with public key
  const keyPair = ec.keyFromPublic(publicKeyHex, 'hex');
  return keyPair.verify(hashBytes, signature);
}


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
  const keyPair = ec.keyFromPrivate(seedHex, 'hex');
  
  // 3. Extract keys in the desired format
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic(true, 'hex'); // 'true' for compressed format
  
  return {
    privateKey,
    publicKey
  };
}