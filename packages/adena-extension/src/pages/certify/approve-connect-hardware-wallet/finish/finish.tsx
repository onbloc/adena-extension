import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { LedgerAccount, LedgerConnector, LedgerKeyring, deserializeAccount } from 'adena-module';

import { Text, Button } from '@components/atoms';
import { TitleWithDesc } from '@components/molecules';
import IconSuccessSymbol from '@assets/success-symbol.svg';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';
import mixins from '@styles/mixins';

const text = {
  title: 'Account Added',
  desc: 'You have successfully added your\nledger device account to Adena!\nPlease return to your extension to continue.',
};

const Wrapper = styled.main`
  ${mixins.flex('column', 'center', 'flex-start')};
  width: 100%;
  height: 100%;
  padding: 24px 20px;
  margin: 0 auto;

  .icon {
    width: 100px;
    height: 100px;
    margin: 20px auto;
  }

  div {
    text-align: center;
  }
`;

export const ApproveConnectHardwareWalletFinish = (): JSX.Element => {
  const { wallet, updateWallet } = useWalletContext();
  const { accountService } = useAdenaContext();
  const location = useLocation();

  const onClickDoneButton = async (): Promise<void> => {
    const { accounts } = location.state;
    if (!wallet) {
      return;
    }
    const transport = await LedgerConnector.openConnected();
    if (!transport) {
      return;
    }
    const deserializeAccounts: LedgerAccount[] = accounts.map(deserializeAccount);
    const keyring = await LedgerKeyring.fromLedger(new LedgerConnector(transport));
    const accountInfos = deserializeAccounts.map((account) => account.toData());
    const clone = wallet.clone();
    let currentAccount = null;
    for (const accountInfo of accountInfos) {
      const account = LedgerAccount.fromData({
        ...accountInfo,
        name: `Ledger ${accountInfo.hdPath + 1}`,
        keyringId: keyring.id,
      });
      clone.addKeyring(keyring);
      clone.addAccount(account);
      currentAccount = account;
    }
    if (currentAccount) {
      await accountService.changeCurrentAccount(currentAccount);
    }
    await updateWallet(clone);
    await transport.close();
    window.close();
  };

  return (
    <Wrapper>
      <img className='icon' src={IconSuccessSymbol} alt='logo-image' />
      <TitleWithDesc title={text.title} desc={text.desc} />
      <Button fullWidth margin='auto 0px 0px' onClick={onClickDoneButton}>
        <Text type='body1Bold'>Done</Text>
      </Button>
    </Wrapper>
  );
};
