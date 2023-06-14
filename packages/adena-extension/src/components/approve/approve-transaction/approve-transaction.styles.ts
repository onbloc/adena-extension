import styled from 'styled-components';

export const ApproveTransactionWrapper = styled.div`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'flex-start')};
  padding: 0 20px;
  align-self: center;

  .row {
    ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
    position: relative;
    padding: 10px 18px;
    justify-content: space-between;
    border-bottom: 2px solid ${({ theme }) => theme.color.neutral[7]};
    ${({ theme }) => theme.fonts.body1Reg};

    &:last-child {
      border-bottom: none;
    }

    .key {
      display: inline-flex;
      width: fit-content;
      flex-shrink: 0;
      color: ${({ theme }) => theme.color.neutral[9]};
    }

    .value {
      display: inline-flex;
      text-align: right;
    }
  }

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
    ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
    width: 100%;
    min-height: 41px;
    border-radius: 24px;
    padding: 10px 18px;
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.color.neutral[8]};
    ${({ theme }) => theme.fonts.body2Reg};
  }

  .info-table {
    width: 100%;
    height: auto;
    border-radius: 18px;
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.color.neutral[8]};
  }

  .fee-amount-wrapper {
    width: 100%;
    min-height: 48px;
    border-radius: 30px;
    padding: 10px 18px;
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.color.neutral[8]};
    border: 1px solid ${({ theme }) => theme.color.neutral[7]};
    ${({ theme }) => theme.fonts.body2Reg};
  }

  .transaction-data-wrapper {
    width: 100%;
    ${({ theme }) => theme.fonts.body1Reg};
    ${({ theme }) => theme.mixins.flexbox('column', 'center', 'center')};

    .visible-button {
      color: ${({ theme }) => theme.color.neutral[9]};
      height: fit-content;
      margin-bottom: 5px;

      img {
        margin-left: 3px;
      }
    }
    .textarea-wrapper {
      width: 100%;
      height: 120px;
      border-radius: 24px;
      background-color: ${({ theme }) => theme.color.neutral[8]};
      border: 1px solid ${({ theme }) => theme.color.neutral[6]};
      padding: 12px 16px;
      margin-bottom: 40px;
    }
    .raw-info-textarea {
      width: 100%;
      height: 100%;
      overflow: auto;
      ${({ theme }) => theme.fonts.body2Reg};
      resize: none;
    }
    .raw-info-textarea::-webkit-scrollbar {
      width: 2px;
      padding: 1px 1px 1px 0px;
      margin-right: 10px;
    }

    .raw-info-textarea::-webkit-scrollbar-thumb {
      background-color: darkgrey;
    }

    .raw-info-textarea::-webkit-resizer {
      display: none !important;
    }

    margin-bottom: 10px;
  }

  .button-wrapper {
    ${({ theme }) => theme.mixins.flexbox('row', 'flex-start', 'center')};
    width: 100%;
    margin-bottom: 24px;
    gap: 10px;

    button {
      width: 100%;
      height: 48px;
      border-radius: 30px;
      ${({ theme }) => theme.fonts.body1Bold};
    }

    button.cancel {
      background-color: ${({ theme }) => theme.color.neutral[4]};
    }

    button.connect {
      background-color: ${({ theme }) => theme.color.primary[3]};
    }
  }
`;