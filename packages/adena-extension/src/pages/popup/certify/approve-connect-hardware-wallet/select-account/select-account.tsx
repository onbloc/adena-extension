import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  LedgerAccount,
  AdenaLedgerConnector,
  Account,
  LedgerKeyring,
  deserializeAccount,
  serializeAccount,
} from 'adena-module';

import IconAddSymbol from '@assets/add-symbol.svg';
import IconCheck from '@assets/check.svg';

import { Text, Button } from '@components/atoms';
import { TitleWithDesc } from '@components/molecules';
import { getTheme } from '@styles/theme';
import { formatAddress } from '@common/utils/client-utils';
import { RoutePath } from '@types';
import IconArrowDown from '@assets/arrowS-down-gray.svg';
import { useWalletContext } from '@hooks/use-context';
import { useNetwork } from '@hooks/use-network';
import mixins from '@styles/mixins';
import useAppNavigate from '@hooks/use-app-navigate';

const text = {
  title: 'Select Accounts',
};

const Wrapper = styled.main`
  ${mixins.flex({ justify: 'flex-start' })};
  width: 100%;
  height: 100%;
  padding: 24px 20px;
  margin: 0 auto;

  .title {
    ${mixins.flex({ align: 'normal', justify: 'normal' })};
    width: 100%;
  }

  .title > div {
    text-align: center;
    margin: 10px auto;
    justify-content: center;
    align-items: center;
  }

  .icon {
    width: 100px;
    height: 100px;
    margin: 10px auto;
  }
`;

const AccountListContainer = styled.div`
  ${mixins.flex({ align: 'normal', justify: 'normal' })};
  width: 320px;
  height: 166px;
  border-radius: 10px;
  border: 1px solid ${getTheme('neutral', '_7')};
  background-color: ${getTheme('neutral', '_9')};
  overflow: hidden;

  @keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .list-wrapper {
    ${mixins.flex({ align: 'normal', justify: 'normal' })};
    flex-shrink: 1;
    width: 100%;
    height: 100%;
    overflow: auto;

    .description {
      display: flex;
      width: 100%;
      padding: 20px;
      color: ${getTheme('neutral', 'a')};
      justify-content: center;
      align-items: center;
    }
  }

  .load-more-button {
    ${mixins.flex({ direction: 'row' })};
    flex-shrink: 0;
    width: 100%;
    height: 46px;
    color: ${getTheme('neutral', 'a')};
    background-color: ${getTheme('neutral', '_9')};
    border-top: 1px solid ${getTheme('neutral', '_7')};
    border-radius: 0;

    & .icon-loading {
      display: flex;
      width: 15px;
      height: 100%;
      align-items: center;
      justify-content: center;
      svg {
        animation: rotate 1.5s infinite;
      }
      circle {
        stroke: ${getTheme('neutral', 'a')};
        stroke-dasharray: 10;
        stroke-dashoffset: 7;
      }
    }

    & img {
      margin-left: 3px;
    }

    &:hover {
      background-color: ${getTheme('neutral', '_7')};
    }
  }

  .item {
    ${mixins.flex({ direction: 'row', justify: 'space-between' })};
    width: 100%;
    height: 46px;
    padding: 10px 20px;
    border-bottom: 1px solid ${getTheme('neutral', '_7')};

    .address {
      margin-right: 10px;
    }

    .path {
      color: ${getTheme('neutral', 'a')};
    }

    .check {
      display: inline-flex;
      width: 20px;
      height: 20px;
      border: 1px solid ${getTheme('neutral', '_5')};
      border-radius: 4px;
      cursor: pointer;

      img {
        display: none;
        width: 15px;
        height: 15px;
        margin: auto;
      }

      &.active,
      &.disabled {
        background-color: ${getTheme('primary', '_7')};
        border: 1px solid ${getTheme('primary', '_7')};
        img {
          display: block;
        }
      }

      &.disabled {
        position: relative;
        cursor: default;
        overflow: hidden;
        border: none;

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          display: block;
          background-color: black;
          opacity: 0.6;
        }
      }
    }
  }
`;

export const ApproveConnectHardwareWalletSelectAccount = (): JSX.Element => {
  const { wallet } = useWalletContext();
  const { currentNetwork } = useNetwork();
  const { params, navigate } = useAppNavigate<RoutePath.ApproveHardwareWalletSelectAccount>();
  const [selectAccountAddresses, setSelectAccountAddresses] = useState<Array<string>>([]);
  const [lastPath, setLastPath] = useState(-1);
  const [loadPath, setLoadPath] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const LEDGER_ACCOUNT_LOAD_SIZE = 5;
  const walletAccounts = wallet?.accounts ?? [];
  const addressPrefix = currentNetwork.addressPrefix;
  const [accountInfos, setAccountInfos] = useState<
    {
      index: number;
      address: string;
      hdPath: number;
      stored: boolean;
      selected: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (Array.isArray(params.accounts)) {
      initAccounts(params.accounts.map(deserializeAccount));
    }
  }, [location]);

  const initAccounts = async (accounts: Array<Account>): Promise<void> => {
    const lastPath = accounts.map((account) => account.toData().hdPath ?? 0).reverse()[0];
    setLastPath(lastPath);
    setAccounts(accounts);
  };

  const isStoredAccount = async (address: string): Promise<boolean> => {
    return (
      walletAccounts.find(
        async (account) => (await account.getAddress(addressPrefix)) === address,
      ) !== undefined
    );
  };

  const onClickSelectButton = (address: string): void => {
    if (selectAccountAddresses.includes(address)) {
      setSelectAccountAddresses(
        selectAccountAddresses.filter((selectAddress) => selectAddress !== address),
      );
      return;
    }
    setSelectAccountAddresses([...selectAccountAddresses, address]);
  };

  const onClickLoadMore = async (): Promise<void> => {
    setLoadPath(true);
    const accountPaths = Array.from(
      { length: LEDGER_ACCOUNT_LOAD_SIZE },
      (_, index) => index + lastPath + 1,
    );
    const transport = await AdenaLedgerConnector.openConnected();
    if (!transport) {
      setLoadPath(false);
      return;
    }
    const ledgerConnector = AdenaLedgerConnector.fromTransport(transport);
    const keyring = await LedgerKeyring.fromLedger(ledgerConnector);
    const ledgerAccounts = [];
    for (const hdPath of accountPaths) {
      const ledgerAccount = await LedgerAccount.createBy(keyring, `Ledger ${hdPath + 1}`, hdPath);
      ledgerAccounts.push(ledgerAccount);
    }
    await initAccounts([...accounts, ...ledgerAccounts]);
    await transport.close();
    setLoadPath(false);
  };

  const onClickNextButton = async (): Promise<void> => {
    const selectAccounts = accounts.filter(async (account) =>
      selectAccountAddresses.includes(await account.getAddress(addressPrefix)),
    );
    const savedAccounts: Array<Account> = [];

    selectAccounts.forEach(async (account) => {
      if (
        !(await walletAccounts.find(
          async (storedAccount) =>
            (await storedAccount.getAddress(addressPrefix)) ===
            (await account.getAddress(addressPrefix)),
        ))
      ) {
        account.name = `${wallet?.nextLedgerAccountName}`;
        savedAccounts.push(account);
      }
    });
    const resultSavedAccounts = savedAccounts.sort((account) => account.toData().hdPath ?? 0);

    const locationState = {
      accounts: resultSavedAccounts.map((account) => serializeAccount(account)),
    };

    const routePath =
      walletAccounts.length === 0
        ? RoutePath.ApproveHardwareWalletLedgerPassword
        : RoutePath.ApproveHardwareWalletFinish;

    navigate(routePath, { state: locationState });
  };

  const mapAccountInfo = async (
    account: Account,
    index: number,
  ): Promise<{
    index: number;
    address: string;
    hdPath: number;
    stored: boolean;
    selected: boolean;
  }> => {
    const address = await account.getAddress(addressPrefix);
    const hdPath = account.toData().hdPath ?? 0;
    const stored = await isStoredAccount(address);
    const selected = selectAccountAddresses.includes(address);
    return {
      index,
      address,
      hdPath,
      stored,
      selected,
    };
  };

  useEffect(() => {
    Promise.all(accounts.map(mapAccountInfo)).then(setAccountInfos);
  }, [accounts]);

  const renderAccountInfo = (accountInfo: {
    index: number;
    address: string;
    hdPath: number;
    stored: boolean;
    selected: boolean;
  }): JSX.Element => {
    const { index, address, hdPath, stored, selected } = accountInfo;
    return (
      <div className='item' key={index}>
        <div className='address-wrapper'>
          <span className='address'>{formatAddress(address)}</span>
          <span className='path'> {`m/44'/118'/0'/0/${hdPath}`}</span>
        </div>
        {stored ? (
          <span className={'check disabled'}>
            <img className='icon-check' src={IconCheck} alt='check-image' />
            <span className={'mask'}></span>
          </span>
        ) : (
          <span
            className={selected ? 'check active' : 'check'}
            onClick={(): void => onClickSelectButton(address)}
          >
            <img className='icon-check' src={IconCheck} alt='check-image' />
          </span>
        )}
      </div>
    );
  };

  const renderLoading = (): JSX.Element => {
    return (
      <div className='icon-loading'>
        <svg width='9' height='9' viewBox='0 0 9 9' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='4.5' cy='4.5' r='3.5' fill='current' />
        </svg>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className='title'>
        <img className='icon' src={IconAddSymbol} alt='logo-image' />
        <TitleWithDesc title={text.title} desc={''} />
      </div>

      <AccountListContainer>
        <div className='list-wrapper'>
          {accountInfos.length > 0 ? (
            accountInfos.map(renderAccountInfo)
          ) : (
            <span className='description'>{'No data to display'}</span>
          )}
        </div>
        <Button className='load-more-button' onClick={onClickLoadMore} disabled={loadPath}>
          {loadPath ? 'Loading' : 'Load more accounts'}
          {loadPath ? renderLoading() : <img src={IconArrowDown} />}
        </Button>
      </AccountListContainer>

      <Button
        fullWidth
        margin='auto 0px 0px'
        disabled={loadPath || selectAccountAddresses.length === 0}
        onClick={onClickNextButton}
      >
        <Text type='body1Bold'>Next</Text>
      </Button>
    </Wrapper>
  );
};