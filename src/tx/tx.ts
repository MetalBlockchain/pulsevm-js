import { concatBytes } from '@noble/hashes/utils';
import { serializable } from '../serializable/common';
import { Bytes } from '../serializable/primitives/bytes';
import { UnsignedTransaction } from './unsignedTx';
import { pack, packList, unpack } from '../utils/packer';
import { sign } from '../utils/crypto';
import { Signature } from './signature';

@serializable()
export class Transaction {
  constructor(
    public readonly unsigned: UnsignedTransaction,
    public readonly signatures: Array<Signature>,
  ) {}

  static fromBytes(bytes: Uint8Array): [Transaction, Uint8Array] {
    const [unsigned, signatures, rest] = unpack(bytes, [
      UnsignedTransaction,
      Array<Bytes>,
    ]);
    return [new Transaction(unsigned, signatures), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(
        pack([this.unsigned, this.signatures]),
    );
  }

  async sign(privKey: Uint8Array<ArrayBufferLike>) {
    const signature = await sign(this.unsigned.toBytes(), privKey);
    this.signatures.push(new Signature(signature));
  }
}
