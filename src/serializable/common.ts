export interface Serializable {
  toBytes(): Uint8Array;
}

export interface SerializableStatic {
  new (...args: any[]): Serializable;

  fromBytes(bytes: Uint8Array): [Serializable, Uint8Array];
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => constructor;
}

export function serializable() {
  return staticImplements<SerializableStatic>();
}

export abstract class Primitives {
  abstract toJSON(): any;
}
