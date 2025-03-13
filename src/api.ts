import { bytesToHex } from '@noble/hashes/utils';
import { IssueTxRequest, IssueTxResponse } from './models';
import { Transaction } from './tx/tx';
import { JsonRpcProvider } from './utils/rpc';
import { add0x } from 'micro-eth-signer/utils';
import { addChecksum } from './utils';

export class PulseAPI {
  protected rpcProvider: JsonRpcProvider;

  constructor(
    url: string,
    protected base?: string,
    protected fetchOptions?: RequestInit,
  ) {
    this.rpcProvider = new JsonRpcProvider(url);
  }

  private callRpc = <T>(
    methodName: string,
    params?: Array<Record<string, any>> | Record<string, any>,
  ): Promise<T> =>
    this.rpcProvider.callMethod<T>(methodName, params, this.fetchOptions);

  issueTx = async (tx: Transaction) => {
    const params: IssueTxRequest = {
      tx: add0x(bytesToHex(addChecksum(tx.toBytes()))),
    };
    const resp = await this.callRpc<IssueTxResponse>('pulsevm.issueTx', {
      ...params,
      encoding: 'hex',
    });
    return resp.txID;
  };
}
