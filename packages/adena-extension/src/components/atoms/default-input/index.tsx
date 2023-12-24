import styled, { css } from 'styled-components';

import { fonts, getTheme } from '@styles/theme';

interface InputProps {
  error?: boolean;
  margin?: string;
}

export const inputStyle = css`
  ${fonts.body2Reg};
  width: 100%;
  height: 48px;
  background-color: ${getTheme('neutral', '_9')};
  color: ${getTheme('neutral', '_1')};
  border-radius: 30px;
  padding: 14px 16px;
  ::placeholder {
    color: ${getTheme('neutral', 'a')};
  }
`;

export const DefaultInput = styled.input<InputProps>`
  ${inputStyle};
  border: 1px solid ${({ error, theme }): string => (error ? theme.red._5 : theme.neutral._7)};
  margin: ${({ margin }): string | undefined => margin && margin};
`;
