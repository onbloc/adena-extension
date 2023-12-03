import { WalletState } from '@states/index';
import { useRecoilState } from 'recoil';
import { useWalletContext } from './use-context';
import { Account } from 'adena-module';
import { useWalletAccounts } from './use-wallet-accounts';
import { StateType } from '@states/wallet';

export type UseLoadAccountsReturn = {
  state: StateType;
  accounts: Array<Account>;
  loadAccounts: () => Promise<boolean>;
  addAccounts: (addedAccounts: Array<Account>) => Promise<boolean>;
};

export const useLoadAccounts = (): UseLoadAccountsReturn => {
  const { wallet, initWallet } = useWalletContext();
  const { accounts } = useWalletAccounts();
  const [state] = useRecoilState(WalletState.state);

  const loadAccounts = async (): Promise<boolean> => {
    return initWallet();
  };

  const addAccounts = async (addedAccounts: Array<Account>): Promise<boolean> => {
    if (!wallet) {
      return false;
    }
    for (const account of addedAccounts) {
      wallet.addAccount(account);
    }
    initWallet();
    return true;
  };

  return { state, accounts, loadAccounts, addAccounts };
};
