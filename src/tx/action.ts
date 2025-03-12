import { concatBytes } from '@noble/hashes/utils';
import { serializable } from '../serializable/common';
import { Bytes } from '../serializable/primitives/bytes';
import { Name } from './name';
import { pack, unpack } from '../utils/packer';
import { PermissionLevel } from './permission';

@serializable()
export class Action {
  constructor(
    public readonly account: Name,
    public readonly name: Name,
    public readonly data: Bytes,
    public readonly authorization: Array<PermissionLevel>,
  ) {}

  static fromBytes(bytes: Uint8Array): [Action, Uint8Array] {
    const [account, name, data, authorization, rest] = unpack(bytes, [
      Name,
      Name,
      Bytes,
      Array<PermissionLevel>,
    ]);
    return [new Action(account, name, data, authorization), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(
      pack([this.account, this.name, this.data, this.authorization]),
    );
  }
}
