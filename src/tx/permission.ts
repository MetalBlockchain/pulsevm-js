import { concatBytes } from '@noble/hashes/utils';
import { serializable } from '../serializable/common';
import { pack, unpack } from '../utils/packer';
import { Name } from './name';

@serializable()
export class PermissionLevel {
  constructor(
    public readonly actor: Name,
    public readonly permission: Name,
  ) {}

  static fromBytes(bytes: Uint8Array): [PermissionLevel, Uint8Array] {
    const [actor, permission, rest] = unpack(bytes, [Name, Name]);
    return [new PermissionLevel(actor, permission), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(pack([this.actor, this.permission]));
  }
}
