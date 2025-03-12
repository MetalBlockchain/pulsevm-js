import { describe, expect, it } from 'vitest';
import { Name } from './name';

describe('name', function () {
  it('works correctly', () => {
    const name = new Name('eosio');
    const expectedNameStr = 'eosio';
    const nameStr = name.toString();

    expect(name.value.value()).toEqual(6138663577826885632n);
    expect(nameStr).toEqual(expectedNameStr);
    expect(name.toBytes()).toEqual(
      new Uint8Array([0x55, 0x30, 0xea, 0x00, 0x00, 0x00, 0x00, 0x00]),
    );
  });
});
