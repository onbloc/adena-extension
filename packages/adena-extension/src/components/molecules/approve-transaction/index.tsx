import React, { useCallback, useState } from 'react';

import { Button, Text } from '@components/atoms';
import {
  ApproveInjectionLoading,
  ApproveLoading,
  BottomFixedButtonGroup,
} from '@components/molecules';

import IconArraowDown from '@assets/arrowS-down-gray.svg';
import IconArraowUp from '@assets/arrowS-up-gray.svg';
import DefaultFavicon from '@assets/favicon-default.svg';
import NetworkFeeSetting from '@components/pages/network-fee-setting/network-fee-setting/network-fee-setting';
import { UseNetworkFeeReturn } from '@hooks/wallet/use-network-fee';
import { NetworkFee as NetworkFeeType } from '@types';
import NetworkFee from '../network-fee/network-fee';
import {
  ApproveTransactionNetworkFeeWrapper,
  ApproveTransactionWrapper,
} from './approve-transaction.styles';

export interface ApproveTransactionProps {
  loading: boolean;
  title: string;
  logo: string;
  domain: string;
  contracts: {
    type: string;
    function: string;
    value: string;
  }[];
  memo: string;
  hasMemo: boolean;
  isErrorNetworkFee?: boolean;
  networkFee: NetworkFeeType | null;
  transactionData: string;
  opened: boolean;
  processing: boolean;
  done: boolean;
  changeMemo: (memo: string) => void;
  onToggleTransactionData: (opened: boolean) => void;
  onResponse: () => void;
  onTimeout: () => void;
  onClickConfirm: () => void;
  onClickCancel: () => void;
  useNetworkFeeReturn: UseNetworkFeeReturn;
}

export const ApproveTransaction: React.FC<ApproveTransactionProps> = ({
  loading,
  title,
  logo,
  domain,
  contracts,
  memo,
  hasMemo,
  networkFee,
  isErrorNetworkFee,
  transactionData,
  opened,
  processing,
  done,
  useNetworkFeeReturn,
  changeMemo,
  onToggleTransactionData,
  onResponse,
  onTimeout,
  onClickConfirm,
  onClickCancel,
}) => {
  const [openedNetworkFeeSetting, setOpenedNetworkFeeSetting] = useState(false);

  const onChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasMemo) {
        return;
      }

      const value = e.target.value;
      changeMemo(value);
    },
    [hasMemo, changeMemo],
  );

  const onClickNetworkFeeSetting = useCallback(() => {
    setOpenedNetworkFeeSetting(true);
  }, []);

  const onClickNetworkFeeClose = useCallback(() => {
    setOpenedNetworkFeeSetting(false);
  }, []);

  const onClickNetworkFeeSave = useCallback(() => {
    useNetworkFeeReturn.save();
    setOpenedNetworkFeeSetting(false);
  }, [useNetworkFeeReturn.save]);

  if (loading) {
    return <ApproveLoading rightButtonText='Approve' />;
  }

  if (processing) {
    return <ApproveInjectionLoading done={done} onResponse={onResponse} onTimeout={onTimeout} />;
  }

  if (openedNetworkFeeSetting) {
    return (
      <ApproveTransactionNetworkFeeWrapper>
        <NetworkFeeSetting
          {...useNetworkFeeReturn}
          onClickBack={onClickNetworkFeeClose}
          onClickSave={onClickNetworkFeeSave}
        />
      </ApproveTransactionNetworkFeeWrapper>
    );
  }

  return (
    <ApproveTransactionWrapper isErrorNetworkFee={isErrorNetworkFee || false}>
      <Text className='main-title' type='header4'>
        {title}
      </Text>

      <div className='logo-wrapper'>
        <img src={logo || DefaultFavicon} alt='logo img' />
      </div>

      <div className='domain-wrapper'>
        <span>{domain}</span>
      </div>

      {contracts.map((contract, index) => (
        <div key={index} className='info-table'>
          <div className='row'>
            <span className='key'>Contract</span>
            <span className='value'>{contract.type}</span>
          </div>
          <div className='row'>
            <span className='key'>Function</span>
            <span className='value'>{contract.function}</span>
          </div>
        </div>
      ))}

      <div className={hasMemo ? 'memo-wrapper row' : 'memo-wrapper editable row'}>
        <span className='key'>Memo:</span>
        {hasMemo ? (
          <span className={'value'}>{memo}</span>
        ) : (
          <input
            type='text'
            className={'value'}
            value={memo}
            onChange={onChangeMemo}
            autoComplete='off'
            placeholder='(Optional)'
          />
        )}
      </div>

      <NetworkFee
        value={networkFee?.amount || ''}
        denom={networkFee?.denom || ''}
        isError={isErrorNetworkFee}
        errorMessage='Insufficient network fee'
        onClickSetting={onClickNetworkFeeSetting}
      />

      <div className='transaction-data-wrapper'>
        <Button
          hierarchy='custom'
          bgColor='transparent'
          className='visible-button'
          onClick={(): void => onToggleTransactionData(!opened)}
        >
          {opened ? (
            <>
              <>Hide Transaction Data</>
              <img src={IconArraowUp} />
            </>
          ) : (
            <>
              <>View Transaction Data</>
              <img src={IconArraowDown} />
            </>
          )}
        </Button>

        {opened && (
          <div className='textarea-wrapper'>
            <textarea
              className='raw-info-textarea'
              value={transactionData}
              readOnly
              draggable={false}
            />
          </div>
        )}
      </div>

      <BottomFixedButtonGroup
        filled
        leftButton={{
          text: 'Cancel',
          onClick: onClickCancel,
        }}
        rightButton={{
          primary: true,
          disabled: isErrorNetworkFee,
          text: 'Approve',
          onClick: onClickConfirm,
        }}
      />
    </ApproveTransactionWrapper>
  );
};
