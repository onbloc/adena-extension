import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { RoutePath } from '../../types/router';

import { YourSeedPhrase } from '@pages/popup/certify/your-seed-phrase';
import { ImportPrivateKey } from '@pages/popup/certify/import-private-key';
import { GenerateSeedPhrase } from '@pages/popup/certify/generate-seed-phrase';
import { CreatePassword } from '@pages/popup/certify/create-password';
import { LaunchAdena } from '@pages/popup/certify/launch-adena';
import { Login } from '@pages/popup/certify/login';
import { ForgotPassword } from '@pages/popup/certify/forgot-password';
import { EnterSeedPhrase } from '@pages/popup/certify/enter-seed';
import { Settings } from '@pages/popup/certify/settings';
import { ChangePassword } from '@pages/popup/certify/change-password';
import { SeedPhrase } from '@pages/popup/certify/seed-phrase';
import { ViewSeedPhrase } from '@pages/popup/certify/view-seed-phrase';
import { ConnectedApps } from '@pages/popup/certify/connected-apps';
import AddAccountPage from '@pages/popup/certify/add-account-page';
import AddressBook from '@pages/popup/certify/address-book';
import AddAddress from '@pages/popup/certify/add-address';
import {
  ApproveConnectHardwareWalletConnect,
  ApproveConnectHardwareWalletFinish,
  ApproveConnectHardwareWalletSelectAccount,
  ApproveHardwareWalletLedgerPassword,
  ApproveHardwareWalletLedgerAllSet,
} from '@pages/popup/certify/approve-connect-hardware-wallet';
import { GoogleConnect, GoogleConnectFailed } from '@pages/popup/certify/google-login/connect';
import { SecurityPrivacy } from '@pages/popup/certify/security-privacy';
import { AboutAdena } from '@pages/popup/certify/about-adena';
import { RevealPasswordPhrase } from '@pages/popup/certify/reveal-password-phrase';
import { RevealPrivatePhrase } from '@pages/popup/certify/reveal-private-phrase';
import { ExportPrivateKey } from '@pages/popup/certify/export-private-key';
import { RemoveAccount } from '@pages/popup/certify/remove-account';
import { ResetWallet } from '@pages/popup/certify/reset-wallet';
import ChangeNetwork from '@pages/popup/certify/change-network';

import { WalletCreate } from '@pages/popup/wallet/wallet-create';
import ApproveTransactionMain from '@pages/popup/wallet/approve-transaction-main';
import { ApproveLogin } from '@pages/popup/wallet/approve-login';
import { WalletSearch } from '@pages/popup/wallet/search';
import { Deposit } from '@pages/popup/wallet/deposit';
import { TokenDetails } from '@pages/popup/wallet/token-details';
import { WalletMain } from '@pages/popup/wallet/wallet-main';
import { Nft } from '@pages/popup/wallet/nft';
import { Staking } from '@pages/popup/wallet/staking';
import { Explore } from '@pages/popup/wallet/explore';
import History from '@pages/popup/wallet/history';
import { TransactionDetail } from '@pages/popup/wallet/transaction-detail';
import ApproveEstablish from '@pages/popup/wallet/approve-establish';
import ApproveSign from '@pages/popup/wallet/approve-sign';
import TransferInput from '@pages/popup/wallet/transfer-input';
import TransferSummary from '@pages/popup/wallet/transfer-summary';
import ManageToken from '@pages/popup/wallet/manage-token';
import ManageTokenAdded from '@pages/popup/wallet/manage-token-added';
import TransferLedgerLoading from '@pages/popup/wallet/transfer-ledger-loading';
import TransferLedgerReject from '@pages/popup/wallet/transfer-ledger-reject';
import ApproveTransactionLedgerLoading from '@pages/popup/wallet/approve-transaction-ledger-loading';
import ApproveSignLedgerLoading from '@pages/popup/wallet/approve-sign-ledger-loading';
import AddCustomNetworkPage from '@pages/popup/wallet/add-custom-network';
import EditCustomNetworkPage from '@pages/popup/wallet/edit-custom-network';
import ApproveChangingNetworkPage from '@pages/popup/wallet/approve-changing-network';
import ApproveAddingNetworkPage from '@pages/popup/wallet/approve-adding-network';
import AccountDetailsPage from '@pages/popup/wallet/account-details';
import ApproveSignTransaction from '@pages/popup/wallet/approve-sign-transaction';
import ApproveSignTransactionLedgerLoading from '@pages/popup/wallet/approve-sign-transaction-ledger-loading';

import { useWalletContext } from '@hooks/use-context';

import { TabContainer } from '@components/atoms';
import { ErrorContainer } from '@components/molecules';

import { Header } from './header';
import { ProgressMenu } from './header/progress-menu';
import { Navigation } from './navigation';
import LoadingMain from './loading-main';

export const PopupRouter = (): JSX.Element => {
  const { wallet } = useWalletContext();

  return (
    <>
      <Header />
      <Routes>
        <Route path={RoutePath.Home} element={<WalletCreate />} />
        <Route path={RoutePath.YourSeedPhrase} element={<YourSeedPhrase />} />
        <Route path={RoutePath.ImportPrivateKey} element={<ImportPrivateKey />} />
        <Route path={RoutePath.GenerateSeedPhrase} element={<GenerateSeedPhrase />} />
        <Route path={RoutePath.CreatePassword} element={<CreatePassword />} />
        <Route path={RoutePath.LaunchAdena} element={<LaunchAdena />} />
        <Route
          path={RoutePath.Wallet}
          element={
            <ErrorContainer>
              <WalletMain />
            </ErrorContainer>
          }
        />
        <Route path={RoutePath.EnterSeedPhrase} element={<EnterSeedPhrase />} />
        <Route path={RoutePath.Login} element={<Login />} />
        <Route path={RoutePath.ForgotPassword} element={<ForgotPassword />} />
        <Route path={RoutePath.Nft} element={<Nft />} />
        <Route path={RoutePath.Staking} element={<Staking />} />
        <Route path={RoutePath.Explore} element={<Explore />} />
        <Route path={RoutePath.History} element={<History />} />
        <Route path={RoutePath.TransactionDetail} element={<TransactionDetail />} />
        <Route path={RoutePath.ManageToken} element={<ManageToken />} />
        <Route path={RoutePath.ManageTokenAdded} element={<ManageTokenAdded />} />
        <Route path={RoutePath.Setting} element={<Settings />} />
        <Route path={RoutePath.SettingChangePassword} element={<ChangePassword />} />
        <Route path={RoutePath.SettingSeedPhrase} element={<SeedPhrase />} />
        <Route path={RoutePath.ViewSeedPhrase} element={<ViewSeedPhrase />} />
        <Route path={RoutePath.WalletSearch} element={<WalletSearch />} />
        <Route path={RoutePath.TransferInput} element={<TransferInput />} />
        <Route path={RoutePath.TransferSummary} element={<TransferSummary />} />
        <Route path={RoutePath.TransferLedgerLoading} element={<TransferLedgerLoading />} />
        <Route path={RoutePath.TransferLedgerReject} element={<TransferLedgerReject />} />
        <Route path={RoutePath.Deposit} element={<Deposit />} />
        <Route path={RoutePath.TokenDetails} element={<TokenDetails />} />
        <Route path={RoutePath.ApproveTransaction} element={<ApproveTransactionMain />} />
        <Route
          path={RoutePath.ApproveTransactionLoading}
          element={<ApproveTransactionLedgerLoading />}
        />
        <Route path={RoutePath.ApproveSign} element={<ApproveSign />} />
        <Route path={RoutePath.ApproveSignLoading} element={<ApproveSignLedgerLoading />} />
        <Route path={RoutePath.ApproveSignTransaction} element={<ApproveSignTransaction />} />
        <Route
          path={RoutePath.ApproveSignTransactionLoading}
          element={<ApproveSignTransactionLedgerLoading />}
        />

        <Route path={RoutePath.ApproveLogin} element={<ApproveLogin />} />
        <Route path={RoutePath.ApproveEstablish} element={<ApproveEstablish />} />
        <Route path={RoutePath.ApproveChangingNetwork} element={<ApproveChangingNetworkPage />} />
        <Route path={RoutePath.ApproveAddingNetwork} element={<ApproveAddingNetworkPage />} />
        <Route path={RoutePath.ConnectedApps} element={<ConnectedApps />} />
        <Route path={RoutePath.AddCustomNetwork} element={<AddCustomNetworkPage />} />
        <Route path={RoutePath.EditCustomNetwork} element={<EditCustomNetworkPage />} />
        <Route path={RoutePath.ChangeNetwork} element={<ChangeNetwork />} />
        <Route path={RoutePath.AddAccount} element={<AddAccountPage />} />
        <Route path={RoutePath.AccountDetails} element={<AccountDetailsPage />} />
        <Route path={RoutePath.AddressBook} element={<AddressBook />} />
        <Route path={RoutePath.AddAddress} element={<AddAddress />} />
        <Route
          path={RoutePath.ApproveHardwareWalletConnect}
          element={
            <TabContainer header={<ProgressMenu showLogo progressLevel={'first'} hideArrow />}>
              <ApproveConnectHardwareWalletConnect />
            </TabContainer>
          }
        />
        <Route
          path={RoutePath.ApproveHardwareWalletSelectAccount}
          element={
            <TabContainer
              header={
                <ProgressMenu
                  showLogo
                  progressLevel={wallet && wallet.accounts?.length > 0 ? 'second' : 'first'}
                  hideArrow
                />
              }
            >
              <ApproveConnectHardwareWalletSelectAccount />
            </TabContainer>
          }
        />
        <Route
          path={RoutePath.ApproveHardwareWalletLedgerPassword}
          element={
            <TabContainer header={<ProgressMenu showLogo progressLevel={'second'} hideArrow />}>
              <ApproveHardwareWalletLedgerPassword />
            </TabContainer>
          }
        />
        <Route
          path={RoutePath.ApproveHardwareWalletFinish}
          element={
            <TabContainer header={<ProgressMenu showLogo progressLevel={'third'} hideArrow />}>
              <ApproveConnectHardwareWalletFinish />
            </TabContainer>
          }
        />
        <Route
          path={RoutePath.ApproveHardwareWalletLedgerAllSet}
          element={
            <TabContainer header={<ProgressMenu showLogo progressLevel={'third'} hideArrow />}>
              <ApproveHardwareWalletLedgerAllSet />
            </TabContainer>
          }
        />
        <Route path={RoutePath.SecurityPrivacy} element={<SecurityPrivacy />} />
        <Route path={RoutePath.AboutAdena} element={<AboutAdena />} />
        <Route path={RoutePath.RevealPasswordPhrase} element={<RevealPasswordPhrase />} />
        <Route path={RoutePath.RevealPrivatePhrase} element={<RevealPrivatePhrase />} />
        <Route path={RoutePath.ExportPrivateKey} element={<ExportPrivateKey />} />
        <Route path={RoutePath.RemoveAccount} element={<RemoveAccount />} />
        <Route path={RoutePath.ResetWallet} element={<ResetWallet />} />
        <Route path={RoutePath.GoogleConnect} element={<GoogleConnect />} />
        <Route path={RoutePath.GoogleConnectFailed} element={<GoogleConnectFailed />} />
      </Routes>
      <Navigation />
      <LoadingMain />
    </>
  );
};