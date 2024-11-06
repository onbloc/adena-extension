import AddPackageIcon from '@assets/addpkg.svg';
import UnknownTokenIcon from '@assets/common-unknown-token.svg';
import ContractIcon from '@assets/contract.svg';
import FailedIcon from '@assets/failed.svg';
import SuccessIcon from '@assets/success.svg';
import { TokenBalance } from '@components/molecules';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { TransactionHistoryListItemWrapper } from './transaction-history-list-item.styles';

export interface TransactionHistoryListItemProps {
  hash: string;
  logo?: string;
  type: 'TRANSFER' | 'TRANSFER_GRC721' | 'ADD_PACKAGE' | 'CONTRACT_CALL' | 'MULTI_CONTRACT_CALL';
  status: 'SUCCESS' | 'FAIL';
  title: string;
  description?: string;
  extraInfo?: string;
  amount: {
    value: string;
    denom: string;
  };
  valueType: 'DEFAULT' | 'ACTIVE' | 'BLUR';
  queryGRC721TokenUri?: (
    packagePath: string,
    tokenId: string,
    options?: UseQueryOptions<string | null, Error>,
  ) => UseQueryResult<string | null>;
  onClickItem: (hash: string) => void;
}

const TransactionHistoryListItem: React.FC<TransactionHistoryListItemProps> = ({
  hash,
  logo,
  type,
  status,
  title,
  extraInfo,
  description,
  amount,
  valueType,
  queryGRC721TokenUri,
  onClickItem,
}) => {
  const tokenUriQuery =
    type === 'TRANSFER_GRC721' && queryGRC721TokenUri ? queryGRC721TokenUri(logo || '', '0') : null;

  const getLogoImage = useCallback(() => {
    if (type === 'TRANSFER_GRC721' && tokenUriQuery) {
      return tokenUriQuery?.data || `${UnknownTokenIcon}`;
    }

    if (type === 'ADD_PACKAGE') {
      return `${AddPackageIcon}`;
    }
    if (type === 'CONTRACT_CALL') {
      return `${ContractIcon}`;
    }
    if (type === 'MULTI_CONTRACT_CALL') {
      return `${ContractIcon}`;
    }
    if (!logo) {
      return `${UnknownTokenIcon}`;
    }
    return `${logo}`;
  }, [type, logo, tokenUriQuery]);

  const getValueTypeClassName = useCallback(() => {
    if (valueType === 'ACTIVE') {
      return 'active';
    }
    if (valueType === 'BLUR') {
      return 'blur';
    }
    return '';
  }, [valueType]);

  return (
    <TransactionHistoryListItemWrapper onClick={(): void => onClickItem(hash)}>
      <div className='logo-wrapper'>
        <img className='logo' src={getLogoImage()} alt='logo image' />
        <img
          className='badge'
          src={status === 'SUCCESS' ? SuccessIcon : FailedIcon}
          alt='status badge'
        />
      </div>

      <div className='title-wrapper'>
        <span className={description ? 'title' : 'title extend'}>
          <span className='info'>{title}</span>
          {extraInfo && <span className='extra-info'>{extraInfo}</span>}
        </span>
        {description && <span className='description'>{description}</span>}
      </div>

      <div className={`value-wrapper ${getValueTypeClassName()}`}>
        {type === 'MULTI_CONTRACT_CALL' ? (
          <span className='value more'>More</span>
        ) : type === 'TRANSFER_GRC721' ? (
          <span className='value grc721'>{`${amount.denom} #${amount.value}`}</span>
        ) : (
          <TokenBalance
            value={amount.value}
            denom={amount.denom}
            fontStyleKey='body2Reg'
            minimumFontSize='11px'
            orientation='HORIZONTAL'
          />
        )}
      </div>
    </TransactionHistoryListItemWrapper>
  );
};

export default TransactionHistoryListItem;
