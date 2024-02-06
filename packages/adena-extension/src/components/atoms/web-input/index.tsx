import styled from 'styled-components';

import { webFonts, getTheme } from '@styles/theme';

interface InputProps {
  width?: string;
  error?: boolean;
}

export const WebInput = styled.input<InputProps>`
  ${webFonts.body5};
  width: ${({ width }): string => width ?? 'auto'};
  color: ${getTheme('webNeutral', '_0')};
  border-radius: 12px;
  border: 1px solid;
  padding: 12px 16px;
  border-color: ${({ error, theme }): string => (error ? theme.webError._200 : theme.webNeutral._800)};
  background-color: ${({ error, theme }): string => (error ? theme.webError._300 : theme.webInput._100)};
  
  :placeholder-shown {
    background-color: ${({ error, theme }): string => (error ? theme.webError._300 : theme.webNeutral._900)};
  }

  ::placeholder {
    color: ${getTheme('webNeutral', '_700')};
  }

  :focus {
    background-color: ${({ error, theme }): string => (error ? theme.webError._300 : theme.webInput._100)};
    box-shadow: 0px 0px 0px 3px rgba(255, 255, 255, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.1),
      0px 1px 2px 0px rgba(0, 0, 0, 0.06);
  }
  
  :focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 3px rgba(255, 255, 255, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.1),
      0px 1px 2px 0px rgba(0, 0, 0, 0.06);
    background-color: ${({ error, theme }): string => (error ? theme.webError._300 : theme.webInput._100)};
  }
`;