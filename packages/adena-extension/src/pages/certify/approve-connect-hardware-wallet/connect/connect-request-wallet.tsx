import React from 'react';
import styled, { CSSProp } from 'styled-components';
import Button, { ButtonHierarchy } from '@components/buttons/button';
import TitleWithDesc from '@components/title-with-desc';
import Text from '@components/text';
import IconConnectRequestHardwareWallet from '@assets/connect-request-hardware-wallet.svg';

const text = {
  title: 'Open Cosmos App\nin Your Ledger',
  desc: 'Please make sure the Cosmos App is\nopened in your ledger device.',
};

const Wrapper = styled.main`
  ${({ theme }): CSSProp => theme.mixins.flexbox('column', 'center', 'flex-start')};
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

interface Props {
  onClickClose: () => void;
}

export const ConnectRequestWallet: React.FC<Props> = ({ onClickClose }) => {
  return (
    <Wrapper>
      <img className='icon' src={IconConnectRequestHardwareWallet} alt='logo-image' />
      <TitleWithDesc title={text.title} desc={text.desc} />
      <Button
        fullWidth
        hierarchy={ButtonHierarchy.Dark}
        margin='auto 0px 0px'
        onClick={onClickClose}
      >
        <Text type='body1Bold'>Close</Text>
      </Button>
    </Wrapper>
  );
};
