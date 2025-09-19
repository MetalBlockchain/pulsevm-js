import { AccountObject, GetAbiResponse, GetBlockInfoResponse, GetBlockResponse, GetCodeResponse, GetCurrencyStatsItemResponse, GetCurrencyStatsResponse, GetInfoResponse, GetProducerScheduleResponse, GetRawAbiResponse, GetTableByScopeParams, GetTableByScopeResponse, GetTableRowsParams, GetTableRowsParamsKeyed, GetTableRowsParamsTyped, PushTransactionResponse } from './api/types.js';
import { JsonRpcProvider } from './rpc.js';
import { ABISerializableConstructor, ABISerializableType } from './serializer/serializable.js';
import { Name, NameType } from './chain/name.js';
import { BuiltinTypes } from './serializer/builtins.js';
import { UInt128, UInt32, UInt32Type, UInt64 } from './chain/integer.js';
import { BlockIdType } from './chain/block-id.js';
import { Serializer } from './serializer/index.js';
import { Checksum160, Checksum256 } from './chain/checksum.js';
import { Float128, Float64 } from './chain/float.js';
import { Bytes } from './chain/bytes.js';
import { isInstanceOf } from './utils.js';
import { PackedTransaction, SignedTransaction, SignedTransactionType } from './chain/transaction.js';

export class PulseAPI {
  protected rpcProvider: JsonRpcProvider;

  constructor(
    url: string,
    protected base?: string,
    protected fetchOptions?: RequestInit,
  ) {
    this.rpcProvider = new JsonRpcProvider(url);
  }

  async callRpc<T extends ABISerializableConstructor>(args: { methodName: string, params?: Array<Record<string, any>> | Record<string, any>, responseType?: T }): Promise<InstanceType<T>>
  async callRpc<T extends keyof BuiltinTypes>(args: { methodName: string, params?: Array<Record<string, any>> | Record<string, any> }): Promise<BuiltinTypes[T]>
  async callRpc<T = unknown>(args: { methodName: string, params?: Array<Record<string, any>> | Record<string, any> }): Promise<T>
  async callRpc(
    args: {
      methodName: string,
      params?: Array<Record<string, any>> | Record<string, any>,
      responseType?: ABISerializableType,
    }
  ) {
    let response = await this.rpcProvider.callMethod(args.methodName, args.params, this.fetchOptions);

    if (args.responseType) {
      return Serializer.decode({type: args.responseType, object: response})
    }

    return response
  }

  pushTransaction = async (tx: SignedTransactionType | PackedTransaction) => {
    if (!isInstanceOf(tx, PackedTransaction)) {
      tx = PackedTransaction.fromSigned(SignedTransaction.from(tx))
    }
    const resp = await this.callRpc<any>({
      methodName: 'pulsevm.issueTx',
      params: tx,
    });
    return resp.txID;
  };

  getInfo = async () => {
    return this.callRpc({
      methodName: 'pulsevm.getInfo',
      responseType: GetInfoResponse,
    });
  };

  getABI = async (account_name: NameType) => {
    return this.callRpc<GetAbiResponse>({
      methodName: 'pulsevm.getABI',
      params: { account_name: Name.from(account_name)},
    });
  };

  getCode = async (account_name: NameType) => {
    return this.callRpc({
      methodName: 'pulsevm.getCode',
      params: { account_name: Name.from(account_name)},
      responseType: GetCodeResponse
    });
  };

  getRawABI = async (account_name: NameType) => {
    return this.callRpc({
      methodName: 'pulsevm.getRawABI',
      params: { account_name: Name.from(account_name)},
      responseType: GetRawAbiResponse
    });
  };

  getAccount = async (account_name: NameType) => {
    return this.callRpc({
      methodName: 'pulsevm.getAccount',
      params: { account_name: Name.from(account_name)},
      responseType: AccountObject
    });
  };

  getCurrencyBalance = async (contract: NameType, account_name: NameType, symbol?: string) => {
    const params: any = {
      account: Name.from(account_name),
      code: Name.from(contract),
    }
    if (symbol) {
      params.symbol = symbol
    }
    return this.callRpc<any>({
      methodName: 'pulsevm.getCurrencyBalance',
      params,
      responseType: 'asset[]',
    });
  };

  getCurrencyStats = async (contract: NameType, symbol: string) => {
    const params: any = {
      code: Name.from(contract),
      symbol,
    }
    let response: GetCurrencyStatsResponse = await this.callRpc<any>({
      methodName: 'pulsevm.getCurrencyStats',
      params,
    });
    const result: GetCurrencyStatsResponse = {}
    Object.keys(response).forEach(
      (r) => (result[r] = GetCurrencyStatsItemResponse.from(response[r]))
    )
    return result
  };

  getTableRows = async (params: GetTableRowsParams | GetTableRowsParamsTyped | GetTableRowsParamsKeyed) => {
    const type = (params as GetTableRowsParamsTyped).type
    let key_type = (params as GetTableRowsParamsKeyed).key_type
    const someBound = params.lower_bound || params.upper_bound
    if (!key_type && someBound) {
        // determine key type from bounds type
        if (isInstanceOf(someBound, UInt64)) {
            key_type = 'i64'
        } else if (isInstanceOf(someBound, UInt128)) {
            key_type = 'i128'
        } else if (isInstanceOf(someBound, Checksum256)) {
            key_type = 'sha256'
        } else if (isInstanceOf(someBound, Checksum160)) {
            key_type = 'ripemd160'
        }
    }
    if (!key_type) {
        key_type = 'name'
    }
    let json = params.json
    if (json === undefined) {
        // if we know the row type don't ask the node to perform abi decoding
        json = type === undefined
    }
    let upper_bound = params.upper_bound
    if (upper_bound && typeof upper_bound !== 'string') {
        upper_bound = String(upper_bound)
    }
    let lower_bound = params.lower_bound
    if (lower_bound && typeof lower_bound !== 'string') {
        lower_bound = String(lower_bound)
    }
    let scope = params.scope
    if (typeof scope === 'undefined') {
        scope = String(Name.from(params.code))
    } else if (typeof scope !== 'string') {
        scope = String(scope)
    }
    // eslint-disable-next-line prefer-const
    let {rows, more, next_key} = await this.callRpc<any>({
      methodName: 'pulsevm.getTableRows',
      params: {
          ...params,
          code: Name.from(params.code),
          table: Name.from(params.table),
          limit: params.limit !== undefined ? UInt32.from(params.limit) : undefined,
          scope,
          key_type,
          json,
          upper_bound,
          lower_bound,
      }
    });
    let ram_payers: Name[] | undefined
    if (params.show_payer) {
        ram_payers = []
        rows = rows.map(({data, payer}) => {
            ram_payers!.push(Name.from(payer))
            return data
        })
    }
    if (type) {
        if (json) {
            rows = rows.map((value) => {
                if (typeof value === 'string' && Bytes.isBytes(value)) {
                    // this handles the case where nodeos bails on abi decoding and just returns a hex string
                    return Serializer.decode({data: Bytes.from(value), type})
                } else {
                    return Serializer.decode({object: value, type})
                }
            })
        } else {
            rows = rows
                .map((hex) => Bytes.from(hex))
                .map((data) => Serializer.decode({data, type}))
        }
    }
    if (next_key && next_key.length > 0) {
        let indexType: ABISerializableType
        // set index type so we can decode next_key in the response if present
        switch (key_type) {
            case 'i64':
                indexType = UInt64
                break
            case 'i128':
                indexType = UInt128
                break
            case 'name':
                indexType = Name
                break
            case 'float64':
                indexType = Float64
                break
            case 'float128':
                indexType = Float128
                break
            case 'sha256':
                indexType = Checksum256
                break
            case 'ripemd160':
                indexType = Checksum160
                break
            default:
                throw new Error(`Unsupported key type: ${key_type}`)
        }
        if (indexType === Name) {
            // names are sent back as an uint64 string instead of a name string..
            next_key = Name.from(Serializer.decode({object: next_key, type: UInt64}))
        } else {
            next_key = Serializer.decode({object: next_key, type: indexType})
        }
    } else {
        next_key = undefined
    }
    return {rows, more, next_key, ram_payers}
  };

  getTableByScope = async (params: GetTableByScopeParams) => {
    return this.callRpc({
      methodName: 'pulsevm.getTableByScope',
      params,
      responseType: GetTableByScopeResponse,
    });
  };

  getBlock = async (block_num_or_id: BlockIdType | UInt32Type) => {
    return this.callRpc({
      methodName: 'pulsevm.getBlock',
      params: { block_num_or_id },
      responseType: GetBlockResponse,
    });
  };

  getBlockInfo = async (block_num: UInt32Type) => {
    return this.callRpc({
      methodName: 'pulsevm.getBlockInfo',
      params: { block_num },
      responseType: GetBlockInfoResponse,
    });
  };

  getProducerSchedule = async () => {
    return this.callRpc({
      methodName: 'pulsevm.getProducerSchedule',
      responseType: GetProducerScheduleResponse,
    });
  };
}
