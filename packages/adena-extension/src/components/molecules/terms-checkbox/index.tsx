import React from 'react';
import styled, { CSSProp } from 'styled-components';

import checkOff from '@assets/check-off.svg';
import checkOn from '@assets/check-on.svg';
import mixins from '@styles/mixins';
import { fonts, getTheme } from '@styles/theme';

type CheckboxPos = 'CENTER' | 'TOP' | ' BOTTOM';
interface TermsCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text?: string;
  children?: React.ReactNode;
  tabIndex: number;
  checkboxPos?: CheckboxPos;
  className?: string;
  id?: string;
}

const Wrapper = styled.div`
  ${mixins.flex('row', 'center', 'flex-start')};
  width: 100%;
  margin: auto 0px 10px;
  ${fonts.body2Reg};
`;

const Label = styled.label<{ checkboxPos: CheckboxPos }>`
  ${mixins.flex('row', 'center', 'flex-start')};
  position: relative;
  padding-left: 32px;
  cursor: pointer;
  &:before {
    ${({ checkboxPos }): CSSProp =>
      checkboxPos === 'TOP' ? mixins.posTopLeft('2px') : mixins.posTopCenterLeft()};
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 12px;
    background: url(${checkOff}) no-repeat center center;
  }
  .terms-button {
    text-decoration-line: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
  }
  &,
  * {
    font: inherit;
    color: ${getTheme('neutral', 'a')};
  }
`;

const Input = styled.input`
  &[type='checkbox'] {
    width: 0px;
    height: 0px;
    white-space: nowrap;
    &:checked + label:before {
      background: url(${checkOn}) no-repeat center center;
    }
  }
`;

export const TermsCheckbox = ({
  checked,
  onChange,
  text,
  children,
  tabIndex,
  checkboxPos = 'CENTER',
  className = '',
  id = '',
}: TermsCheckboxProps): JSX.Element => {
  return (
    <Wrapper className={className}>
      <Input
        id={id ? id : 'terms'}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        tabIndex={tabIndex}
      />
      <Label htmlFor={id ? id : 'terms'} checkboxPos={checkboxPos}>
        {text && text}
        {children}
      </Label>
    </Wrapper>
  );
};
