import { concatBytes } from '@noble/hashes/utils';
import { Serializable } from '../serializable/common';
import { Int } from '../serializable/primitives';

export function pack(serializables: (Serializable | Serializable[])[]) {
  return concatBytes(
    ...serializables.map((ser) => {
      if (Array.isArray(ser)) {
        return packList(ser);
      }
      return ser.toBytes();
    }),
  );
}

export const packList = (
  serializables: readonly Serializable[],
): Uint8Array => {
  return concatBytes(
    bytesForInt(serializables.length),
    ...serializables.map((ser) => ser.toBytes()),
  );
};

export type FromBytesReturn<T> = T extends {
  fromBytes: (buff: Uint8Array) => [infer rType, Uint8Array];
}
  ? rType
  : T extends {
        fromBytes: (buff: Uint8Array) => [infer rType, Uint8Array];
      }
    ? rType
    : never;

export type ReturnTypes<T extends readonly any[]> = {
  [i in keyof T]: FromBytesReturn<T[i]>;
};

export function unpack<O extends readonly any[]>(
  buffer: Uint8Array,
  sers: O,
): [...ReturnTypes<O>, Uint8Array] {
  const unpacked = sers.map((ser) => {
    let res: ReturnType<typeof ser.fromBytes>[0];

    if (!buffer.length) {
      throw new Error('not enough bytes');
    }

    [res, buffer] = ser.fromBytes(buffer);

    return res;
  });

  return [...unpacked, buffer] as unknown as [...ReturnTypes<O>, Uint8Array];
}

export const bytesForInt = (num: number): Uint8Array => new Int(num).toBytes();