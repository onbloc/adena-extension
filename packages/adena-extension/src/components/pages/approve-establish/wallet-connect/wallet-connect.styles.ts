import styled from 'styled-components';

import check from '@assets/check-circle.svg';
import mixins from '@styles/mixins';
import theme, { fonts } from '@styles/theme';

export const WalletConnectWrapper = styled.div`
  ${mixins.flex('column', 'center', 'flex-start')};
  padding: 0 20px;
  align-self: center;

  .main-title {
    text-overflow: ellipsis;
    margin-top: 24px;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-align: center;
  }

  .logo-wrapper {
    margin: 24px auto;
    width: 100%;
    height: auto;
    text-align: center;

    img {
      width: 80px;
      height: 80px;
    }
  }

  .domain-wrapper {
    ${mixins.flex('row', 'center', 'center')};
    width: 100%;
    min-height: 41px;
    border-radius: 24px;
    padding: 10px 18px;
    margin-bottom: 12px;
    background-color: ${theme.color.neutral[8]};
    ${fonts.body2Reg};
  }

  .info-table {
    width: 100%;
    height: auto;
    border-radius: 18px;
    background-color: ${theme.color.neutral[8]};

    .info-table-header {
      ${mixins.flex('column', 'flex-start', 'center')};
      width: 100%;
      padding: 12px;
      color: ${theme.color.neutral[9]};
      ${fonts.body2Bold};
      border-bottom: 2px solid ${theme.color.neutral[7]};
    }

    .info-table-body {
      ${mixins.flex('column', 'flex-start', 'center')};
      width: 100%;
      padding: 12px;
      gap: 8px;
      ${fonts.body2Reg};

      .row {
        position: relative;
        padding-left: 24px;
        :before {
          content: '';
          width: 16px;
          height: 16px;
          background-image: url(${check});
          ${mixins.posTopCenterLeft()}
        }
      }
    }
  }

  .description-wrapper {
    ${mixins.flex('column', 'flex-start', 'center')};
    padding: 4px 0;
    margin-bottom: 43px;
    color: ${theme.color.neutral[9]};
    ${fonts.captionReg};
  }

  .button-wrapper {
    ${mixins.flex('row', 'flex-start', 'center')};
    width: 100%;
    margin-bottom: 24px;
    gap: 10px;

    button {
      width: 100%;
      height: 48px;
      border-radius: 30px;
      ${fonts.body1Bold};
    }

    button.cancel {
      background-color: ${theme.color.neutral[4]};
    }

    button.connect {
      background-color: ${theme.color.primary[3]};
    }
  }
`;
