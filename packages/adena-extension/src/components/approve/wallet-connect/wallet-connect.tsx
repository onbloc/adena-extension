import React from 'react';
import { WalletConnectWrapper } from './wallet-connect.styles';
import DefaultFavicon from './../../../assets/favicon-default.svg';
import Text from '@components/text';
import ApproveLoading from '../approve-loading/approve-loading';
import ApproveInjectionLoading from '../approve-injection-loading/approve-injection-loading';

export interface WalletConnectProps {
  loading: boolean;
  app: string;
  logo: string;
  domain: string;
  processing: boolean;
  done: boolean;
  onClickConnect: () => void;
  onClickCancel: () => void;
  onResponse: () => void;
  onTimeout: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  loading,
  app,
  logo,
  domain,
  processing,
  done,
  onClickConnect,
  onClickCancel,
  onResponse,
  onTimeout,
}) => {

  if (loading) {
    return <ApproveLoading rightButtonText='Connect' />;
  }

  if (processing) {
    return (
      <ApproveInjectionLoading
        done={done}
        onResponse={onResponse}
        onTimeout={onTimeout}
      />
    );
  }

  return (
    <WalletConnectWrapper>
      <Text className='main-title' type='header4'>
        {`Connect to ${app}`}
      </Text>

      <div className='logo-wrapper'>
        <img src={logo || DefaultFavicon} alt='logo img' />
      </div>

      <div className='domain-wrapper'>
        <span>{domain}</span>
      </div>

      <div className='info-table'>
        <div className='info-table-header'>
          <span>Allow this site to:</span>
        </div>
        <div className='info-table-body'>
          <div className='row'>
            <span>See your address, balance and activity </span>
          </div>
          <div className='row'>
            <span>Suggest transactions to approve</span>
          </div>
        </div>
      </div>

      <div className='description-wrapper'>
        <span>Only connect to websites you trust.</span>
      </div>

      <div className='button-wrapper'>
        <button className='cancel' onClick={onClickCancel}>Cancel</button>
        <button className='connect' onClick={onClickConnect}>Connect</button>
      </div>
    </WalletConnectWrapper>
  );
};

export default WalletConnect;