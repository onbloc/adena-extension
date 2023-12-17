import React, { useMemo, useState } from 'react';
import styled, { CSSProp } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { Text, WarningBox, Button, ButtonHierarchy } from '@components/atoms';
import { SeedBox, SeedViewAndCopy } from '@components/molecules';
import { useWalletContext } from '@hooks/use-context';

export const RevealPrivatePhrase = (): JSX.Element => {
  const navigate = useNavigate();
  const { wallet } = useWalletContext();
  const [showBlurScreen, setShowBlurScreen] = useState(true);

  const seeds = useMemo(() => {
    const mnemonic = wallet?.mnemonic || '';
    return mnemonic.split(' ');
  }, [wallet?.mnemonic]);

  const doneButtonClick = (): void => {
    navigate(-2);
  };

  return (
    <Wrapper>
      <Text type='header4'>Reveal Seed Phrase</Text>
      <WarningBox type='revealPrivate' margin='12px 0px 20px' />
      <SeedBox seeds={seeds} scroll={false} hasBlurScreen={showBlurScreen} />
      <SeedViewAndCopy
        showBlurScreen={showBlurScreen}
        setShowBlurScreen={setShowBlurScreen}
        copyStr={seeds.join(' ')}
        toggleText='Seed Phrase'
      />
      <Button fullWidth hierarchy={ButtonHierarchy.Primary} onClick={doneButtonClick}>
        <Text type='body1Bold'>Done</Text>
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  ${({ theme }): CSSProp => theme.mixins.flexbox('column', 'flex-start', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 24px;
  overflow-y: auto;
`;
