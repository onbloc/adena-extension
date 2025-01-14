import React, { useState } from 'react';
import styled, { css, CSSProp } from 'styled-components';

import { isSeparatePopupWindow } from '@common/utils/browser-utils';
import { Button, Text } from '@components/atoms';
import { TitleWithDesc } from '@components/molecules';
import useAppNavigate from '@hooks/use-app-navigate';
import { useWalletContext } from '@hooks/use-context';
import mixins from '@styles/mixins';
import { RoutePath } from '@types';

const text = {
  title: 'You’re All Set!',
  desc: 'Click on the Start button to\nlaunch Adena.',
};

const popupStyle = css`
  ${mixins.flex({ justify: 'flex-start' })};
  max-width: 380px;
  min-height: 514px;
  padding-top: 50px;
`;

const defaultStyle = css`
  ${mixins.flex({ justify: 'space-between' })};
  width: 100%;
  height: 100%;
  padding-top: 50px;
`;

const Wrapper = styled.main<{ isPopup: boolean }>`
  ${({ isPopup }): CSSProp => (isPopup ? popupStyle : defaultStyle)};
`;

export const LaunchAdena = (): JSX.Element => {
  const { navigate, params } = useAppNavigate<RoutePath.LaunchAdena>();

  const { initWallet, initNetworkMetainfos } = useWalletContext();
  const [clicked, setClicked] = useState(false);

  const handleNextButtonClick = (): void => {
    if (clicked) {
      return;
    }

    setClicked(true);
    if (params.type === 'GOOGLE' || params.type === 'LEDGER') {
      window.close();
    }

    Promise.all([initWallet(), initNetworkMetainfos()]).then(() => {
      if (isSeparatePopupWindow()) {
        window.close();
      }

      navigate(RoutePath.Wallet);
      setClicked(false);
    });
  };

  return (
    <Wrapper isPopup={params.type !== 'SEED'}>
      <TitleWithDesc title={text.title} desc={text.desc} />
      <Button fullWidth onClick={handleNextButtonClick} margin='auto 0px 0px'>
        <Text type='body1Bold'>Start</Text>
      </Button>
    </Wrapper>
  );
};
