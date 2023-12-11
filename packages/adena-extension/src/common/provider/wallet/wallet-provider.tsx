import React, { createContext, useEffect, useState } from 'react';
import { NetworkState, TokenState, WalletState } from '@states/index';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Wallet } from 'adena-module';
import { NetworkMetainfo } from '@states/network';
import { useAdenaContext } from '@hooks/use-context';
import { TokenModel } from '@types';
import { GnoProvider } from '../gno/gno-provider';

export interface WalletContextProps {
  wallet: Wallet | null;
  gnoProvider: GnoProvider | undefined;
  walletStatus: 'CREATE' | 'LOGIN' | 'LOADING' | 'FINISH' | 'FAIL' | 'NONE';
  tokenMetainfos: TokenModel[];
  networkMetainfos: NetworkMetainfo[];
  updateWallet: (wallet: Wallet) => Promise<boolean>;
  initWallet: () => Promise<boolean>;
  initNetworkMetainfos: () => Promise<boolean>;
  changeNetwork: (network: NetworkMetainfo) => Promise<NetworkMetainfo>;
}

export const WalletContext = createContext<WalletContextProps | null>(null);

export const WalletProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const {
    walletService,
    transactionService,
    balanceService,
    accountService,
    chainService,
    tokenService,
    transactionHistoryService,
  } = useAdenaContext();

  const [gnoProvider, setGnoProvider] = useState<GnoProvider>();

  const [wallet, setWallet] = useRecoilState(WalletState.wallet);

  const [walletStatus, setWalletStatus] = useRecoilState(WalletState.state);

  const [tokenMetainfos, setTokenMetainfos] = useRecoilState(TokenState.tokenMetainfos);

  const [networkMetainfos, setNetworkMetainfos] = useRecoilState(NetworkState.networkMetainfos);

  const setCurrentNetwork = useSetRecoilState(NetworkState.currentNetwork);

  const setCurrentAccount = useSetRecoilState(WalletState.currentAccount);

  useEffect(() => {
    initWallet();
    initNetworkMetainfos();
  }, []);

  useEffect(() => {
    if (wallet && networkMetainfos && tokenMetainfos) {
      setWalletStatus('FINISH');
    }
  }, [wallet, networkMetainfos, tokenMetainfos]);

  async function initWallet(): Promise<boolean> {
    const existWallet = await walletService.existsWallet();
    if (!existWallet) {
      setWallet(null);
      setWalletStatus('CREATE');
      return true;
    }

    const isLocked = await walletService.isLocked();
    if (isLocked) {
      setWallet(null);
      setWalletStatus('LOGIN');
      return true;
    }

    setWalletStatus('LOADING');
    try {
      const wallet = await walletService.loadWallet();
      setWallet(wallet);
      await initCurrentAccount(wallet);
    } catch (e) {
      console.error(e);
      setWallet(null);
      setWalletStatus('FAIL');
      return false;
    }
    return true;
  }

  async function updateWallet(wallet: Wallet): Promise<boolean> {
    setWallet(wallet);
    const password = await walletService.loadWalletPassword();
    await walletService.saveWallet(wallet, password);
    return true;
  }

  async function initCurrentAccount(wallet: Wallet): Promise<boolean> {
    const currentAccountId = await accountService.getCurrentAccountId();
    const currentAccount =
      wallet.accounts.find((account) => account.id === currentAccountId) ?? wallet.accounts[0];
    if (currentAccount) {
      setCurrentAccount(currentAccount);
      await accountService.changeCurrentAccount(currentAccount);
      initTokenMetainfos(currentAccount.id);
    }
    return true;
  }

  async function initNetworkMetainfos(): Promise<boolean> {
    const networkMetainfos = await chainService.getNetworks();
    if (networkMetainfos.length === 0) {
      return false;
    }
    setNetworkMetainfos(networkMetainfos);
    chainService.updateNetworks(networkMetainfos);

    await initCurrentNetworkMetainfos(networkMetainfos);
    return true;
  }

  async function initCurrentNetworkMetainfos(
    networkMetainfos: NetworkMetainfo[],
  ): Promise<boolean> {
    const currentNetworkId = await chainService.getCurrentNetworkId();
    const currentNetwork =
      networkMetainfos.find((networkMetainfo) => networkMetainfo.id === currentNetworkId) ??
      networkMetainfos[0];
    await chainService.updateCurrentNetworkId(currentNetwork.id);
    await changeNetwork(currentNetwork);
    return true;
  }

  async function initTokenMetainfos(accountId: string): Promise<void> {
    await tokenService.initAccountTokenMetainfos(accountId);
    const tokenMetainfos = await tokenService.getTokenMetainfosByAccountId(accountId);
    setTokenMetainfos(tokenMetainfos);
    balanceService.setTokenMetainfos(tokenMetainfos);
  }

  async function changeNetwork(
    networkMetainfo: NetworkMetainfo,
  ): Promise<NetworkState.NetworkMetainfo> {
    const rpcUrl = networkMetainfo.rpcUrl;
    const gnoProvider = new GnoProvider(rpcUrl, networkMetainfo.networkId);
    setCurrentNetwork(networkMetainfo);
    setGnoProvider(gnoProvider);

    accountService.setGnoProvider(gnoProvider);
    balanceService.setGnoProvider(gnoProvider);
    transactionService.setGnoProvider(gnoProvider);
    tokenService.setNetworkMetainfo(networkMetainfo);
    transactionHistoryService.setNetworkMetainfo(networkMetainfo);
    return networkMetainfo;
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletStatus,
        tokenMetainfos,
        networkMetainfos,
        gnoProvider,
        initWallet,
        updateWallet,
        initNetworkMetainfos,
        changeNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
