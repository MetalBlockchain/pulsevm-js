import { serializable } from '../serializable/common';
import { padLeft } from '../utils/buffer';

export const SIG_LEN = 65;

@serializable()
export class Signature {
  constructor(private readonly sig: Uint8Array) {
    if (sig.length !== SIG_LEN) {
      throw new Error('incorrect number of bytes for signature');
    }
  }

  static fromBytes(bytes: Uint8Array): [Signature, Uint8Array] {
    return [new Signature(bytes.slice(0, SIG_LEN)), bytes.slice(SIG_LEN)];
  }

  toBytes() {
    return padLeft(this.sig, SIG_LEN);
  }
}
