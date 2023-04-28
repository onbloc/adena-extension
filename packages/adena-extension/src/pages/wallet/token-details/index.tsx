import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { LeftArrowBtn } from '@components/buttons/arrow-buttons';
import Text from '@components/text';
import etc from '../../../assets/etc.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import DubbleButton from '@components/buttons/double-button';
import { StaticTooltip } from '@components/tooltips';
import theme from '@styles/theme';
import { useCurrentAccount } from '@hooks/use-current-account';
import LoadingTokenDetails from '@components/loading-screen/loading-token-details';
import { useTokenBalance } from '@hooks/use-token-balance';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TokenBalance } from '@states/balance';
import { TransactionHistoryMapper } from '@repositories/transaction/mapper/transaction-history-mapper';
import { useTokenMetainfo } from '@hooks/use-token-metainfo';
import { useAdenaContext } from '@hooks/use-context';
import TransactionHistory from '@components/transaction-history/transaction-history/transaction-history';
import UnknownTokenIcon from '@assets/common-unknown-token.svg';
import HighlightNumber from '@components/common/highlight-number/highlight-number';

const Wrapper = styled.main`
  ${({ theme }) => theme.mixins.flexbox('column', 'flex-start', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 24px;
  padding-bottom: 84px;
  overflow-y: auto;
  .gnot-title {
    width: 100%;
    text-align: center;
    margin: 0px auto;
    line-height: 36px;
  }
  .desc {
    position: absolute;
    bottom: 153px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .balance-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const HeaderWrap = styled.div`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  & > button {
    position: absolute;
    left: 0;
  }
`;

const EtcIcon = styled.div`
  position: absolute;
  right: 0px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  &.show-tooltip {
    background-color: ${({ theme }) => theme.color.neutral[6]};
    & > .static-tooltip {
      visibility: visible;
      transition: all 0.1s ease-in-out;
      transform: scale(1);
    }
  }
`;

export const TokenDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [etcClicked, setEtcClicked] = useState(false);
  const { currentAccount } = useCurrentAccount();
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>(state);
  const [balance, setBalance] = useState(tokenBalance.amount.value);
  const { currentAddress } = useCurrentAccount();
  const { convertDenom, getTokenImage } = useTokenMetainfo();
  const { updateBalanceAmountByAccount } = useTokenBalance();
  const { transactionHistoryService } = useAdenaContext();
  const [bodyElement, setBodyElement] = useState<HTMLBodyElement | undefined>();
  const [loadingNextFetch, setLoadingNextFetch] = useState(false);
  const {
    status,
    isLoading,
    isFetching,
    data,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery(
    ['history/grc20-token-history', currentAddress, tokenBalance.pkgPath],
    ({ pageParam = 0 }) => fetchTokenHistories(pageParam),
    {
      getNextPageParam: (lastPage, allPosts) => {
        const from = allPosts.reduce((sum, { txs }) => sum + txs.length, 0);
        return lastPage.next ? from : undefined;
      },
    },
  );

  useEffect(() => {
    if (currentAccount) {
      updateBalanceAmountByAccount(currentAccount);
    }
  }, [currentAccount]);

  useEffect(() => {
    if (currentAddress) {
      const historyFetchTimer = setInterval(() => {
        refetch({ refetchPage: (page, index) => index === 0 })
      }, 10 * 1000);
      return () => clearInterval(historyFetchTimer);
    }
  }, [currentAddress, refetch]);

  useEffect(() => {
    if (loadingNextFetch && !isLoading && !isFetching) {
      fetchNextPage().then(() => setLoadingNextFetch(false));
    }
  }, [loadingNextFetch, isLoading, isFetching]);

  useEffect(() => {
    if (document.getElementsByTagName('body').length > 0) {
      setBodyElement(document.getElementsByTagName('body')[0]);
    }
  }, [document.getElementsByTagName('body')]);

  useEffect(() => {
    bodyElement?.addEventListener('scroll', onScrollListener);
    return () => bodyElement?.removeEventListener('scroll', onScrollListener);
  }, [bodyElement]);

  const onScrollListener = () => {
    if (bodyElement) {
      const remain = bodyElement.offsetHeight - bodyElement.scrollTop;
      if (remain < 20) {
        setLoadingNextFetch(true);
      }
    }
  };

  const fetchTokenHistories = async (pageParam: number) => {
    if (!currentAddress) {
      return {
        hits: 0,
        next: false,
        txs: []
      };
    }
    const size = 20;
    const histories = tokenBalance.type === 'NATIVE' ?
      await transactionHistoryService.fetchAllTransactionHistory(currentAddress, pageParam, size) :
      await transactionHistoryService.fetchGRC20TransactionHistory(currentAddress, tokenBalance.pkgPath, pageParam, size);
    const txs = histories.txs.map(transaction => {
      return {
        ...transaction,
        logo: getTokenImage(transaction.amount.denom) || `${UnknownTokenIcon}`,
        amount: convertDenom(transaction.amount.value, transaction.amount.denom, 'COMMON')
      }
    });
    return {
      hits: histories.hits,
      next: histories.next,
      txs: txs
    }
  };

  const onClickItem = useCallback((hash: string) => {
    const transactions = TransactionHistoryMapper.queryToDisplay(data?.pages ?? []).flatMap(group => group.transactions) ?? [];
    const transactionInfo = transactions.find(transaction => transaction.hash === hash);
    if (transactionInfo) {
      navigate(RoutePath.TransactionDetail, {
        state: transactionInfo
      })
    }
  }, [data]);

  const handlePrevButtonClick = () => navigate(RoutePath.Wallet);
  const DepositButtonClick = () => navigate(RoutePath.Deposit, { state: { type: 'token', tokenMetainfo: tokenBalance } });
  const SendButtonClick = () => navigate(RoutePath.TransferInput, { state: tokenBalance });
  const etcButtonClick = () => setEtcClicked((prev: boolean) => !prev);

  const getTransactionInfoLists = useCallback(() => {
    return TransactionHistoryMapper.queryToDisplay(data?.pages ?? []);
  }, [data]);

  return (
    <Wrapper>
      <HeaderWrap>
        <LeftArrowBtn onClick={handlePrevButtonClick} />
        <Text type='header4'>{tokenBalance.name}</Text>
        <EtcIcon className={etcClicked ? 'show-tooltip' : ''} onClick={etcButtonClick}>
          <img src={etc} alt='View on Gnoscan' />
          <StaticTooltip
            tooltipText='View on Gnoscan'
            bgColor={theme.color.neutral[6]}
            posTop='28px'
            onClick={() => {
              window.open(
                `https://gnoscan.io/accounts/${currentAccount?.getAddress('g')
                }`,
                '_blank',
              );
            }}
          />
        </EtcIcon>
      </HeaderWrap>

      <div className='balance-wrapper'>
        <HighlightNumber
          value={balance}
          fontColor={theme.color.neutral[0]}
          fontStyleKey={'header2'}
          minimumFontSize={'24px'}
        />
      </div>

      <DubbleButton
        margin='20px 0px 25px'
        leftProps={{ onClick: DepositButtonClick, text: 'Deposit' }}
        rightProps={{
          onClick: SendButtonClick,
          text: 'Send',
        }}
      />
      {isLoading ? (
        <LoadingTokenDetails />
      ) : getTransactionInfoLists().length > 0 ? (
        <TransactionHistory
          status={status}
          transactionInfoLists={getTransactionInfoLists()}
          onClickItem={onClickItem}
        />
      ) : (
        <Text className='desc' type='body1Reg' color={theme.color.neutral[9]}>
          No transaction to display
        </Text>
      )}
    </Wrapper>
  );
};
