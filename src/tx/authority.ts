import { Int, serializable, Short } from "../serializable";
import { PublicKey } from "./publicKey";
import { pack, unpack } from "../utils";
import { concatBytes } from "@noble/hashes/utils";
import { PermissionLevel } from "./permission";

@serializable()
export class Authority {
  constructor(
    public readonly threshold: Int,
    public readonly keys: Array<KeyWeight>,
    public readonly accounts: Array<PermissionLevelWeight>,
  ) {}

  static fromBytes(bytes: Uint8Array): [Authority, Uint8Array] {
    const [threshold, keys, accounts, rest] = unpack(bytes, [
      Int,
      Array<KeyWeight>,
      Array<PermissionLevelWeight>,
    ]);
    return [new Authority(threshold, keys, accounts), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(
      pack([this.threshold, this.keys, this.accounts]),
    );
  }
}

@serializable()
export class KeyWeight {
  constructor(
    public readonly key: PublicKey,
    public readonly weight: Short,
  ) {}

  static fromBytes(bytes: Uint8Array): [KeyWeight, Uint8Array] {
    const [key, weight, rest] = unpack(bytes, [
      PublicKey,
      Short,
    ]);
    return [new KeyWeight(key, weight), rest];
  }
    
  toBytes(): Uint8Array {
    return concatBytes(
      pack([this.key, this.weight]),
    );
  }
}

@serializable()
export class PermissionLevelWeight {
  constructor(
    public readonly permission: PermissionLevel,
    public readonly weight: Short,
  ) {}

  static fromBytes(bytes: Uint8Array): [PermissionLevelWeight, Uint8Array] {
    const [permission, weight, rest] = unpack(bytes, [
      PermissionLevel,
      Short,
    ]);
    return [new PermissionLevelWeight(permission, weight), rest];
  }

  toBytes(): Uint8Array {
    return concatBytes(
      pack([this.permission, this.weight]),
    );
  }
}