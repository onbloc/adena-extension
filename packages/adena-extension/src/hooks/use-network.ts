import { useRecoilState } from 'recoil';
import { useAdenaContext, useWalletContext } from './use-context';
import { NetworkMetainfo } from '@states/network';
import { NetworkState } from '@states/index';

interface NetworkResponse {
  networks: NetworkMetainfo[];
  currentNetwork: NetworkMetainfo;
  changeNetwork: (networkId: string) => Promise<boolean>;
}

const DEFAULT_NETWORK: NetworkMetainfo = {
  main: true,
  chainId: 'GNOLAND',
  chainName: 'GNO.LAND',
  networkId: 'test3',
  networkName: 'Testnet 3',
  addressPrefix: 'g',
  rpcUrl: 'https://rpc.test3.gno.land',
  gnoUrl: 'https://rpc.test3.gno.land',
  apiUrl: 'https://api.adena.app',
  linkUrl: 'https://gnoscan.io',
  token: {
    denom: 'gnot',
    unit: 1,
    minimalDenom: 'ugnot',
    minimalUnit: 0.000001,
  },
};

export const useNetwork = (): NetworkResponse => {
  const { networkMetainfos: networks } = useWalletContext();
  const { chainService } = useAdenaContext();
  const [currentNetwork, setCurrentNetwork] = useRecoilState(NetworkState.currentNetwork);

  async function changeNetwork(networkId: string) {
    if (networks.length === 0) {
      setCurrentNetwork(null);
      return false;
    }
    const currentNetwork =
      networks.find((network) => network.networkId === networkId) ?? networks[0];
    setCurrentNetwork(currentNetwork);
    await chainService.updateCurrentNetworkId(currentNetwork.networkId);
    return true;
  }

  return {
    currentNetwork: currentNetwork || DEFAULT_NETWORK,
    networks,
    changeNetwork,
  };
};
