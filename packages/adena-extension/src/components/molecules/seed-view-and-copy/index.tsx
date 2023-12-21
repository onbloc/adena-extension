import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Text, Button, Copy } from '@components/atoms';
import theme from '@styles/theme';
import mixins from '@styles/mixins';

interface SeedViewAndCopyProps {
  showBlurScreen: boolean;
  setShowBlurScreen: React.Dispatch<React.SetStateAction<boolean>>;
  copyStr: string;
  toggleText: string;
}

export const SeedViewAndCopy = ({
  showBlurScreen,
  setShowBlurScreen,
  copyStr,
  toggleText,
}: SeedViewAndCopyProps): JSX.Element => {
  const blurScreenHandler = useCallback(() => {
    setShowBlurScreen((prev: boolean) => !prev);
  }, [showBlurScreen]);

  return (
    <Wrapper>
      <ButtonStyle bgColor={theme.color.neutral[6]} onClick={blurScreenHandler}>
        <Text type='body2Reg'>{showBlurScreen ? `View ${toggleText}` : `Hide ${toggleText}`}</Text>
      </ButtonStyle>
      <Copy copyStr={copyStr} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flex('row', 'center', 'space-between')};
  width: 100%;
  margin: 12px auto auto;
  padding: 0px 45px;
`;

const ButtonStyle = styled(Button)`
  ${mixins.flex('row', 'center', 'center')};
  height: 25px;
  border-radius: 12.5px;
  padding: 0px 12px;
  transition: background-color 0.4s ease;
  &:hover {
    background-color: ${theme.color.neutral[11]};
  }
`;
