import { ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import IconAlert from '@assets/web/alert-circle.svg';

import { Row, View, WebButton, WebCheckBox, WebImg, WebText } from '@components/atoms';
import { UseAccountImportReturn } from '@hooks/web/use-account-import-screen';
import { getTheme, webFonts } from '@styles/theme';

const StyledContainer = styled(View)`
  width: 100%;
  row-gap: 24px;
`;

const StyledMessageBox = styled(View)`
  row-gap: 16px;
`;

const StyledItem = styled(Row)<{ error: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: ${({ error, theme }): string =>
    error ? theme.webError._300 : theme.webNeutral._900};
  border: 1px solid
    ${({ error, theme }): string => (error ? theme.webError._200 : theme.webNeutral._600)};
  box-shadow: ${({ error }): string =>
    error
      ? '0px 0px 0px 3px rgba(235, 84, 94, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);'
      : '0px 0px 0px 3px rgba(255, 255, 255, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);'};
`;

const StyledTextarea = styled.textarea`
  ${webFonts.body5};
  color: ${getTheme('webNeutral', '_0')};
  padding: 16px;
  flex: 1;
  width: 100%;
  height: 80px;
  border-radius: 0;
  border: none;
  outline: none;
  background: transparent;
  -webkit-text-security: disc;
  resize: none;

  :focus-visible {
    background: transparent;
  }
`;

const SetPrivateKeyStep = ({
  useAccountImportScreenReturn,
}: {
  useAccountImportScreenReturn: UseAccountImportReturn;
}): ReactElement => {
  const { privateKey, setPrivateKey, onClickNext, errMsg, isValidForm } =
    useAccountImportScreenReturn;
  const theme = useTheme();
  const [agreeWarning, setAgreeWarning] = useState(false);

  return (
    <StyledContainer>
      <StyledMessageBox>
        <WebText type='headline3'>Import Existing Wallet</WebText>
        <WebText type='body4' color={theme.webNeutral._500}>
          Enter a private key to import your existing wallet.
        </WebText>
      </StyledMessageBox>
      <View style={{ rowGap: 12 }}>
        <StyledItem error={!!errMsg}>
          <StyledTextarea
            value={privateKey}
            placeholder='Private Key'
            onChange={({ target: { value } }): void => {
              setPrivateKey(value);
            }}
          />
        </StyledItem>
        {!!errMsg && (
          <Row style={{ columnGap: 6, alignItems: 'center', paddingBottom: 8 }}>
            <WebImg src={IconAlert} size={20} color={theme.webError._100} />
            <WebText type='body5' color={theme.webError._100}>
              {errMsg}
            </WebText>
          </Row>
        )}
      </View>
      <Row style={{ columnGap: 8, alignItems: 'center' }}>
        <WebCheckBox
          checked={agreeWarning}
          onClick={(): void => {
            setAgreeWarning(!agreeWarning);
          }}
        />
        <WebText type='body5' color={theme.webNeutral._500}>
          This will only be stored on this device. Adena can’t recover it for you.
        </WebText>
      </Row>

      <WebButton
        figure='primary'
        size='small'
        onClick={onClickNext}
        disabled={!agreeWarning || !isValidForm}
        style={{ justifyContent: 'center' }}
        text='Next'
        rightIcon='chevronRight'
      />
    </StyledContainer>
  );
};

export default SetPrivateKeyStep;
