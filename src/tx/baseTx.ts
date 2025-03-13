import { concatBytes } from '@noble/hashes/utils';
import { serializable } from '../serializable/common';
import { Id } from '../serializable/id';
import { pack, unpack } from '../utils/packer';
import { Action } from './action';
import { Short } from '../serializable';

@serializable()
export class BaseTransaction {
  constructor(
    public readonly blockchainID: Id,
    public readonly actions: Array<Action>,
  ) {}

  static fromBytes(bytes: Uint8Array): [BaseTransaction, Uint8Array] {
    const [blockchainID, actions, rest] = unpack(bytes, [Id, Array<Action>]);
    return [new BaseTransaction(blockchainID, actions), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(pack([this.blockchainID, this.actions]));
  }

  getType() {
    return new Short(0); // Base transaction ID
  }
}
