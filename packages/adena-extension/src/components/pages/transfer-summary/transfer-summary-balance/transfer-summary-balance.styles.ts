import { fonts, getTheme } from '@styles/theme';
import styled from 'styled-components';

export const TransferSummaryBalanceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 20px;
  background-color: ${getTheme('neutral', '_9')};
  border-radius: 18px;
  justify-content: space-between;
  align-items: center;

  .token-image {
    width: 30px;
    height: 30px;
  }

  .balance {
    display: contents;
    ${fonts.header5};
  }
`;
