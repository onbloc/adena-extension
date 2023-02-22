import { GnoClientState, WalletState } from '@states/index';
import { WalletAccount } from 'adena-module';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useAdenaContext } from './use-context';
import { useWallet } from './use-wallet';

export const useCurrentAccount = (): [
  account: InstanceType<typeof WalletAccount> | null,
  updateCurrentAccountInfo: (address?: string) => void,
  changeCurrentAccount: (
    address?: string | null,
    accounts?: Array<InstanceType<typeof WalletAccount>>,
  ) => void,
] => {
  const { accountService } = useAdenaContext();
  const [currentAccount, setCurrentAccount] = useRecoilState(WalletState.currentAccount);
  const [gnoClient] = useRecoilState(GnoClientState.current);
  const [walletAccounts] = useRecoilState(WalletState.accounts);
  const [, setBalances] = useRecoilState(WalletState.balances);
  const [wallet] = useWallet();

  useEffect(() => {
    if (!currentAccount) {
      return;
    }
    updateCurrentName();

  }, [currentAccount?.getAddress()])

  const updateCurrentName = async () => {
    if (!currentAccount) {
      return;
    }
    const accountNames = await accountService.loadAccountNames();
    if (accountNames[currentAccount.getAddress()]) {
      const account = currentAccount.clone();
      account.setName(accountNames[currentAccount.getAddress()]);
      setCurrentAccount(account);
    }
  }

  const updateCurrentAccountInfo = async (address?: string) => {
    const currentAddress = address ?? currentAccount?.getAddress();
    const account = walletAccounts?.find(item => item.data.address === currentAddress);
    if (gnoClient && account) {
      const changedAccount = await accountService.updateAccountInfo(account);
      setCurrentAccount(changedAccount);
    }
  };

  const changeCurrentAccount = async (
    address?: string | null,
    accounts?: Array<InstanceType<typeof WalletAccount>>,
  ) => {
    const storedAccounts = await accountService.loadAccounts();
    const currentAccounts = accounts ?? storedAccounts ?? walletAccounts;
    if (!currentAccounts || currentAccounts.length === 0) {
      return 0;
    }

    // TODO: DELETE
    let currentAddress = '';
    if (address) {
      await accountService.saveCurrentAccountAddress(address);
      currentAddress = address;
    } else {
      currentAddress = await accountService.loadCurrentAccountAddress();
    }
    if (currentAccounts.findIndex(account => account.getAddress() === currentAddress) === -1) {
      currentAddress = currentAccounts[0].getAddress();
      await accountService.saveCurrentAccountAddress(currentAddress);
    }

    if (currentAccount?.getAddress() !== currentAddress) {
      setBalances([]);
    }
    const accountIndex = currentAccounts.findIndex(
      (account) => account.getAddress() === currentAddress,
    );
    const account =
      accountIndex > 0 ?
        currentAccounts[accountIndex] :
        currentAccounts[0];
    const changedCurrentAccount = account.clone();

    if (changedCurrentAccount.data.signerType === 'AMINO') {
      changedCurrentAccount.setSigner(wallet?.getSigner());
    }
    updateCurrentAccountName(changedCurrentAccount);
    setCurrentAccount(changedCurrentAccount);
  };

  const updateCurrentAccountName = async (account: InstanceType<typeof WalletAccount> | null) => {
    if (account) {
      const changedAccount = account.clone();
      const accountNames = await accountService.loadAccountNames();
      if (Object.keys(accountNames).includes(account.getAddress())) {
        changedAccount.setName(accountNames[account.getAddress()]);
      }
    }
  };

  return [currentAccount, updateCurrentAccountInfo, changeCurrentAccount];
};
