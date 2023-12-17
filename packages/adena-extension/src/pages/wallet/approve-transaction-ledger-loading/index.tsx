import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StdSignDoc, isLedgerAccount } from 'adena-module';

import { ApproveLedgerLoading } from '@components/molecules';
import { InjectionMessage, InjectionMessageInstance } from '@inject/message';
import { useCurrentAccount } from '@hooks/use-current-account';
import { useAdenaContext } from '@hooks/use-context';
import { useNetwork } from '@hooks/use-network';
import { TM2Error } from '@gnolang/tm2-js-client';

interface ApproveSignLedgerLoadingState {
  requestData?: InjectionMessage;
  document?: StdSignDoc;
}

const ApproveTransactionLedgerLoadingContainer: React.FC = () => {
  const location = useLocation();
  const { transactionService } = useAdenaContext();
  const { document, requestData } = location.state as ApproveSignLedgerLoadingState;
  const { currentAccount } = useCurrentAccount();
  const [completed, setCompleted] = useState(false);
  const { currentNetwork } = useNetwork();

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
    if (!currentAccount || !document || !currentNetwork) {
      return false;
    }
    if (!isLedgerAccount(currentAccount)) {
      return false;
    }

    const result = await transactionService
      .createSignatureWithLedger(currentAccount, document)
      .then(async (signature) => {
        const transaction = await transactionService.createTransaction(document, signature);
        const hash = transactionService.createHash(transaction);
        const response = await transactionService
          .sendTransaction(transaction)
          .catch((error: TM2Error | Error) => {
            return error;
          });

        if (!response) {
          chrome.runtime.sendMessage(
            InjectionMessageInstance.failure(
              'TRANSACTION_FAILED',
              {
                hash,
                error: null,
              },
              requestData?.key,
            ),
          );
          return true;
        }
        if (response instanceof TM2Error || response instanceof Error) {
          chrome.runtime.sendMessage(
            InjectionMessageInstance.failure(
              'TRANSACTION_FAILED',
              {
                hash,
                error: response,
              },
              requestData?.key,
            ),
          );
          return true;
        }

        chrome.runtime.sendMessage(
          InjectionMessageInstance.success('TRANSACTION_SUCCESS', response, requestData?.key),
        );
        return true;
      })
      .catch((error: Error) => {
        if (error.message.includes('Ledger')) {
          return false;
        }
        if (error.message === 'Transaction signing request was rejected by the user') {
          chrome.runtime.sendMessage(
            InjectionMessageInstance.failure('TRANSACTION_REJECTED', {}, requestData?.key),
          );
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
      InjectionMessageInstance.failure('TRANSACTION_REJECTED', {}, requestData.key),
    );
  };

  return <ApproveLedgerLoading onClickCancel={onClickCancel} />;
};

export default ApproveTransactionLedgerLoadingContainer;
