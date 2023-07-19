/* eslint-disable @typescript-eslint/naming-convention */
import { toUtf8 } from '../encoding';
import { Uint53 } from '../math';

import { Coin } from './coins';

export interface AminoMsg {
  readonly type: string;
  readonly value: any;
}

export interface StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string;
  /** The granter address that is used for paying with feegrants */
  readonly granter?: string;
  /** The fee payer address. The payer must have signed the transaction. */
  readonly payer?: string;
}

/**
 * The document to be signed
 *
 * @see https://docs.cosmos.network/master/modules/auth/03_types.html#stdsigndoc
 */
export interface StdSignDoc {
  readonly chain_id: string;
  readonly account_number: string;
  readonly sequence: string;
  readonly fee: StdFee;
  readonly msgs: readonly AminoMsg[];
  readonly memo: string;
}

function sortedObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortedObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
  sortedKeys.forEach((key) => {
    result[key] = sortedObject(obj[key]);
  });
  return result;
}

/** Returns a JSON string with objects sorted by key */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function sortedJsonStringify(obj: any): string {
  const sortedJson = JSON.stringify(sortedObject(obj));
  return encodeCharacterSet(sortedJson);
}

/**
 * Escapes <,>,& in string.
 * Golang's json marshaller escapes <,>,& by default.
 * https://cs.opensource.google/go/go/+/refs/tags/go1.20.6:src/encoding/json/encode.go;l=46-53
 */
function encodeCharacterSet(data: string) {
  return data.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function makeSignDoc(
  msgs: readonly AminoMsg[],
  fee: StdFee,
  chainId: string,
  memo: string | undefined,
  accountNumber: number | string,
  sequence: number | string,
): StdSignDoc {
  return {
    chain_id: chainId,
    account_number: Uint53.fromString(accountNumber.toString()).toString(),
    sequence: Uint53.fromString(sequence.toString()).toString(),
    fee: fee,
    msgs: msgs,
    memo: memo || '',
  };
}

export function generateSignDocument(
  accountNumber: number | string,
  sequence: number | string,
  chainId: string,
  msgs: Array<any>,
  gasWanted: string,
  gasFee: {
    value: string;
    denom: string;
  },
  memo?: string,
): StdSignDoc {
  return {
    msgs: [...msgs],
    fee: {
      amount: [
        {
          amount: gasFee.value,
          denom: gasFee.denom,
        },
      ],
      gas: gasWanted,
    },
    chain_id: chainId,
    memo: memo ?? '',
    account_number: `${accountNumber}` || '',
    sequence: `${sequence}`,
  };
}

export function serializeSignDoc(signDoc: StdSignDoc): Uint8Array {
  return toUtf8(sortedJsonStringify(signDoc));
}
