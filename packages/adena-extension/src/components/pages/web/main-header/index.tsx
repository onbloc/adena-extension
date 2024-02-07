import React, { ReactElement, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import _ from 'lodash';
import back from '@assets/web/chevron-left.svg';

import { Pressable, Row, View, WebImg } from '@components/atoms';

const StyledContainer = styled(Row)`
  width: 100%;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const StyledDot = styled(View) <{ selected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, selected }): string =>
    selected ? theme.webPrimary._100 : 'rgba(0, 89, 255, 0.32)'};
`;

const StyledEmpty = styled(View)`
  width: 32px;
`;

export type WebMainHeaderProps = {
  stepLength: number;
  onClickGoBack: () => void;
  currentStep?: number;
};

export const WebMainHeader = ({
  onClickGoBack,
  currentStep,
  stepLength,
}: WebMainHeaderProps): ReactElement => {
  const theme = useTheme();

  const isCurrentStep = useMemo(() => {
    return currentStep && currentStep > -1;
  }, [currentStep]);

  return (
    <StyledContainer>
      <Pressable
        onClick={onClickGoBack}
        style={{ padding: 4, backgroundColor: theme.webInput._100, borderRadius: 16 }}
      >
        <WebImg src={back} size={24} />
      </Pressable>
      <Row style={{ columnGap: 8 }}>
        {stepLength > 1 && isCurrentStep && (
          <React.Fragment>
            {_.times(stepLength, (index) => (
              <StyledDot key={index} selected={index === currentStep} />
            ))}
          </React.Fragment>
        )}
      </Row>
      <StyledEmpty />
    </StyledContainer>
  );
};
