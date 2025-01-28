import React, { CSSProperties, ReactElement } from 'react';
import styled, { RuleSet } from 'styled-components';

import { webFonts, WebFontType } from '@styles/theme';

type FormTextProps = {
  type: WebFontType;
  children: string | number;
  color?: CSSProperties['color'];
  style?: React.CSSProperties;
  textCenter?: boolean;
};

const StyledContainer = styled.div<{ type: WebFontType; color?: CSSProperties['color'] }>`
  color: ${({ color }): CSSProperties['color'] => (color ? color : '#FAFCFF')};
  ${({ type }): RuleSet => webFonts[type]}
  white-space: pre-wrap;
`;

export const WebText = ({
  type,
  color,
  style,
  children,
  textCenter,
  ...rest
}: FormTextProps): ReactElement => {
  return (
    <StyledContainer
      type={type}
      style={{ color, textAlign: textCenter ? 'center' : 'initial', ...style }}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};
