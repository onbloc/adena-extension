export enum RoutePath {
  Home = '/',
  Login = '/login',
  Nft = '/nft',
  Staking = '/staking',
  Explore = '/explore',
  History = '/history',
  Create = '/create',
  ForgotPassword = '/login/forgot-password',

  //phrase
  EnterSeedPhrase = '/popup/enter-seed',
  CreatePassword = '/popup/create-password',
  LaunchAdena = '/popup/launch-adena',
  YourSeedPhrase = '/popup/your-seed-phrase',
  ImportPrivateKey = '/popup/import-private-key',
  GenerateSeedPhrase = '/popup/generate-seed-phrase',

  //google login
  GoogleConnect = '/google-login',
  GoogleConnectFailed = '/google-login/failed',

  //wallet
  Wallet = '/wallet',
  WalletSearch = '/wallet/search',
  TransactionDetail = '/wallet/transaction-detail',
  Deposit = '/wallet/deposit',
  Send = '/wallet/send',
  TokenDetails = '/wallet/token-details',
  ApproveLogin = '/approve/wallet/login',
  ApproveTransaction = '/approve/wallet/transaction',
  ApproveTransactionLoading = '/approve/wallet/transaction/loading',
  ApproveSign = '/approve/wallet/sign',
  ApproveSignLoading = '/approve/wallet/sign/loading',
  ApproveSignTransaction = '/approve/wallet/sign-tx',
  ApproveSignTransactionLoading = '/approve/wallet/sign-tx/loading',
  ApproveEstablish = '/approve/wallet/establish',
  ApproveChangingNetwork = '/approve/wallet/network/change',
  ApproveAddingNetwork = '/approve/wallet/network/add',
  ImportAccount = '/wallet/import-account',
  AddAccount = '/wallet/add-account',
  AccountDetails = '/wallet/accounts/:accountId',
  ManageToken = '/wallet/manage-token',
  ManageTokenAdded = '/wallet/manage-token/added',
  TransferInput = '/wallet/transfer-input',
  TransferSummary = '/wallet/transfer-summary',
  TransferLedgerLoading = '/wallet/transfer-ledger/loading',
  TransferLedgerReject = '/wallet/transfer-ledger/reject',

  // settings
  Setting = '/settings',
  SettingChangePassword = '/settings/change-password',
  SettingExportAccount = '/settings/export-account',
  SettingSeedPhrase = '/settings/seed-phrase',
  ViewPrivateKey = '/settings/view-private-key',
  ViewSeedPhrase = '/settings/view-seed-phrase',
  ConnectedApps = '/settings/connected-apps',
  ChangeNetwork = '/settings/change-network',
  AddCustomNetwork = '/settings/change-network/add',
  EditCustomNetwork = '/settings/change-network/edit',
  AddressBook = '/settings/address-book',
  AddAddress = '/settings/add-address',
  SecurityPrivacy = '/settings/security-privacy',
  RevealPasswordPhrase = '/settings/security-privacy/reveal-password-phrase',
  RevealPrivatePhrase = '/settings/security-privacy/reveal-private-phrase',
  AboutAdena = '/settings/about-adena',
  ApproachPasswordPhrase = '/settings/security-privacy/export-private-key/approach-password-phrase',
  ApproachPrivatePhrase = '/settings/security-privacy/export-private-key/approach-private-phrase',
  RemoveAccount = '/settings/security-privacy/remove-account',
  ResetWallet = '/settings/security-privacy/reset-wallet',
  ApproveHardwareWalletConnect = '/approve/settings/hardware-wallet',
  ApproveHardwareWalletSelectAccount = '/approve/settings/hardware-wallet/select-account',
  ApproveHardwareWalletFinish = '/approve/settings/hardware-wallet/finish',
  ApproveHardwareWalletLedgerPassword = '/approve/settings/hardware-wallet/ledger-password',
  ApproveHardwareWalletLedgerAllSet = '/approve/settings/hardware-wallet/ledger-all-set',
}
