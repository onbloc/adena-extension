import React from 'react';
import styled from 'styled-components';
import { Text, BlurScreen } from '../../atoms';
import mixins from '@styles/mixins';
import theme from '@styles/theme';

interface SeedScrollBoxProps {
  seeds: string[];
  hasBlurScreen?: boolean;
  hasBlurText?: boolean;
  blurScreenText?: string;
  className?: string;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
  border: 1px solid ${theme.color.neutral[6]};
  background-color: ${theme.color.neutral[8]};
  border-radius: 18px;
  padding: 8px;
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 10px 18px;
  .seed-text {
    ${mixins.flex('row', 'center', 'center')}
  }
`;

export const SeedBox = ({
  seeds,
  hasBlurScreen = false,
  hasBlurText = false,
  blurScreenText = '',
  className = '',
}: SeedScrollBoxProps): JSX.Element => {
  return (
    <Wrapper className={className}>
      <Inner>
        {seeds.map((seed: string) => (
          <Text className='seed-text' key={seed} type='captionReg'>
            {seed}
          </Text>
        ))}
      </Inner>
      {hasBlurScreen && <BlurScreen hasText={hasBlurText} text={blurScreenText} />}
    </Wrapper>
  );
};
