import React, { useEffect } from 'react';
import styled, { CSSProp } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import logo from '@assets/logo-default.svg';
import { Text, Button, ButtonHierarchy } from '@components/atoms';
import { DoubleButton } from '@components/molecules';
import { RoutePath } from '@router/path';
import theme from '@styles/theme';
import { useLoadAccounts } from '@hooks/use-load-accounts';
import { existsPopups } from '@inject/message/methods';

import GoogleSignInButton from './google-signin-button';

export const WalletCreate = (): JSX.Element => {
  const navigate = useNavigate();

  const { state } = useLoadAccounts();

  useEffect(() => {
    switch (state) {
      case 'NONE':
        break;
      case 'FINISH':
        navigate(RoutePath.Wallet);
        break;
      case 'LOGIN':
        navigate(RoutePath.Login);
        break;
      default:
        break;
    }
  }, [state]);

  const onCreateButtonClick = (): void => {
    navigate(RoutePath.YourSeedPhrase);
  };

  const importWalletHandler = (): void => {
    navigate(RoutePath.EnterSeedPhrase, {
      state: {
        from: 'wallet-create',
      },
    });
  };

  const ConnectLedgerHandler = async (): Promise<void> => {
    const isPopup = await existsPopups();
    if (isPopup) {
      return;
    }

    const popupOption: chrome.tabs.CreateProperties = {
      url: chrome.runtime.getURL(`popup.html#${RoutePath.ApproveHardwareWalletConnect}`),
      active: true,
    };

    window.close();
    chrome.tabs.create(popupOption);
  };

  const googleLoginHandler = async (): Promise<void> => {
    const isPopup = await existsPopups();
    if (isPopup) {
      return;
    }

    const popupOption: chrome.windows.CreateData = {
      url: chrome.runtime.getURL(`popup.html#${RoutePath.GoogleConnect}`),
      type: 'popup',
      height: 590,
      width: 380,
      left: 800,
      top: 300,
    };

    window.close();
    chrome.windows.create(popupOption);
  };

  return (
    <Wrapper>
      <Logo src={logo} alt='logo' />
      <GoogleSignInButton onClick={googleLoginHandler} margin='auto auto 3px' />
      <PoweredByWeb3AuthWihDivider />
      <Button fullWidth hierarchy={ButtonHierarchy.Primary} onClick={onCreateButtonClick}>
        <Text type='body1Bold'>Create New Wallet</Text>
      </Button>
      <DoubleButton
        margin='12px 0px 0px'
        leftProps={{
          onClick: importWalletHandler,
          text: 'Import Wallet',
          hierarchy: ButtonHierarchy.Normal,
          fontType: 'body2Bold',
        }}
        rightProps={{
          onClick: ConnectLedgerHandler,
          text: 'Connect Ledger',
          hierarchy: ButtonHierarchy.Normal,
          fontType: 'body2Bold',
        }}
      />
    </Wrapper>
  );
};

const PoweredByWeb3AuthWihDivider = (): JSX.Element => (
  <>
    <Text type='light11' color={theme.color.neutral[9]}>
      Powered by Web3Auth
    </Text>
    <Divider />
  </>
);

const Divider = styled.span`
  width: calc(100% - 48px);
  height: 1px;
  background-color: ${({ theme }): string => theme.color.neutral[4]};
  margin: 20px 0px;
`;

const Wrapper = styled.main`
  ${({ theme }): CSSProp => theme.mixins.flexbox('column', 'center', 'space-between')};
  width: 100%;
  height: 100%;
  & > header {
    height: 48px;
  }
  /* & > button:first-of-type {
    margin-top: auto;
    margin-bottom: 12px;
  } */
`;

const Logo = styled.img`
  padding-top: 33px;
`;
