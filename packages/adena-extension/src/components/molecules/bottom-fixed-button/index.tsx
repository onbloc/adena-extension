import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Button, ButtonProps, Text } from '@components/atoms';
import mixins from '@styles/mixins';
import { getTheme } from '@styles/theme';

interface BottomFixedButtonProps {
  hierarchy?: ButtonProps['hierarchy'];
  onClick: () => unknown;
  text?: string;
}

export const BottomFixedButton = ({
  hierarchy = 'dark',
  onClick,
  text = 'Close',
}: BottomFixedButtonProps): JSX.Element => {
  const onClickButton = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <ButtonWrap>
      <Button fullWidth hierarchy={hierarchy} onClick={onClickButton}>
        <Text type='body1Bold'>{text}</Text>
      </Button>
    </ButtonWrap>
  );
};

const ButtonWrap = styled.div`
  ${mixins.flex('row', 'center', 'center')};
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 96px;
  padding: 0px 20px;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.4);
  background-color: ${getTheme('neutral', '_8')};
  z-index: 1;
`;
