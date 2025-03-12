import { describe, it, expect } from 'vitest';

import { Id } from './id';

describe('id', function () {
  it('works correctly', () => {
    const id = Id.fromHex(
      '0x3245629800000000000000000000000000000000000000000000000000000000',
    );
    const expectedIDStr = 'P97A3HL7811hwQdodS2ef1iCd9UB3dNAXUC6zRSLLtzJat7kJ';
    const idStr = id.toString();

    expect(idStr).toEqual(expectedIDStr);
    expect(Id.fromString(expectedIDStr).toBytes()).toEqual(
      new Uint8Array([
        0x32, 0x45, 0x62, 0x98, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ]),
    );
  });
});
