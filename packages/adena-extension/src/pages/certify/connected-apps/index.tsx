import theme from '@styles/theme';
import Text from '@components/text';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { WalletState } from '@states/index';
import LoadingNft from '@components/loading-screen/loading-nft';
import ListBox, { ListHierarchy } from '@components/list-box';
import DefaultImage from '../../../assets/favicon-default-small.svg';
import { useNavigate } from 'react-router-dom';
import CloseShadowButton from '@components/buttons/close-shadow-button';
import disconnected from '../../../assets/disconnected.svg';
import { useAdenaContext } from '@hooks/use-context';
import { useCurrentAccount } from '@hooks/use-current-account';
import { useNetwork } from '@hooks/use-network';

export const ConnectedApps = () => {
  const { establishService } = useAdenaContext();
  const { currentAccount } = useCurrentAccount();
  const navigate = useNavigate();
  const [state] = useRecoilState(WalletState.state);
  const [datas, setDatas] = useState<any>([]);
  const { currentNetwork } = useNetwork();

  useEffect(() => {
    updateDatas();
  }, []);

  const onClickDisconnect = async (item: any) => {
    if (!currentAccount) {
      return;
    }
    await establishService.unestablishBy(currentAccount.id, currentNetwork.networkId, item.hostname);
    await updateDatas();
  };

  const updateDatas = async () => {
    if (!currentAccount) {
      return;
    }
    const establishedSites = await establishService.getEstablisedSitesBy(currentAccount.id, currentNetwork.networkId);
    setDatas(establishedSites);
  };

  const renderAppItem = (item: any, index: number) => {
    return (
      <ListBox
        left={
          <img
            className='logo'
            src={item.favicon !== null ? item.favicon : DefaultImage}
            alt='logo image'
          />
        }
        center={
          <Text type='body2Bold' className='connected-hostname'>
            {`${item.hostname}${item.hostname}${item.hostname}${item.hostname}${item.hostname}${item.hostname}${item.hostname}${item.hostname}`}
          </Text>
        }
        right={
          <DisconnectedBtn onClick={() => onClickDisconnect(item)}>
            <img src={disconnected} alt='disconnected button' />
          </DisconnectedBtn>
        }
        cursor='default'
        hoverAction={false}
        key={index}
        mode={ListHierarchy.Static}
      />
    );
  };

  return (
    <Wrapper>
      <Text type='header4' margin='0px 0px 12px'>
        Connected Apps
      </Text>
      {state === 'FINISH' ? (
        <>
          {datas.length > 0 ? (
            datas.map(renderAppItem)
          ) : (
            <Text className='desc' type='body1Reg' color={theme.color.neutral[9]}>
              No connections
            </Text>
          )}
          <CloseShadowButton onClick={() => navigate(-1)} />
        </>
      ) : (
        <LoadingNft />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  ${({ theme }) => theme.mixins.flexbox('column', 'flex-start', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 24px;
  padding-bottom: 120px;
  background-color: ${({ theme }) => theme.color.neutral[7]};
  .desc {
    position: absolute;
    top: 210px;
    left: 0px;
    width: 100%;
    text-align: center;
  }

  .connected-hostname {
    max-width: 234px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DisconnectedBtn = styled.button`
  ${({ theme }) => theme.mixins.flexbox('row', 'center', 'center')};
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  border-radius: 35px;
  background-color: ${({ theme }) => theme.color.red[2]};
  transition: all ease 0.4s;
  margin-left: auto;
  :hover {
    background-color: ${({ theme }) => theme.color.red[5]};
  }
`;
