import { concatBytes } from '@noble/hashes/utils';
import { serializable } from '../serializable/common';
import { Id } from '../serializable/id';
import { pack, unpack } from '../utils/packer';
import { Action } from './action';

@serializable()
export class UnsignedTransaction {
  constructor(
    public readonly blockchainID: Id,
    public readonly actions: Array<Action>,
  ) {}

  static fromBytes(bytes: Uint8Array): [UnsignedTransaction, Uint8Array] {
    const [blockchainID, actions, rest] = unpack(bytes, [Id, Array<Action>]);
    return [new UnsignedTransaction(blockchainID, actions), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(pack([this.blockchainID, this.actions]));
  }
}
