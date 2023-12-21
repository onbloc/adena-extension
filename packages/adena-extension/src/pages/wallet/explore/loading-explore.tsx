import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Loading, SkeletonBoxStyle } from '@components/atoms';
import mixins from '@styles/mixins';

const Wrapper = styled.div`
  ${mixins.flex('column', 'flex-start', 'flex-start')};
  position: relative;
  width: 100%;
  z-index: 1;
`;

const RoundsBox = styled.div`
  ${mixins.flex('column', 'flex-end', 'center')};
  margin-left: auto;
`;

const ListBoxWrap = styled.div`
  ${mixins.flex('column', 'center', 'flex-start')}
  width: 100%;
  gap: 12px;
  padding-top: 12px;
`;

const SkeletonBox = styled(SkeletonBoxStyle)`
  ${mixins.flex('row', 'center', 'flex-start')}
  width: 100%;
  height: 60px;
`;

const LoadingExplore = (): ReactElement => {
  return (
    <Wrapper>
      <ListBoxWrap>
        {Array.from({ length: 5 }, (v, i) => (
          <SkeletonBox key={i}>
            <Loading.Circle width='34px' height='34px' margin='0px 15px 0px 0px' />
            <Loading.Round width='91px' height='10px' radius='24px' />
            <RoundsBox>
              <Loading.Round width='100px' height='10px' radius='24px' />
              <Loading.Round width='58px' height='10px' radius='24px' margin='10px 0px 0px' />
            </RoundsBox>
          </SkeletonBox>
        ))}
      </ListBoxWrap>
    </Wrapper>
  );
};

export default LoadingExplore;
