import React, { ReactElement } from 'react';
import styled from 'styled-components';

import { Text, Button, ButtonProps } from '@components/atoms';
import mixins from '@styles/mixins';

interface DefaultButtonProps {
  onClick: () => void;
  props?: React.ComponentPropsWithoutRef<'button'>;
}

interface ConfirmButtonProps extends DefaultButtonProps {
  text: string;
  hierarchy?: ButtonProps['hierarchy'];
}

interface CancelAndConfirmLocation {
  cancelButtonProps: DefaultButtonProps;
  confirmButtonProps: ConfirmButtonProps;
}

const Wrapper = styled.div`
  margin-top: auto;
  ${mixins.flex('row', 'center', 'space-between')};
  width: 100%;
  gap: 10px;
`;

export const CancelAndConfirmButton = ({
  cancelButtonProps,
  confirmButtonProps,
}: CancelAndConfirmLocation): ReactElement => {
  return (
    <Wrapper>
      <Button
        fullWidth
        hierarchy='dark'
        onClick={cancelButtonProps.onClick}
        {...cancelButtonProps.props}
      >
        <Text type='body1Bold'>Cancel</Text>
      </Button>
      <Button
        fullWidth
        hierarchy={confirmButtonProps.hierarchy ?? 'primary'}
        onClick={confirmButtonProps.onClick}
        {...confirmButtonProps.props}
      >
        <Text type='body1Bold'>{confirmButtonProps.text}</Text>
      </Button>
    </Wrapper>
  );
};
