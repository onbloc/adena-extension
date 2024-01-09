import { KeyringType } from '../keyring/keyring';
import { LedgerAccount } from './ledger-account';
import { SeedAccount } from './seed-account';
import { SingleAccount } from './single-account';

export interface Account {
  id: string;
  index: number;
  type: KeyringType;
  name: string;
  keyringId: string;
  publicKey: Uint8Array;
  toData: () => AccountInfo;
  getAddress: (prefix: string) => Promise<string>;
}

export interface AccountInfo {
  id?: string;
  index: number;
  type: KeyringType;
  name: string;
  keyringId: string;
  hdPath?: number;
  publicKey: number[];
}

export function makeAccount(accountData: AccountInfo) {
  switch (accountData.type) {
    case 'HD_WALLET':
      return new SeedAccount(accountData);
    case 'LEDGER':
      return new LedgerAccount(accountData);
    case 'PRIVATE_KEY':
    case 'WEB3_AUTH':
      return new SingleAccount(accountData);
    default:
      throw new Error('Invalid account type');
  }
}
