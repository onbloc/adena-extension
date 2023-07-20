import React, { useCallback, useEffect, useState } from 'react';
import ApproveTransaction from '@components/approve/approve-transaction/approve-transaction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@hooks/use-current-account';
import { InjectionMessage, InjectionMessageInstance } from '@inject/message';
import { createFaviconByHostname, decodeParameter, fetchHealth, parseParmeters } from '@common/utils/client-utils';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';
import { StdSignDoc, Account, isLedgerAccount } from 'adena-module';
import { RoutePath } from '@router/path';
import { validateInjectionData } from '@inject/message/methods';
import BigNumber from 'bignumber.js';
import { useNetwork } from '@hooks/use-network';

function mappedTransactionData(document: StdSignDoc) {
  return {
    messages: document.msgs,
    contracts: document.msgs.map((message) => {
      return {
        type: message?.type || '',
        function: message?.type === '/bank.MsgSend' ? 'Transfer' : message?.value?.func || '',
        value: message?.value || '',
      };
    }),
    gasWanted: document.fee.gas,
    gasFee: `${document.fee.amount[0].amount}${document.fee.amount[0].denom}`,
    document,
  }
}

const checkHealth = (rpcUrl: string, requestKey?: string) => setTimeout(async () => {
  const { healthy } = await fetchHealth(rpcUrl);
  if (healthy === false) {
    chrome.runtime.sendMessage(
      InjectionMessageInstance.failure('NETWORK_TIMEOUT', {}, requestKey),
    );
    return;
  }
}, 5000);

const ApproveTransactionContainer: React.FC = () => {
  const navigate = useNavigate();
  const { gnoProvider } = useWalletContext();
  const { walletService, transactionService } = useAdenaContext();
  const { currentAccount } = useCurrentAccount();
  const [transactionData, setTrasactionData] = useState<{ [key in string]: any } | undefined>(
    undefined,
  );
  const [hostname, setHostname] = useState('');
  const location = useLocation();
  const [requestData, setReqeustData] = useState<InjectionMessage>();
  const [favicon, setFavicon] = useState<any>(null);
  const [visibleTransactionInfo, setVisibleTransactionInfo] = useState(false);
  const [document, setDocument] = useState<StdSignDoc>();
  const { currentNetwork } = useNetwork();

  useEffect(() => {
    checkLockWallet();
  }, [walletService]);

  const checkLockWallet = () => {
    walletService.isLocked().then(locked => locked && navigate(RoutePath.ApproveLogin + location.search));
  }

  useEffect(() => {
    if (location.search) {
      initRequestData();
    }
  }, [location]);

  const initRequestData = () => {
    const data = parseParmeters(location.search);
    const parsedData = decodeParameter(data['data']);
    setReqeustData({ ...parsedData, hostname: data['hostname'] });
  };

  useEffect(() => {
    if (currentAccount && requestData && gnoProvider) {
      if (validate(currentAccount, requestData)) {
        initFavicon();
        initTransactionData();
      }
    }
  }, [currentAccount, requestData, gnoProvider]);

  const validate = (currentAccount: Account, requestData: InjectionMessage) => {
    const validationMessage = validateInjectionData(currentAccount.getAddress('g'), requestData);
    if (validationMessage) {
      chrome.runtime.sendMessage(validationMessage);
      return false;
    }
    return true;
  }

  const initFavicon = async () => {
    const faviconData = await createFaviconByHostname(requestData?.hostname ?? '');
    setFavicon(faviconData);
  };

  const initTransactionData = async () => {
    if (!currentNetwork || !currentAccount || !requestData) {
      return false;
    }
    try {
      const document = await transactionService.createDocument(
        currentAccount,
        currentNetwork.networkId,
        requestData?.data?.messages,
        requestData?.data?.gasWanted,
        requestData?.data?.gasFee,
        requestData?.data?.memo,
      );
      setDocument(document);
      setTrasactionData(mappedTransactionData(document));
      setHostname(requestData?.hostname ?? '');
      return true;
    } catch (e) {
      console.log(e);
      const error: any = e;
      if (error?.message === 'Connection Error') {
        checkHealth(currentNetwork.rpcUrl, requestData.key);
      }
      if (error?.message === 'Transaction signing request was rejected by the user') {
        chrome.runtime.sendMessage(
          InjectionMessageInstance.failure(
            'TRANSACTION_FAILED',
            requestData?.data,
            requestData?.key,
          ),
        );
      }
    }
    return false;
  };

  const getNetworkFee = useCallback(() => {
    const networkFeeAmount = BigNumber(document?.fee.amount[0]?.amount ?? 1).shiftedBy(-6);
    return `${networkFeeAmount} GNOT`;
  }, [document]);

  const sendTransaction = async () => {
    if (!document || !currentNetwork || !currentAccount) {
      chrome.runtime.sendMessage(
        InjectionMessageInstance.failure('UNEXPECTED_ERROR', requestData?.data, requestData?.key),
      );
      return false;
    }

    try {
      const signature = await transactionService.createSignature(
        currentAccount,
        document
      );
      const transaction = await transactionService.createTransaction(document, signature);
      const hash = await new Promise<string>((resolve, reject) => {
        transactionService.sendTransaction(transaction)
          .then(resolve)
          .catch(reject);

        checkHealth(currentNetwork.rpcUrl, requestData?.key);
      })
      if (hash.length > 0) {
        chrome.runtime.sendMessage(
          InjectionMessageInstance.success('TRANSACTION_SUCCESS', { hash }, requestData?.key),
        );
        return true;
      } else {
        chrome.runtime.sendMessage(
          InjectionMessageInstance.failure('TRANSACTION_FAILED', {}, requestData?.key),
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        const message = e.message;
        if (message.includes('Ledger')) {
          return false;
        }
      }
      chrome.runtime.sendMessage(
        InjectionMessageInstance.failure(
          'TRANSACTION_FAILED',
          requestData?.data,
          requestData?.key,
        ),
      );
    }
    return false;
  };

  const onToggleTransactionData = (visibleTransactionInfo: boolean) => {
    setVisibleTransactionInfo(visibleTransactionInfo);
  };

  const onClickConfirm = () => {
    if (!currentAccount) {
      return;
    }
    if (isLedgerAccount(currentAccount)) {
      navigate(RoutePath.ApproveTransactionLoading, {
        state: {
          document,
          requestData
        }
      });
      return;
    }
    sendTransaction();
  };

  const onClickCancel = () => {
    chrome.runtime.sendMessage(
      InjectionMessageInstance.failure('TRANSACTION_REJECTED', requestData?.data, requestData?.key),
    );
  };

  return (
    <ApproveTransaction
      title='Approve Transaction'
      domain={hostname}
      contracts={transactionData?.contracts}
      loading={transactionData === undefined}
      logo={favicon}
      networkFee={getNetworkFee()}
      onClickConfirm={onClickConfirm}
      onClickCancel={onClickCancel}
      onToggleTransactionData={onToggleTransactionData}
      opened={visibleTransactionInfo}
      transactionData={JSON.stringify(document, null, 2)}
    />
  );
};

export default ApproveTransactionContainer;