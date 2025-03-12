import { describe, expect, it } from 'vitest';
import { Name } from './name';
import { Transaction } from './tx';
import { UnsignedTransaction } from './unsignedTx';
import { Id } from '../serializable/id';
import { Action } from './action';
import { Bytes } from '../serializable/primitives/bytes';
import { PermissionLevel } from './permission';
import { bytesToHex } from '@noble/hashes/utils';
import { parsePrivateKey } from '../utils/crypto';
import { PulseAPI } from 'api';

describe('tx', function () {
  it('works correctly', async () => {
    const key = parsePrivateKey(
      'frqNAoTevNse58hUoJMDzPXDbfNicjCGjNz5VDgqqHJbhBBG9',
    );
    const tx = new Transaction(
      new UnsignedTransaction(Id.fromString(''), [
        new Action(
          new Name('pulse'),
          new Name('newaccount'),
          new Bytes(new Uint8Array()),
          [new PermissionLevel(new Name('pulse'), new Name('active'))],
        ),
      ]),
      [],
    );
    await tx.sign(key);

    expect(bytesToHex(tx.toBytes())).toBe(
      '000000000000000000000000000000000000000000000000000000000000000000000001aea38500000000009ab864229a9e40000000000000000001aea38500000000003232eda80000000000000001f7024bc5be886bbe45c323e8f8f0ba657ac7ce040b5ab1cd35f06d1d0e9776ff45fbf41b99e8eb2bd07ecb24b5db5c1bfeca0ec6fa7ab60c0bd8e10deccd941700',
    );
  });
});
