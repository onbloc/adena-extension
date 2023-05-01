import React from 'react';
import styled from 'styled-components';
import Portal from '@layouts/portal';
import logo from '../../assets/logo-withIcon.svg';
import lock from '../../assets/lock.svg';
import restore from '../../assets/restore.svg';
import help from '../../assets/help-fill.svg';
import statusCheck from '../../assets/check-circle.svg';
import Text from '@components/text';
import { useMatch, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import { useCurrentAccount } from '@hooks/use-current-account';
import { formatNickname, maxFractionDigits } from '@common/utils/client-utils';
import plus from '../../assets/plus.svg';
import theme from '@styles/theme';
import Icon from '@components/icons';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';
import { Account } from 'adena-module';
import { TokenBalance } from '@states/balance';
import { useTokenBalance } from '@hooks/use-token-balance';
import { useAccountName } from '@hooks/use-account-name';

interface SubMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: (e: React.MouseEvent) => void;
  selector?: string;
}

interface UserListProps {
  accountNames: { [key in string]: string };
  accounts: Array<Account>;
  currentAccount: Account;
  accountBalances: { [key in string]: TokenBalance };
  changeAccountHandler: (currentAccount: Account) => void;
}

const RestoreWallet = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <img src={restore} alt='restore wallet' />
    <Text type='body2Reg'>Restore Wallet</Text>
  </Button>
);

const LockWallet = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <img src={lock} alt='lock wallet' />
    <Text type='body2Reg'>Lock Wallet</Text>
  </Button>
);

const UserListMaker = ({
  accountNames,
  accounts,
  currentAccount,
  accountBalances,
  changeAccountHandler,
}: UserListProps) => (
  <>
    {accounts.map((account, i) => {
      const accountName = accountNames[account.id] || account.name;
      const balance = accountBalances[account.id]?.amount || null;
      const balanceString = balance
        ? `${maxFractionDigits(balance.value.toString(), 6)} ${balance.denom.toUpperCase()}`
        : ' ';

      return (
        <ListItem key={i} onClick={() => changeAccountHandler(account)}>
          <Text type='body2Reg' display='inline-flex'>
            {formatNickname(accountName, 10)}
            <FromBadge from={account.type} />
          </Text>
          <Text type='body3Reg' color={theme.color.neutral[9]}>
            {balanceString}
          </Text>
          {currentAccount.id === account.id && (
            <img src={statusCheck} alt='status icon' className='status-icon' />
          )}
        </ListItem>
      );
    })}
  </>
);

const FromBadge = ({ from }: { from: string }) => {
  if (from === 'WEB3_AUTH') {
    return <StyledBedge type='captionReg'>Google</StyledBedge>;
  }
  if (from === 'PRIVATE_KEY') {
    return <StyledBedge type='captionReg'>Imported</StyledBedge>;
  }
  if (from === 'LEDGER') {
    return <StyledBedge type='captionReg'>Ledger</StyledBedge>;
  }
  return <></>;
};

const SubMenu: React.FC<SubMenuProps> = ({ open, setOpen, onClick, selector = 'portal-root' }) => {
  const { walletService } = useAdenaContext();
  const { wallet } = useWalletContext();
  const login = useMatch(RoutePath.Login);
  const navigate = useNavigate();
  const { currentAccount, changeCurrentAccount } = useCurrentAccount();
  const { accountNativeBalances } = useTokenBalance();
  const { accountNames } = useAccountName();

  const addAccountHandler = () => {
    setOpen(false);
    navigate(RoutePath.AddAccount);
  };

  const restoreClickHandler = () => {
    setOpen(false);
    navigate(RoutePath.EnterSeedPhrase);
  };

  const lockClickHandler = async () => {
    setOpen(!open);
    await walletService.lockWallet();
    navigate(RoutePath.Login, { replace: true });
  };

  const helpSupportButtonClick = () =>
    window.open('https://docs.adena.app/resources/faq', '_blank');

  const changeAccountHandler = async (currentAccount: Account) => {
    changeCurrentAccount(currentAccount);
    setOpen(false);
    navigate(RoutePath.Wallet);
  };

  return (
    <Portal selector={selector}>
      <Overlay open={open}>
        <Dim onClick={() => setOpen(false)} />
        <Container open={open}>
          <Header>
            <img src={logo} alt='adena logo' />
            <button type='button' onClick={onClick}>
              <Icon name='iconCancel' />
            </button>
          </Header>
          {!login && currentAccount && (
            <Body>
              <ListWrapper>
                {wallet?.accounts && wallet.accounts.length > 0 && (
                  <UserListMaker
                    accountNames={accountNames}
                    accounts={wallet.accounts}
                    accountBalances={accountNativeBalances}
                    changeAccountHandler={changeAccountHandler}
                    currentAccount={currentAccount}
                  />
                )}
              </ListWrapper>
              <AddAccountBtn onClick={addAccountHandler}>
                <Text type='body2Bold'>Add Account</Text>
              </AddAccountBtn>
            </Body>
          )}
          <Footer>
            {login ? (
              <RestoreWallet onClick={restoreClickHandler} />
            ) : (
              <LockWallet onClick={lockClickHandler} />
            )}
            <Button onClick={helpSupportButtonClick}>
              <img src={help} alt='help and support' />
              <Text type='body2Reg'>Help &#38; Support</Text>
            </Button>
          </Footer>
        </Container>
      </Overlay>
    </Portal>
  );
};

const Container = styled.div<{ open: boolean }>`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'space-between')};
  background-color: ${({ theme }) => theme.color.neutral[7]};
  position: fixed;
  top: 0px;
  left: ${({ open }) => (open ? '0px' : '-100%')};
  width: 270px;
  height: 100%;
  z-index: 99;
  transition: left 0.4s ease;
`;

const Header = styled.div`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'space-between')};
  background-color: ${({ theme }) => theme.color.neutral[8]};
  padding: 0px 20px;
  width: 100%;
  height: 50px;
  & > button {
    ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
    width: 14px;
    height: 14px;
    svg {
      width: 14px;
      height: 14px;
      * {
        stroke: ${({ theme }) => theme.color.neutral[9]};
      }
    }
  }
`;

const Footer = styled.div`
  width: 100%;
`;

const Button = styled.button`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'flex-start')}
  width: 100%;
  height: 48px;
  padding: 0px 20px;
  background-color: ${({ theme }) => theme.color.neutral[8]};
  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.neutral[6]};
  }
  & > img {
    width: 16px;
    height: auto;
    margin-right: 12px;
  }
`;

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.4s;
  background-color: rgba(255, 255, 255, 0.05);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  -webkit-backdrop-filter: blur(20px);
  -moz-backdrop-filter: blur(20px);
  -o-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  z-index: 98;
`;

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const ListWrapper = styled.ul`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'flex-start')};
  width: 100%;
  height: auto;
  max-height: 230px;
  overflow-y: auto;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutral[6]};
`;

const ListItem = styled.li`
  ${({ theme }) => theme.mixins.flexbox('column', 'flex-start', 'center')};
  position: relative;
  width: 100%;
  height: 60px;
  min-height: 60px;
  cursor: pointer;
  padding: 0px 20px;
  background-color: ${({ theme }) => theme.color.neutral[7]};
  transition: all 0.4s ease;
  :hover {
    background-color: ${({ theme }) => theme.color.neutral[6]};
    transition: all 0.4s ease;
  }
  .status-icon {
    ${theme.mixins.posTopCenterRight('20px')}
  }
`;

const StyledBedge = styled(Text)`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
  padding: 0px 10px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.neutral[8]};
  margin-left: 8px;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.dimmed400};
`;

const AddAccountBtn = styled.button`
  position: relative;
  padding-left: 24px;
  margin-left: 20px;
  margin: 16px 0px 0px 20px;
  :before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url(${plus});
    ${({ theme }) => theme.mixins.posTopCenterLeft()}
  }
`;

export default SubMenu;
