import React, { ReactElement, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { useQuery } from '@tanstack/react-query';

import { Row, View, WebImg, WebMain, WebText } from '@components/atoms';
import useAppNavigate from '@hooks/use-app-navigate';
import { RoutePath } from '@types';

import welcomeJson from '@assets/web/lottie/welcome.json';
import AnimationAddAccount from '@assets/web/lottie/add-account.gif';
import { useAdenaContext } from '@hooks/use-context';
import WebMainButton from '@components/atoms/web-main-button';
import IconHardwareWallet from '@assets/icon-hardware-wallet';
import IconAirgap from '@assets/icon-airgap';
import IconThunder from '@assets/icon-thunder';
import Lottie from '@components/atoms/lottie';

const StyledAnimationWrapper = styled.div`
  display: block;
  height: 88px;
  margin-bottom: 4px;
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
    <WebMain>
      {existWallet ? (
        <React.Fragment>
          <StyledAnimationWrapper>
            {/* TODO: Change to Lottie JSON
              <Lottie
                speed={1}
                height={88}
                animationData={AnimationAddAccount}
                visibleSize={264}
              /> 
            */}
            <View style={{ marginTop: -176 }}>
              <WebImg src={AnimationAddAccount} height={264} />
            </View>
          </StyledAnimationWrapper>
          <View style={{ rowGap: 16 }}>
            <WebText type='headline1'>{'Add Account'}</WebText>
            <WebText type='body2' color={theme.webNeutral._500} style={{ whiteSpace: 'nowrap' }}>
              {'Select a method to add a new account to Adena.'}
            </WebText>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledAnimationWrapper>
            <Lottie
              speed={1}
              height={88}
              animationData={welcomeJson}
              visibleSize={264}
            />
          </StyledAnimationWrapper>
          <View style={{ rowGap: 16 }}>
            <WebText type='headline1'>{'Welcome to Adena!'}</WebText>
            <WebText type='body2' color={theme.webNeutral._500} style={{ whiteSpace: 'nowrap' }}>
              {'The only wallet you need for Gnoland with unparalleled security.'}
            </WebText>
          </View>
        </React.Fragment>
      )}

      <Row style={{ width: '100%', columnGap: 12, marginTop: 8 }}>
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
