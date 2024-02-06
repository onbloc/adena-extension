import { ReactElement, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { useQuery } from '@tanstack/react-query';

import { Row, View, WebMain, WebText } from '@components/atoms';
import useAppNavigate from '@hooks/use-app-navigate';
import { RoutePath } from '@types';

import welcomeJson from '@assets/web/lottie/welcome.json';
import { useAdenaContext } from '@hooks/use-context';
import WebMainButton from '@components/atoms/web-main-button';
import IconHardwareWallet from '@assets/icon-hardware-wallet';
import IconAirgap from '@assets/icon-airgap';
import IconThunder from '@assets/icon-thunder';
import Lottie from '@components/atoms/lottie';

const StyledAnimationWrapper = styled.div`
  display: block;
  height: 88px;
  overflow: visible;
`;

const LandingScreen = (): ReactElement => {
  const { navigate } = useAppNavigate();
  const { walletService } = useAdenaContext();
  const theme = useTheme();

  const { data: existWallet } = useQuery(
    ['existWallet', walletService],
    async () => walletService.existsWallet(),
    {},
  );

  const moveSetupAirgapScreen = useCallback(() => {
    navigate(RoutePath.WebSetupAirgap);
  }, []);

  return (
    <WebMain spacing={344}>
      <StyledAnimationWrapper>
        <Lottie
          style={{ height: 320, marginTop: -320 }}
          speed={1}
          animationData={welcomeJson}
        />
      </StyledAnimationWrapper>
      <View style={{ rowGap: 16 }}>
        <WebText type='headline1'>{existWallet ? 'Add Account' : 'Welcome to Adena'}</WebText>
        <WebText type='body2' color={theme.webNeutral._500}>
          {existWallet
            ? 'Select a method to add a new account to Adena.'
            : 'The only wallet you need for Gnoland with unparalleled security'}
        </WebText>
      </View>

      <Row style={{ width: '100%', columnGap: 12 }}>
        <WebMainButton
          figure='primary'
          iconElement={<IconHardwareWallet />}
          text='Hardware Wallet'
          onClick={(): void => {
            navigate(RoutePath.WebSelectHardWallet);
          }}
        />
        <WebMainButton
          figure='secondary'
          iconElement={<IconAirgap />}
          text='Airgap Account'
          onClick={moveSetupAirgapScreen}
        />
        <WebMainButton
          figure='tertiary'
          iconElement={<IconThunder />}
          text='Advanced Options'
          onClick={(): void => {
            navigate(RoutePath.WebAdvancedOption);
          }}
        />
      </Row>
    </WebMain>
  );
};

export default LandingScreen;
