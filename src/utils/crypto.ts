import { sha256 } from '@noble/hashes/sha256';
import { concatBytes } from '@noble/hashes/utils';
import * as secp from '@noble/secp256k1';
import { base58check } from './base58';

export function sign(msg: Uint8Array | string, privKey: Uint8Array) {
  return signHash(sha256(msg), privKey);
}

export async function signHash(hash: Uint8Array, privKey: Uint8Array) {
  const sig = await secp.signAsync(hash, privKey);

  if (sig.recovery !== undefined) {
    return concatBytes(sig.toCompactRawBytes(), new Uint8Array([sig.recovery]));
  } else {
    throw new Error(`Recovery bit is missing.`);
  }
}

export function parsePrivateKey(key: string): Uint8Array<ArrayBufferLike> {
  const privKey = base58check.decode(key);
  if (!secp.utils.isValidPrivateKey(privKey)) {
    throw new Error('Failed parsing private key');
  }
  return privKey;
}

export function generatePrivateKey(): Uint8Array<ArrayBufferLike> {
  return secp.utils.randomPrivateKey();
}
