import { decodeParameter, parseParmeters } from '@common/utils/client-utils';
import ApproveChangingNetwork from '@components/approve/approve-changing-network/approve-changing-network/approve-changing-network';
import { useNetwork } from '@hooks/use-network';
import { InjectionMessage, InjectionMessageInstance } from '@inject/message';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ApproveChangingNetworkContainer: React.FC = () => {
  const { search } = useLocation();
  const { currentNetwork, networks, changeNetwork } = useNetwork();
  const [requestData, setReqeustData] = useState<InjectionMessage>();
  const [chainId, setChainId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState<InjectionMessage>();
  const [done, setDone] = useState(false);

  const changable = useMemo(() => chainId.length > 0, [chainId]);

  const toNetwork = useMemo(() => {
    return networks.find(network => network.networkId === chainId);
  }, [networks, chainId]);

  useEffect(() => {
    if (search) {
      initRequestData();
    }
  }, [search]);

  const initRequestData = () => {
    const data = parseParmeters(search);
    const parsedData = decodeParameter(data['data']);
    setReqeustData({ ...parsedData, hostname: data['hostname'] });
    setChainId(parsedData?.data?.chainId || '');
  };

  const onClickChangeNetwork = useCallback(async () => {
    setProcessing(true);
    const network = networks.find(network => network.chainId === chainId && network.deleted !== true);
    if (!network) {
      setResponse(InjectionMessageInstance.failure(
        'UNADDED_NETWORK',
        requestData?.data,
        requestData?.key,
      ));
      return;
    }
    await changeNetwork(network.id);
    setResponse(InjectionMessageInstance.success(
      'SWITCH_NETWORK_SUCCESS',
      requestData?.data,
      requestData?.key,
    ));
    setDone(true);
  }, [changeNetwork, requestData, chainId, networks]);

  const onResponse = useCallback(() => {
    if (done && response) {
      chrome.runtime.sendMessage(response);
    }
  }, [done, response]);

  const onTimeout = () => {
    chrome.runtime.sendMessage(InjectionMessageInstance.failure('NETWORK_TIMEOUT', {}, requestData?.key));
  }

  const onClickCancel = useCallback(() => {
    chrome.runtime.sendMessage(
      InjectionMessageInstance.failure(
        'SWITCH_NETWORK_REJECTED',
        requestData?.data,
        requestData?.key,
      ),
    );
  }, [requestData])

  return (
    <ApproveChangingNetwork
      fromChain={{
        name: currentNetwork.networkName
      }}
      toChain={{
        name: toNetwork?.networkName || ''
      }}
      changable={changable}
      processing={processing}
      done={done}
      changeNetwork={onClickChangeNetwork}
      cancel={onClickCancel}
      onResponse={onResponse}
      onTimeout={onTimeout}
    />
  );
};

export default ApproveChangingNetworkContainer;