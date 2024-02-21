import { useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

import {
  WebInput,
  WebMain,
  View,
  Pressable,
  WebButton,
  Row,
  WebErrorText,
  WebText,
} from '@components/atoms';
import { TermsCheckbox, WebTitleWithDescription } from '@components/molecules';
import { WebMainHeader } from '@components/pages/web/main-header';
import { useCreatePasswordScreen } from '@hooks/web/common/use-create-password-screen';
import { ADENA_TERMS_PAGE } from '@common/constants/resource.constant';
import { EvaluatePasswordResult } from '@common/utils/password-utils';
import useLink from '@hooks/use-link';
import useAppNavigate from '@hooks/use-app-navigate';
import { RoutePath } from '@types';
import IconConfirmCheck from '@assets/icon-confirm-check';

const StyledContainer = styled(View)`
  width: 100%;
  height: 330px;
  row-gap: 24px;
  align-items: flex-start;
`;

const StyledInputContainer = styled(View)`
  width: 100%;
  row-gap: 16px;
`;

const StyledInputBox = styled(View)`
  width: 100%;
  row-gap: 12px;
`;

const StyledInputWrapper = styled(Row)`
  width: 100%;
  gap: 12px;
`;

const CreatePasswordScreen = (): JSX.Element => {
  const { openLink } = useLink();
  const {
    indicatorInfo,
    passwordState,
    confirmPasswordState,
    termsState,
    errorMessage,
    buttonState,
    onKeyDown,
  } = useCreatePasswordScreen();

  const { goBack } = useAppNavigate<RoutePath.WebCreatePassword>();

  const moveAdenaTermsPage = useCallback(() => {
    openLink(ADENA_TERMS_PAGE);
  }, [openLink]);

  return (
    <WebMain spacing={272}>
      <WebMainHeader
        stepLength={indicatorInfo.stepLength}
        currentStep={indicatorInfo.stepLength - 1}
        onClickGoBack={goBack}
      />

      <StyledContainer>
        <WebTitleWithDescription
          title='Create a Password'
          description='This will be used to unlock your wallet.'
          marginBottom={-6}
        />

        <StyledInputContainer>
          <StyledInputBox>
            <StyledInputWrapper>
              <WebInput
                type='password'
                name='password'
                placeholder='Password'
                style={{ width: '100%', flexShrink: 0 }}
                onChange={passwordState.onChange}
                onKeyDown={onKeyDown}
                error={passwordState.error}
                ref={passwordState.ref}
              />
              {passwordState.evaluationResult?.valid && (
                <EvaluationPasswordResultDescription {...passwordState.evaluationResult} />
              )}
            </StyledInputWrapper>
            {passwordState.errorMessage && <WebErrorText text={passwordState.errorMessage} />}
          </StyledInputBox>

          <StyledInputBox>
            <StyledInputWrapper>
              <WebInput
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                style={{ width: '100%' }}
                onChange={confirmPasswordState.onChange}
                onKeyDown={onKeyDown}
                error={confirmPasswordState.error}
              />
            </StyledInputWrapper>
            {errorMessage && <WebErrorText text={errorMessage} />}
          </StyledInputBox>
        </StyledInputContainer>

        <TermsCheckbox
          checked={termsState.value}
          onChange={termsState.onChange}
          text='I agree to the&nbsp;'
          tabIndex={3}
          margin={'0'}
        >
          <Pressable onClick={moveAdenaTermsPage} tabIndex={4}>
            Terms of Use.
          </Pressable>
        </TermsCheckbox>

        <WebButton
          figure='primary'
          size='small'
          disabled={buttonState.disabled}
          onClick={buttonState.onClick}
          tabIndex={5}
          text='Save'
          rightIcon='chevronRight'
        />
      </StyledContainer>
    </WebMain>
  );
};

const EvaluationPasswordResultDescription = ({
  complexity,
}: EvaluatePasswordResult): JSX.Element => {
  const theme = useTheme();

  const complexityColor = useMemo(() => {
    if (complexity === 'STRONG') return theme.webSuccess._100;
    if (complexity === 'MEDIUM') return theme.webWarning._100;
    return theme.webError._100;
  }, [complexity]);

  const complexityText = useMemo(() => {
    if (complexity === 'STRONG') return 'Strong';
    if (complexity === 'MEDIUM') return 'Medium';
    return 'Week';
  }, [complexity]);

  return (
    <Row style={{ gap: 6 }}>
      <IconConfirmCheck fill={complexityColor} />
      <WebText type='body5' color={complexityColor}>
        {complexityText}
      </WebText>
    </Row>
  );
};

export default CreatePasswordScreen;
