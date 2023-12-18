import React, { ReactElement } from 'react';
import styled, { css, CSSProp, CSSProperties } from 'styled-components';

export enum ListHierarchy {
  Default = 'default',
  Normal = 'normal',
  Static = 'static',
}

interface ListBoxStyleProps extends React.ComponentPropsWithoutRef<'div'> {
  cursor?: CSSProperties['cursor'];
  hoverAction?: boolean;
  className?: string;
  padding?: CSSProperties['padding'];
  mode?: ListHierarchy;
}

interface ListBoxProps extends ListBoxStyleProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  onClick?: () => void;
}

const modeVariants = {
  default: css`
    background: ${({ theme }): string => theme.color.neutral[6]};
    &:hover {
      background: ${({ theme }): string => theme.color.neutral[11]};
    }
  `,
  normal: css`
    background: ${({ theme }): string => theme.color.neutral[8]};
    &:hover {
      background: ${({ theme }): string => theme.color.neutral[6]};
    }
  `,
  static: css`
    background: ${({ theme }): string => theme.color.neutral[6]};
  `,
};

export const ListBox = ({
  cursor,
  left,
  center,
  right,
  hoverAction,
  onClick,
  className,
  padding,
  mode,
}: ListBoxProps): ReactElement => {
  return (
    <Wrapper
      cursor={cursor}
      hoverAction={hoverAction}
      onClick={onClick}
      className={className}
      padding={padding}
      mode={mode}
    >
      {left && left}
      {center && center}
      {right && right}
    </Wrapper>
  );
};

const Wrapper = styled.div<ListBoxStyleProps>`
  ${({ theme }): CSSProp => theme.mixins.flexbox('row', 'center', 'center')};
  ${({ mode }): any => {
    if (mode === ListHierarchy.Default) return modeVariants.default;
    if (mode === ListHierarchy.Normal) return modeVariants.normal;
    if (mode === ListHierarchy.Static) return modeVariants.static;
    return modeVariants.default;
  }}
  width: 100%;
  height: 60px;
  padding: ${({ padding }): CSSProperties['padding'] => (padding ? padding : '0px 17px 0px 14px')};
  transition: all 0.4s ease;
  cursor: ${({ cursor }): CSSProperties['cursor'] => cursor ?? 'pointer'};
  border-radius: 18px;
  .logo {
    margin-right: 12px;
  }
  & + & {
    margin-top: 12px;
  }
  /* & > :nth-child(2) {
    margin-left: 12px;
  }
  & > :nth-child(3) {
    margin-left: auto;
  } */
`;
