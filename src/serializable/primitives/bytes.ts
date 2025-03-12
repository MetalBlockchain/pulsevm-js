import { concatBytes } from '@noble/hashes/utils';
import { bytesForInt } from '../../utils/packer';
import { Int } from './int';
import { bufferToHex } from '../../utils/buffer';
import { bytesToString } from '@scure/base';
import { Primitives, serializable } from '../common';

@serializable()
export class Bytes extends Primitives {
  constructor(public readonly bytes: Uint8Array) {
    super();
  }

  toString(encoding: 'utf8' | 'hex' = 'utf8') {
    return bytesToString(encoding, this.bytes);
  }

  toJSON() {
    return bufferToHex(this.bytes);
  }

  static fromBytes(buf: Uint8Array): [Bytes, Uint8Array] {
    const [len, remaining] = Int.fromBytes(buf);

    return [
      new Bytes(remaining.slice(0, len.value())),
      remaining.slice(len.value()),
    ];
  }

  toBytes() {
    return concatBytes(bytesForInt(this.bytes.length), this.bytes);
  }

  get length() {
    return this.bytes.length;
  }
}
