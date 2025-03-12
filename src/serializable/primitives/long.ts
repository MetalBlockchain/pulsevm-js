import { bufferToBigInt, hexToBuffer, padLeft } from '../../utils/buffer';
import { Primitives, serializable } from '../common';

export const LONG_LEN = 8;

@serializable()
export class Long extends Primitives {
  constructor(private readonly bigint: bigint) {
    super();
  }

  static fromBytes(buf: Uint8Array): [Long, Uint8Array] {
    return [
      new Long(bufferToBigInt(buf.slice(0, LONG_LEN))),
      buf.slice(LONG_LEN),
    ];
  }

  toBytes() {
    return padLeft(hexToBuffer(this.bigint.toString(16)), LONG_LEN);
  }

  toJSON() {
    return this.bigint.toString();
  }

  value() {
    return this.bigint;
  }
}
