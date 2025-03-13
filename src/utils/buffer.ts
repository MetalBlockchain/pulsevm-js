import { bytesToHex, concatBytes, hexToBytes } from '@noble/hashes/utils';
import { add0x, strip0x } from 'micro-eth-signer/utils';
import { sha256 } from '@noble/hashes/sha256';

export function padLeft(bytes: Uint8Array, length: number) {
  const offset = length - bytes.length;

  if (offset <= 0) {
    return bytes;
  }

  const out = new Uint8Array(length);
  out.set(bytes, offset);
  return out;
}

export function hexToBuffer(hex: string) {
  hex = strip0x(hex);
  if (hex.length & 1) {
    hex = '0' + hex;
  }
  return hexToBytes(hex);
}

export function bufferToNumber(buf: Uint8Array) {
  return Number.parseInt(bytesToHex(buf), 16);
}
export function bufferToBigInt(buf: Uint8Array) {
  return BigInt(bufferToHex(buf));
}

export function bufferToHex(buf: Uint8Array) {
  return add0x(bytesToHex(buf));
}

export function addChecksum(data: Uint8Array) {
  return concatBytes(data, sha256(data).subarray(-4));
}