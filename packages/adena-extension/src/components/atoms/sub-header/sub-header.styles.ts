import { fonts } from '@styles/theme';
import styled from 'styled-components';

export const SubHeaderWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;

  .icon-wrapper {
    position: absolute;
    display: flex;
    width: 24px;
    height: 24px;
    cursor: pointer;
    justify-content: center;
    align-items: center;

    & > * {
      width: 100%;
      height: 100%;
    }

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }

  .title-wrapper {
    ${fonts.header4}
  }
`;