import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdenaLedgerConnector, Document, isLedgerAccount } from 'adena-module';

import { ApproveLedgerLoading } from '@components/molecules';
import { InjectionMessage, InjectionMessageInstance } from '@inject/message';
import { useCurrentAccount } from '@hooks/use-current-account';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';

interface ApproveSignTransactionLedgerLoadingState {
  requestData?: InjectionMessage;
  document?: Document;
}

const ApproveSignTransactionLedgerLoadingContainer: React.FC = () => {
  const location = useLocation();
  const { wallet } = useWalletContext();
  const { transactionService } = useAdenaContext();
  const { document, requestData } = location.state as ApproveSignTransactionLedgerLoadingState;
  const { currentAccount } = useCurrentAccount();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      requestTransaction();
    }
  }, [currentAccount]);

  const requestTransaction = async (): Promise<void> => {
    if (completed) {
      return;
    }
    const result = await createLedgerTransaction();
    setCompleted(result);
    setTimeout(() => !result && requestTransaction(), 1000);
  };

  const createLedgerTransaction = async (): Promise<boolean> => {
    if (!currentAccount || !document || !wallet) {
      return false;
    }

    if (!isLedgerAccount(currentAccount)) {
      return false;
    }

    const connected = await AdenaLedgerConnector.openConnected();
    if (!connected) {
      console.log('Ledger not found');
      return false;
    }
    const ledgerConnector = AdenaLedgerConnector.fromTransport(connected);

    const result = await transactionService.createTransactionWithLedger(ledgerConnector, currentAccount, document)
      .then(async ({ signed }) => {
        const encodedTransaction = transactionService.encodeTransaction(signed);
        chrome.runtime.sendMessage(
          InjectionMessageInstance.success('SIGN_TX', { encodedTransaction }, requestData?.key),
        );
        return true;
      })
      .catch((error: Error) => {
        if (error.message === 'Transaction signing request was rejected by the user') {
          chrome.runtime.sendMessage(
            InjectionMessageInstance.failure('SIGN_REJECTED', {}, requestData?.key),
          );
          return true;
        }
        if (error.message.includes('Ledger')) {
          return false;
        }
        return false;
      });
    return result;
  };

  const onClickCancel = (): void => {
    if (!requestData) {
      window.close();
      return;
    }
    chrome.runtime.sendMessage(
      InjectionMessageInstance.failure('SIGN_REJECTED', requestData.data, requestData.key),
    );
  };

  return <ApproveLedgerLoading onClickCancel={onClickCancel} />;
};

export default ApproveSignTransactionLedgerLoadingContainer;
