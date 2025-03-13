import { describe, expect, it } from 'vitest';
import { Name } from './name';
import { Transaction } from './tx';
import { BaseTransaction } from './baseTx';
import { Id } from '../serializable/id';
import { Action } from './action';
import { PermissionLevel } from './permission';
import { bytesToHex } from '@noble/hashes/utils';
import { parsePrivateKey } from '../utils/crypto';
import { encodeActionData } from '../utils/action';
import { Authority, KeyWeight } from './authority';
import { PublicKey } from './publicKey';
import { Int, Short } from '../serializable/primitives';
import { bufferToHex } from '../utils';

describe('tx', function () {
  it('works correctly', async () => {
    const key = parsePrivateKey(
      'frqNAoTevNse58hUoJMDzPXDbfNicjCGjNz5VDgqqHJbhBBG9',
    );
    console.log(bufferToHex(key));
    const tx = new Transaction(
      new BaseTransaction(Id.fromString(''), [
        new Action(
          new Name('pulse'),
          new Name('newaccount'),
          encodeActionData([
            new Name('pulse'),
            new Name('glenn'),
            new Authority(
              new Int(1),
              [new KeyWeight(PublicKey.fromPrivateKey(key), new Short(1))],
              [],
            ),
            new Authority(
              new Int(1),
              [new KeyWeight(PublicKey.fromPrivateKey(key), new Short(1))],
              [],
            )
          ]),
          [new PermissionLevel(new Name('pulse'), new Name('active'))],
        ),
      ]),
      [],
    );
    await tx.sign(key);

    expect(bytesToHex(tx.toBytes())).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000000000000001aea38500000000009ab864229a9e40000000006eaea385000000000064553980000000000000000100000001027f4dbe05a88d4c3974cec8d03f192c96a9813ea4d60811c4e68a2d459842497c0001000000000000000100000001027f4dbe05a88d4c3974cec8d03f192c96a9813ea4d60811c4e68a2d459842497c00010000000000000001aea38500000000003232eda800000000000000010c54568c612db85df98431a783719fa34bea13ce39f92980ccab9bd9edabd06158eab9be24203dce8e38af92eb3dc67e06ee55dd67896f3b61e82f808969511b01',
    );
  });
});
