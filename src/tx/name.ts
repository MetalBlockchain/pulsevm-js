import { serializable } from '../serializable/common';
import { Long } from '../serializable/primitives/long';
import { pack, unpack } from '../utils/packer';

export const NAME_LEN = 8;
const charMap = '.12345abcdefghijklmnopqrstuvwxyz';

@serializable()
export class Name {
  public readonly value: Long;

  constructor(value: string | Long) {
    if (value instanceof Long) {
      this.value = value as Long;
      return;
    }

    const regex = new RegExp(/^[.1-5a-z]{0,12}[.1-5a-j]?$/);

    if (!regex.test(value)) {
      throw new Error(
        'Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz',
      );
    }

    let n = 0n;

    let i = 0;
    for (; i < 12 && value[i]; i++) {
      n |=
        BigInt(charToSymbol(value.charCodeAt(i)) & 0x1f) <<
        BigInt(64 - 5 * (i + 1));
    }

    if (i == 12) {
      n |= BigInt(charToSymbol(value.charCodeAt(i)) & 0x0f);
    }

    this.value = new Long(n);
  }

  static fromBytes(bytes: Uint8Array): [Name, Uint8Array] {
    const [value, rest] = unpack(bytes, [Long]);

    return [new Name(value), rest];
  }

  toBytes(): Uint8Array {
    return pack([this.value]);
  }

  toString() {
    const str: Array<string> = [];
    let tmp = BigInt.asUintN(64, this.value.value());
    for (let i = 0; i <= 12; ++i) {
      const idx = tmp & BigInt(i === 0 ? 0x0f : 0x1f);

      str[12 - i] = charMap[Number(idx.toString())];
      tmp = tmp >> BigInt(i === 0 ? 4 : 5);
    }

    return str.join('').replace(/\.+$/g, '');
  }
}

const charToSymbol = (c: number): number => {
  if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
    return c - 'a'.charCodeAt(0) + 6;
  }
  if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
    return c - '1'.charCodeAt(0) + 1;
  }
  return 0;
};
