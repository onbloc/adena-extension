import React from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '@styles/theme';
import { GlobalStyle } from '@styles/global-style';
import ApproveAddingNetworkTable, { ApproveAddingNetworkTableProps } from './approve-adding-network-table';

describe('ApproveAddingNetworkTable Component', () => {
  it('ApproveAddingNetworkTable render', () => {
    const args: ApproveAddingNetworkTableProps = {
      name: '',
      rpcUrl: '',
      chainId: '',
    };

    render(
      <RecoilRoot>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <ApproveAddingNetworkTable {...args} />
        </ThemeProvider>
      </RecoilRoot>,
    );
  });
});