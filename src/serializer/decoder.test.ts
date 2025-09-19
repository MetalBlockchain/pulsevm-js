import { describe, expect, it } from 'vitest';
import { abiDecode } from './decoder.js';
import { GetInfoResponse } from '../api/types.js';
import { PrivateKey } from '../chain/private-key.js';
import { Authority } from '../chain/authority.js';

describe('name', function () {
  it('works correctly', () => {
    const privateKey = PrivateKey.from("PVT_K1_frqNAoTevNse58hUoJMDzPXDbfNicjCGjNz5VDgqqHJd5CVgr");
    const auth = Authority.from({
      threshold: 1,
      keys: [
        {
          key: privateKey.toPublic().toString(),
          weight: 1
        }
      ]
    })
    const response = {
      "server_version": "d133c641",
      "chain_id": "222acc32685161c06f437ba973000ea90a82891372f248463e659e5a1639cf32",
      "head_block_num": 1,
      "last_irreversible_block_num": 1,
      "last_irreversible_block_id": "c61417373e77f69ba8e59b4d1c67e283132c2887a63440dc2db02d891148c709",
      "head_block_id": "c61417373e77f69ba8e59b4d1c67e283132c2887a63440dc2db02d891148c709",
      "head_block_time": "2023-01-01T00:00:00",
      "head_block_producer": "pulse",
      "virtual_block_cpu_limit": 100,
      "virtual_block_net_limit": 100,
      "block_cpu_limit": 100,
      "block_net_limit": 100,
      "server_version_string": "v5.0.3",
      "fork_db_head_block_num": 1,
      "fork_db_head_block_id": "c61417373e77f69ba8e59b4d1c67e283132c2887a63440dc2db02d891148c709",
      "server_full_version_string": "v5.0.3-d133c6413ce8ce2e96096a0513ec25b4a8dbe837",
      "total_cpu_weight": 100,
      "total_net_weight": 100,
      "earliest_available_block_num": 1,
      "last_irreversible_block_time": "2023-01-01T00:00:00"
  };

    const decoded = abiDecode({
      type: GetInfoResponse,
      object: response,
    })
    expect(decoded).toBe({})
  });
});
