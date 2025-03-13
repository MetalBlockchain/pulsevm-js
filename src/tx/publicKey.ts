import { privateKeyToPublicKey } from '../utils';
import { serializable } from '../serializable/common';
import { padLeft } from '../utils/buffer';

export const PUBLIC_KEY_LEN = 33;

@serializable()
export class PublicKey {
  constructor(private readonly publicKey: Uint8Array) {
    if (publicKey.length !== PUBLIC_KEY_LEN) {
      throw new Error('incorrect number of bytes for public key');
    }
  }

  static fromBytes(bytes: Uint8Array): [PublicKey, Uint8Array] {
    return [new PublicKey(bytes.slice(0, PUBLIC_KEY_LEN)), bytes.slice(PUBLIC_KEY_LEN)];
  }

  toBytes() {
    return padLeft(this.publicKey, PUBLIC_KEY_LEN);
  }

  static fromPrivateKey(privateKey: Uint8Array): PublicKey {
    return new PublicKey(privateKeyToPublicKey(privateKey));
  }
}
