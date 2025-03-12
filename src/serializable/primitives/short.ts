import { bufferToNumber, hexToBuffer, padLeft } from '../../utils/buffer';
import { Primitives, serializable } from '../common';

export const SHORT_LEN = 2;

@serializable()
export class Short extends Primitives {
  constructor(private readonly short: number) {
    super();
  }

  static fromBytes(buf: Uint8Array): [Short, Uint8Array] {
    return [
      new Short(bufferToNumber(buf.slice(0, SHORT_LEN))),
      buf.slice(SHORT_LEN),
    ];
  }

  toJSON() {
    return this.short.toString();
  }

  toBytes() {
    return padLeft(hexToBuffer(this.short.toString(16)), SHORT_LEN);
  }

  value() {
    return this.short;
  }
}
