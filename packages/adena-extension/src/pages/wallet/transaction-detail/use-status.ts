import { fullDateFormat, getStatusStyle } from '@common/utils/client-utils';
import gnot from '../../../assets/gnot-logo.svg';
import addpkg from '../../../assets/addpkg.svg';
import contract from '../../../assets/contract.svg';
import { useNetwork } from '@hooks/use-network';

interface TxPrototype {
  date: string;
  fee: string;
  from: string;
  func: string;
  hash: string;
  height: string;
  result: object;
  send: string;
  to: string;
  amount: string;
  txhash: string;
}

export interface TxProps {
  protoType: TxPrototype;
  txDesc: string;
  txFunc: string;
  txImg: string;
  txReason: string;
  txSend: string;
  txStatus: string;
  txType: string;
}

type TxTypeValue = '/bank.MsgSend' | '/vm.m_call' | '/vm.m_addpkg' | '/vm.m_run';

export interface ResultTxStateType {
  txStatusStyle: { [key in string]: any };
  txSymbol: string;
  txDate: string;
  txStatus: string;
  txHash: string;
  txFee: string;
  txSend: string;
  txTransfer?: string;
  txAddress?: string;
  txTypeDesc: string;
}

const statusSymbol = {
  '/bank.MsgSend': gnot,
  '/vm.m_call': contract,
  '/vm.m_addpkg': addpkg,
  '/vm.m_run': gnot,
};

type UseStatusReturn = {
  initTxState: (state: TxProps) => ResultTxStateType;
  handleLinkClick: (hash: string) => void;
};

const useStatus = (): UseStatusReturn => {
  const { currentNetwork } = useNetwork();

  const initTxState = (state: TxProps): ResultTxStateType => {
    let result: ResultTxStateType = {
      txStatusStyle: getStatusStyle(state.txStatus),
      txSymbol: statusSymbol[state.txType as TxTypeValue],
      txDate: fullDateFormat(state.protoType.date),
      txStatus: state?.txStatus || '',
      txHash: state?.protoType?.hash || '',
      txFee: state?.protoType?.fee?.replace('gnot', '') || '',
      txSend: '',
      txTransfer: '',
      txAddress: '',
      txTypeDesc: '',
    };

    if ((state.txType as TxTypeValue) === '/bank.MsgSend') {
      const isSend = state.txFunc === 'Sent';
      result = {
        ...result,
        txTypeDesc: isSend ? 'Send' : 'Receive',
        txSend: `${state.txSend} GNOT`,
        txTransfer: isSend ? 'To' : 'From',
        txAddress: isSend ? state.protoType.to : state.protoType.from,
      };
    }
    if ((state.txType as TxTypeValue) === '/vm.m_call') {
      result = {
        ...result,
        txTypeDesc: 'Contract Interaction',
        txSend: state.txFunc,
      };
    }
    if ((state.txType as TxTypeValue) === '/vm.m_addpkg') {
      result = {
        ...result,
        txTypeDesc: 'Add Package',
        txSend: 'AddPkg',
      };
    }
    if ((state.txType as TxTypeValue) === '/vm.m_run') {
      result = {
        ...result,
        txTypeDesc: 'Run',
        txSend: 'Run',
      };
    }
    return result;
  };

  const handleLinkClick = (hash: string): void => {
    window.open(
      `${currentNetwork?.linkUrl ?? 'https://gnoscan.io'}/transactions/details?txhash=${hash}`,
      '_blank',
    );
  };

  return {
    initTxState,
    handleLinkClick,
  };
};

export default useStatus;
