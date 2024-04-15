import { useCallback, useState } from 'react';
import { SeedAccount } from 'adena-module';

import { RoutePath } from '@types';
import useAppNavigate from '@hooks/use-app-navigate';
import { useWalletContext } from '@hooks/use-context';
import { useCurrentAccount } from '@hooks/use-current-account';
import useQuestionnaire from './use-questionnaire';
import { waitForRun } from '@common/utils/timeout-utils';

export type UseAccountAddScreenReturn = {
  step: AccountAddStateType;
  setStep: React.Dispatch<React.SetStateAction<AccountAddStateType>>;
  onClickGoBack: () => void;
  onClickNext: () => void;
  addAccount: () => Promise<void>;
};

export type AccountAddStateType = 'INIT' | 'CREATE_ACCOUNT';

const useAccountAddScreen = (): UseAccountAddScreenReturn => {
  const { navigate, params } = useAppNavigate<RoutePath.WebAccountAdd>();
  const { ableToSkipQuestionnaire } = useQuestionnaire();
  const { wallet, updateWallet } = useWalletContext();
  const { changeCurrentAccount } = useCurrentAccount();

  const [step, setStep] = useState<AccountAddStateType>(
    params?.doneQuestionnaire ? 'CREATE_ACCOUNT' : 'INIT',
  );

  const onClickGoBack = useCallback(() => {
    if (step === 'INIT') {
      navigate(RoutePath.WebAdvancedOption);
    } else if (step === 'CREATE_ACCOUNT') {
      setStep('INIT');
    }
  }, [step]);

  const onClickNext = useCallback(async () => {
    if (step === 'INIT') {
      if (ableToSkipQuestionnaire) {
        setStep('CREATE_ACCOUNT');
      } else {
        navigate(RoutePath.WebQuestionnaire, {
          state: {
            callbackPath: RoutePath.WebAccountAdd,
          },
        });
      }
    }
  }, [step, ableToSkipQuestionnaire]);

  const addAccount = async (): Promise<void> => {
    const succeed = await waitForRun<boolean>(_addAccount);
    if (succeed) {
      navigate(RoutePath.WebAccountAddedComplete);
    } else {
      navigate(RoutePath.WebNotFound);
    }
  };

  const _addAccount = async (): Promise<boolean> => {
    try {
      if (!wallet) {
        return false;
      }
      const account = await SeedAccount.createByWallet(wallet);
      account.index = wallet.lastAccountIndex + 1;
      account.name = `Account ${wallet.lastAccountIndex + 1}`;
      const clone = wallet.clone();
      clone.addAccount(account);
      const storedAccount = clone.accounts.find((storedAccount) => storedAccount.id === account.id);
      if (storedAccount) {
        await changeCurrentAccount(storedAccount);
      }
      await updateWallet(clone);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    step,
    setStep,
    onClickGoBack,
    onClickNext,
    addAccount,
  };
};

export default useAccountAddScreen;
