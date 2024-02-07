import { useCallback, useState } from 'react';
import { defaultAddressPrefix } from '@gnolang/tm2-js-client';
import {
  AirgapAccount,
  AddressKeyring,
  AdenaWallet,
  fromBech32,
  isAirgapAccount,
} from 'adena-module';

import useAppNavigate from '@hooks/use-app-navigate';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';
import { useCurrentAccount } from '@hooks/use-current-account';
import { RoutePath } from '@types';
import { useLoadAccounts } from '@hooks/use-load-accounts';
import { waitForRun } from '@common/utils/timeout-utils';
import { useWallet } from '@hooks/use-wallet';
import useIndicatorStep, {
  UseIndicatorStepReturn,
} from '@hooks/wallet/broadcast-transaction/use-indicator-step';

export type UseSetupAirgapScreenReturn = {
  address: string;
  indicatorInfo: UseIndicatorStepReturn;
  errorMessage: string | null;
  changeAddress: (address: string) => void;
  setupAirgapState: SetupAirgapStateType;
  setSetupAirgapState: (setupAirgapState: SetupAirgapStateType) => void;
  initSetup: () => void;
  confirmAddress: () => void;
  addAccount: (password?: string) => Promise<void>;
};

export type SetupAirgapStateType = 'INIT' | 'ENTER_ADDRESS' | 'LOADING' | 'COMPLETE';

export const setupAirgapStepBackTo: Record<SetupAirgapStateType, SetupAirgapStateType | null> = {
  INIT: null,
  ENTER_ADDRESS: 'INIT',
  COMPLETE: 'ENTER_ADDRESS',
  LOADING: 'ENTER_ADDRESS',
};

const setupAirgapStepNo = {
  INIT: 0,
  ENTER_ADDRESS: 1,
  COMPLETE: 2,
  LOADING: 2,
};

const useSetupAirgapScreen = (): UseSetupAirgapScreenReturn => {
  const { navigate } = useAppNavigate();
  const { updateWallet } = useWalletContext();
  const { walletService } = useAdenaContext();
  const { accounts } = useLoadAccounts();
  const [setupAirgapState, setSetupAirgapState] = useState<SetupAirgapStateType>('INIT');
  const [address, setAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedEvent, setBlockedEvent] = useState<boolean>(false);
  const { changeCurrentAccount } = useCurrentAccount();
  const { existWallet } = useWallet();

  const indicatorInfo = useIndicatorStep<SetupAirgapStateType>({
    stepMap: setupAirgapStepNo,
    currentState: setupAirgapState,
  });

  const initSetup = useCallback(() => {
    setSetupAirgapState('ENTER_ADDRESS');
  }, [setupAirgapState]);

  const changeAddress = useCallback((address: string) => {
    setAddress(address);
    setErrorMessage(null);
  }, []);

  const _validateAddress = useCallback(() => {
    try {
      const { prefix } = fromBech32(address);
      if (address && prefix === defaultAddressPrefix) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, [address]);

  const _existsAddress = useCallback(async () => {
    const checkAccounts = accounts.filter((account) => isAirgapAccount(account));
    return Promise.all(
      checkAccounts.map((account) => account.getAddress(defaultAddressPrefix)),
    ).then((addresses) => addresses.includes(address));
  }, [accounts, address]);

  const confirmAddress = useCallback(async () => {
    if (!_validateAddress()) {
      const errorMessage = 'Invalid address';
      setErrorMessage(errorMessage);
      return;
    }
    const existAddress = await _existsAddress();
    if (existAddress) {
      const errorMessage = 'Address already synced';
      setErrorMessage(errorMessage);
      return;
    }
    setSetupAirgapState('COMPLETE');
  }, [_validateAddress]);

  const _addAddressAccount = useCallback(async () => {
    const wallet = await walletService.loadWallet();
    const addressKeyring = await AddressKeyring.fromAddress(address);
    const account = await AirgapAccount.createBy(addressKeyring, 'Account');

    const addedIndex = wallet.lastAccountIndex + 1;
    account.index = addedIndex;
    account.name = `Account ${addedIndex}`;

    const clone = wallet.clone();
    clone.addKeyring(addressKeyring);
    clone.addAccount(account);
    clone.addKeyring(addressKeyring);
    const storedAccount = clone.accounts.find((storedAccount) => storedAccount.id === account.id);
    if (storedAccount) {
      await changeCurrentAccount(storedAccount);
    }
    await updateWallet(clone);
  }, [address, walletService]);

  const _createAddressAccount = useCallback(async () => {
    const createdWallet = await AdenaWallet.createByAddress(address);
    const serializedWallet = await createdWallet.serialize('');
    return serializedWallet;
  }, [address, walletService, indicatorInfo]);

  const addAccount = useCallback(async () => {
    if (blockedEvent) {
      return;
    }
    setBlockedEvent(true);
    if (existWallet) {
      setSetupAirgapState('LOADING');
      await waitForRun<void>(_addAddressAccount);
      navigate(RoutePath.WebAccountAddedComplete);
    } else {
      setSetupAirgapState('LOADING');
      const serializedWallet = await waitForRun<string>(_createAddressAccount);
      navigate(RoutePath.WebCreatePassword, {
        state: {
          serializedWallet,
          stepLength: indicatorInfo.stepLength,
        },
      });
    }
    setBlockedEvent(false);
  }, [blockedEvent, walletService, _addAddressAccount, _createAddressAccount]);

  return {
    address,
    errorMessage,
    setupAirgapState,
    indicatorInfo,
    setSetupAirgapState,
    initSetup,
    changeAddress,
    confirmAddress,
    addAccount,
  };
};

export default useSetupAirgapScreen;
