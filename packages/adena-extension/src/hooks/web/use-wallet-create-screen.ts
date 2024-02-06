import { useCallback, useMemo, useState } from 'react';
import { AdenaWallet, HDWalletKeyring, SeedAccount } from 'adena-module';

import { RoutePath } from '@types';
import useAppNavigate from '@hooks/use-app-navigate';
import { useWalletContext } from '@hooks/use-context';
import { useCurrentAccount } from '@hooks/use-current-account';
import useQuestionnaire from './use-questionnaire';
import useIndicatorStep, {
  UseIndicatorStepReturn,
} from '@hooks/wallet/broadcast-transaction/use-indicator-step';

export type UseWalletCreateReturn = {
  seeds: string;
  step: WalletCreateStateType;
  indicatorInfo: UseIndicatorStepReturn;
  setStep: React.Dispatch<React.SetStateAction<WalletCreateStateType>>;
  onClickGoBack: () => void;
  onClickNext: () => void;
};

export type WalletCreateStateType = 'INIT' | 'GET_SEED_PHRASE';

const useWalletCreateScreen = (): UseWalletCreateReturn => {
  const { navigate, params } = useAppNavigate<RoutePath.WebWalletCreate>();
  const { ableToSkipQuestionnaire } = useQuestionnaire();
  const { wallet, updateWallet } = useWalletContext();
  const { changeCurrentAccount } = useCurrentAccount();

  const [step, setStep] = useState<WalletCreateStateType>(
    params?.doneQuestionnaire ? 'GET_SEED_PHRASE' : 'INIT',
  );

  const walletCreateStepNo = {
    INIT: 0,
    GET_SEED_PHRASE: 1,
  };

  const indicatorInfo = useIndicatorStep<string>({
    stepMap: walletCreateStepNo,
    currentState: step,
    hasQuestionnaire: true,
  });

  const seeds = useMemo(() => AdenaWallet.generateMnemonic(), []);

  const onClickGoBack = useCallback(() => {
    if (step === 'INIT') {
      navigate(RoutePath.WebAdvancedOption);
    } else if (step === 'GET_SEED_PHRASE') {
      setStep('INIT');
    }
  }, [step]);

  const onClickNext = useCallback(async () => {
    if (step === 'INIT') {
      if (ableToSkipQuestionnaire) {
        setStep('GET_SEED_PHRASE');
      } else {
        navigate(RoutePath.WebQuestionnaire, {
          state: {
            callbackPath: RoutePath.WebWalletCreate,
          },
        });
      }
    } else if (step === 'GET_SEED_PHRASE') {
      if (wallet) {
        const keyring = await HDWalletKeyring.fromMnemonic(seeds);
        const account = await SeedAccount.createBy(
          keyring,
          `Account ${wallet.lastAccountIndex + 1}`,
          0,
        );
        account.index = wallet.lastAccountIndex + 1;

        const clone = wallet.clone();
        clone.addAccount(account);
        clone.addKeyring(keyring);
        const storedAccount = clone.accounts.find(
          (storedAccount) => storedAccount.id === account.id,
        );
        if (storedAccount) {
          await changeCurrentAccount(storedAccount);
        }
        await updateWallet(clone);
        navigate(RoutePath.WebAccountAddedComplete);
      } else {
        const createdWallet = await AdenaWallet.createByMnemonic(seeds);
        const serializedWallet = await createdWallet.serialize('');

        navigate(RoutePath.WebCreatePassword, {
          state: { serializedWallet, stepLength: indicatorInfo.stepLength },
        });
      }
    }
  }, [step, ableToSkipQuestionnaire, wallet, indicatorInfo]);

  return {
    seeds,
    step,
    indicatorInfo,
    setStep,
    onClickGoBack,
    onClickNext,
  };
};

export default useWalletCreateScreen;
