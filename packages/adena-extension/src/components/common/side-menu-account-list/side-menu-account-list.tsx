import React from 'react';
import { SideMenuAccountListWrapper } from './side-menu-account-list.styles';
import { SideMenuAccountInfo } from '@components/common/side-menu/side-menu';
import SideMenuAccountItem from '../side-menu-account-item/side-menu-account-item';

export interface SideMenuAccountListProps {
  currentAccountId: string | null;
  accounts: SideMenuAccountInfo[];
  changeAccount: (accountId: string) => void;
  moveGnoscan: (address: string) => void;
  moveAccountDetail: (accountId: string) => void;
}

const SideMenuAccountList: React.FC<SideMenuAccountListProps> = ({
  currentAccountId,
  accounts,
  changeAccount,
  moveGnoscan,
  moveAccountDetail,
}) => {
  return (
    <SideMenuAccountListWrapper>
      {
        accounts.map((account, index) => (
          <SideMenuAccountItem
            key={index}
            selected={account.accountId === currentAccountId}
            account={account}
            changeAccount={changeAccount}
            moveGnoscan={moveGnoscan}
            moveAccountDetail={moveAccountDetail}
          />
        ))
      }
    </SideMenuAccountListWrapper>
  );
};

export default SideMenuAccountList;