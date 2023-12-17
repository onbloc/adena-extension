import React from 'react';
import styled, { CSSProp, css } from 'styled-components';
import { useLocation } from 'react-router-dom';

import { Text, DefaultInput, ErrorText, Button, ButtonHierarchy } from '@components/atoms';
import { TitleWithDesc, TermsCheckbox } from '@components/molecules';
import { useCreatePassword } from '@hooks/certify/use-create-password';

const text = {
  title: 'Create\na Password',
  desc: 'This will be used to unlock your wallet.',
};

const popupStyle = css`
  ${({ theme }): CSSProp => theme.mixins.flexbox('column', 'center', 'flex-start')};
  max-width: 380px;
  min-height: 514px;
  padding-top: 50px;
`;

const defaultStyle = css`
  ${({ theme }): CSSProp => theme.mixins.flexbox('column', 'center', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 50px;
`;

const Wrapper = styled.main<{ isPopup: boolean }>`
  ${({ isPopup }): CSSProp => (isPopup ? popupStyle : defaultStyle)};
`;

const FormBox = styled.div`
  margin-top: 20px;
  input + input {
    margin-top: 12px;
  }
`;

export const CreatePassword = (): JSX.Element => {
  const { pwdState, confirmPwdState, termsState, errorMessage, buttonState, onKeyDown } =
    useCreatePassword();
  const location = useLocation();
  const handleLinkClick = (): Window | null => window.open('https://adena.app/terms', '_blank');

  return (
    <Wrapper isPopup={location?.state?.type !== 'SEED'}>
      <TitleWithDesc title={text.title} desc={text.desc} />
      <FormBox>
        <DefaultInput
          type='password'
          name='pwd'
          placeholder='Password'
          onChange={pwdState.onChange}
          onKeyDown={onKeyDown}
          error={pwdState.error}
          ref={pwdState.ref}
        />
        <DefaultInput
          type='password'
          name='confirmPwd'
          placeholder='Confirm Password'
          onChange={confirmPwdState.onChange}
          onKeyDown={onKeyDown}
          error={confirmPwdState.error}
        />
        {errorMessage && <ErrorText text={errorMessage} />}
      </FormBox>
      <TermsCheckbox
        checked={termsState.value}
        onChange={termsState.onChange}
        text='I agree to the&nbsp;'
        tabIndex={3}
      >
        <button className='terms-button' type='button' onClick={handleLinkClick} tabIndex={4}>
          Terms of Use.
        </button>
      </TermsCheckbox>
      <Button
        fullWidth
        hierarchy={ButtonHierarchy.Primary}
        disabled={buttonState.disabled}
        onClick={buttonState.onClick}
        tabIndex={5}
      >
        <Text type='body1Bold'>Save</Text>
      </Button>
    </Wrapper>
  );
};
