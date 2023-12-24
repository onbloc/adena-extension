import { fonts, getTheme } from '@styles/theme';
import styled from 'styled-components';

export const AdditionalTokenWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 444px;

  .sub-header-container {
    margin-top: 5px;
    margin-bottom: 24px;
  }

  .select-box-wrapper {
    display: flex;
    margin-bottom: 12px;
  }

  .info-wrapper {
    display: flex;
    height: 100%;
    overflow-y: auto;
  }

  .button-group {
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 0;
    flex-direction: row;
    justify-content: space-between;

    button {
      display: inline-flex;
      width: 100%;
      height: 48px;
      border-radius: 30px;
      align-items: center;
      justify-content: center;
      ${fonts.body1Bold}
      transition: 0.2s;

      &:last-child {
        margin-left: 12px;
      }

      &.cancel-button {
        background-color: ${getTheme('neutral', '_5')};

        :hover {
          background-color: ${getTheme('neutral', '_6')};
        }
      }

      &.add-button {
        background-color: ${getTheme('primary', '_6')};

        &:hover {
          background-color: ${getTheme('primary', '_7')};
        }

        &.disabled {
          color: ${getTheme('neutral', '_5')};
          background-color: ${getTheme('primary', '_9')};
          cursor: default;
        }
      }
    }
  }
`;
