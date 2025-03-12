import { bufferToNumber, hexToBuffer, padLeft } from '../../utils/buffer';
import { Primitives, serializable } from '../common';

export const INT_LEN = 4;

@serializable()
export class Int extends Primitives {
  constructor(private readonly int: number) {
    super();
  }

  static fromBytes(buf: Uint8Array): [Int, Uint8Array] {
    return [new Int(bufferToNumber(buf.slice(0, INT_LEN))), buf.slice(INT_LEN)];
  }

  toJSON() {
    return this.int;
  }

  toBytes() {
    return padLeft(hexToBuffer(this.int.toString(16)), INT_LEN);
  }

  value() {
    return this.int;
  }
}
