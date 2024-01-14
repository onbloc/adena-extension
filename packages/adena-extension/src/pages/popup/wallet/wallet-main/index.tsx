import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import BigNumber from 'bignumber.js';

import { RoutePath } from '@types';
import { DoubleButton } from '@components/molecules';
import { useTokenBalance } from '@hooks/use-token-balance';
import MainTokenBalance from '@components/pages/main/main-token-balance/main-token-balance';
import TokenList from '@components/pages/wallet-main/token-list/token-list';
import MainManageTokenButton from '@components/pages/main/main-manage-token-button/main-manage-token-button';
import UnknownTokenIcon from '@assets/common-unknown-token.svg';
import { useCurrentAccount } from '@hooks/use-current-account';
import { WalletState } from '@states';
import { usePreventHistoryBack } from '@hooks/use-prevent-history-back';
import useAppNavigate from '@hooks/use-app-navigate';

const Wrapper = styled.main`
  padding-top: 14px;
  text-align: center;

  .token-balance-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .manage-token-button-wrapper {
    display: flex;
    margin: 24px auto 60px auto;
    align-items: center;
    justify-content: center;
  }
`;

export const WalletMain = (): JSX.Element => {
  usePreventHistoryBack();
  const { navigate } = useAppNavigate();
  const [state] = useRecoilState(WalletState.state);
  const { currentAccount } = useCurrentAccount();
  const { mainTokenBalance, displayTokenBalances, updateBalanceAmountByAccount } =
    useTokenBalance();

  const DepositButtonClick = (): void =>
    navigate(RoutePath.WalletSearch, { state: { type: 'deposit' } });
  const SendButtonClick = (): void => navigate(RoutePath.WalletSearch, { state: { type: 'send' } });

  useEffect(() => {
    if (state === 'CREATE') {
      navigate(RoutePath.Home);
    }
  }, [state]);

  useEffect(() => {
    if (currentAccount) {
      updateBalanceAmountByAccount(currentAccount);
    }
  }, [currentAccount]);

  const tokens = displayTokenBalances
    .filter((tokenBalance) => tokenBalance.display)
    .map((tokenBalance) => {
      return {
        tokenId: tokenBalance.tokenId,
        logo: tokenBalance.image || `${UnknownTokenIcon}`,
        name: tokenBalance.name,
        balanceAmount: {
          value: BigNumber(tokenBalance.amount.value).toFormat(),
          denom: tokenBalance.amount.denom,
        },
      };
    });

  const onClickTokenListItem = useCallback(
    (tokenId: string) => {
      const tokenBalance = displayTokenBalances.find(
        (tokenBalance) => tokenBalance.tokenId === tokenId,
      );
      if (!tokenBalance) {
        window.alert('Token not found');
        return;
      }
      navigate(RoutePath.TokenDetails, {
        state: { tokenBalance },
      });
    },
    [tokens],
  );

  const onClickManageButton = useCallback(() => {
    navigate(RoutePath.ManageToken);
  }, []);

  return (
    <Wrapper>
      <div className='token-balance-wrapper'>
        <MainTokenBalance
          amount={{
            value: BigNumber(mainTokenBalance?.value ?? '0').toFormat(),
            denom: mainTokenBalance?.denom ?? 'GNOT',
          }}
        />
      </div>

      <DoubleButton
        margin='14px 0px 30px'
        leftProps={{ onClick: DepositButtonClick, text: 'Deposit' }}
        rightProps={{
          onClick: SendButtonClick,
          text: 'Send',
        }}
      />

      <div className='token-list-wrapper'>
        <TokenList tokens={tokens} onClickTokenItem={onClickTokenListItem} />
      </div>

      <div className='manage-token-button-wrapper'>
        <MainManageTokenButton onClick={onClickManageButton} />
      </div>
    </Wrapper>
  );
};