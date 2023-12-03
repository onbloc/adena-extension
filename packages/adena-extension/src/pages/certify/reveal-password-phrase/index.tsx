import CancelAndConfirmButton from '@components/buttons/cancel-and-confirm-button';
import DefaultInput from '@components/default-input';
import WarningBox from '@components/warning/warning-box';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { CSSProp } from 'styled-components';
import Text from '@components/text';
import TermsCheckbox from '@components/terms-checkbox';
import { RoutePath } from '@router/path';
import { useAdenaContext } from '@hooks/use-context';
import { ErrorText } from '@components/error-text';

const TermsAText = 'Anyone with the phrase will have full control over my funds.';
const TermsBText = 'I will never share my seed phrase with anyone.';

export const RevealPasswoardPhrase = (): JSX.Element => {
  const { walletService } = useAdenaContext();
  const navigate = useNavigate();
  const backButtonClick = (): void => navigate(-1);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [termsA, setTermsA] = useState(false);
  const [termsB, setTermsB] = useState(false);
  const disabled = termsA && termsB && pwd;
  const [clicked, setClicked] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPwd(e.target.value);
    setError(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && termsA && termsB && pwd) {
      confirmButtonClick();
    }
  };

  const termsAChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTermsA((prev: boolean) => !prev);
  };

  const termsBChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTermsB((prev: boolean) => !prev);
  };

  const confirmButtonClick = async (): Promise<void> => {
    if (clicked) {
      return;
    }
    if (!termsA) {
      return;
    }
    if (!termsB) {
      return;
    }
    setClicked(true);

    const equalPassword = await walletService.equalsPassword(pwd);
    if (!equalPassword) {
      setErrorMessage('Invalid Password');
      setError(true);
      setClicked(false);
      return;
    }
    navigate(RoutePath.RevealPrivatePhrase);
    setClicked(false);
  };

  return (
    <Wrapper>
      <Text type='header4'>Reveal Seed Phrase</Text>
      <WarningBox type='revealPassword' margin='12px 0px 20px' />
      <DefaultInput
        type='password'
        placeholder='Password'
        value={pwd}
        onChange={onChange}
        onKeyDown={onKeyDown}
        error={error}
      />
      {error && <ErrorText text={errorMessage} />}
      <TermsWrap>
        <TermsCheckbox
          checked={termsA}
          onChange={termsAChange}
          tabIndex={2}
          id='terms-A'
          text={TermsAText}
          checkboxPos='TOP'
          className='terms-A'
        />
        <TermsCheckbox
          checked={termsB}
          onChange={termsBChange}
          tabIndex={3}
          id='terms-B'
          text={TermsBText}
          checkboxPos='TOP'
        />
        <CancelAndConfirmButton
          cancelButtonProps={{ onClick: backButtonClick }}
          confirmButtonProps={{
            onClick: confirmButtonClick,
            text: 'Next',
            props: { disabled: !disabled },
          }}
        />
      </TermsWrap>
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

const TermsWrap = styled.div`
  margin-top: auto;
  .terms-A {
    margin-bottom: 13px;
  }
`;
