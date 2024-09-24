import React, { useMemo } from 'react';

import { ADENA_DOCS_PAGE } from '@common/constants/resource.constant';
import { WebMain } from '@components/atoms';
import { WebMainHeader } from '@components/pages/web/main-header';

import { WEB_TOP_SPACING, WEB_TOP_SPACING_RESPONSIVE } from '@common/constants/ui.constant';
import WebLoadingAccounts from '@components/pages/web/loading-accounts';
import SensitiveInfoStep from '@components/pages/web/sensitive-info-step';
import useWalletImportScreen from '@hooks/web/use-wallet-import-screen';
import GetMnemonicStep from './set-mnemonic-step';

const WalletImportScreen: React.FC = () => {
  const useWalletImportScreenReturn = useWalletImportScreen();
  const { extended, step, onClickGoBack, indicatorInfo, onClickNext } = useWalletImportScreenReturn;

  const topSpacing = useMemo(() => {
    if (extended) {
      return null;
    }
    return {
      default: WEB_TOP_SPACING,
      responsive: WEB_TOP_SPACING_RESPONSIVE,
    };
  }, [extended]);

  if (step === 'LOADING') {
    return (
      <WebMain spacing={null}>
        <WebLoadingAccounts />
      </WebMain>
    );
  }

  return (
    <WebMain
      spacing={topSpacing?.default || null}
      responsiveSpacing={topSpacing?.responsive || null}
    >
      <WebMainHeader
        stepLength={indicatorInfo.stepLength}
        onClickGoBack={onClickGoBack}
        currentStep={indicatorInfo.stepNo}
      />
      {step === 'INIT' && (
        <SensitiveInfoStep
          desc={
            'You are about to import your seed phrase or private key on this device.\nWe recommend connecting with a hardware wallet for higher security.'
          }
          onClickNext={onClickNext}
          link={`${ADENA_DOCS_PAGE}/user-guide/sign-in/import-wallet`}
        />
      )}
      {step === 'SET_SEED_PHRASE' && (
        <GetMnemonicStep useWalletImportScreenReturn={useWalletImportScreenReturn} />
      )}
    </WebMain>
  );
};

export default WalletImportScreen;
