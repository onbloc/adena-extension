import { useContext } from 'react';
import { CommonError } from '@common/errors/common';
import {
  AdenaContext,
  AdenaContextProps,
  WalletContext,
  WalletContextProps,
} from '@common/provider';

export const useAdenaContext = (): AdenaContextProps => {
  const context = useContext(AdenaContext);
  if (context === null) {
    throw new CommonError('FAILED_INITIALIZE_PROVIDER');
  }
  return context;
};

export const useWalletContext = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new CommonError('FAILED_INITIALIZE_PROVIDER');
  }
  return context;
};
