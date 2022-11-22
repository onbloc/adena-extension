import { HistoryItem } from "gno-client/src/api/response";
import theme from "@styles/theme";
import { amountSetSymbol, formatAddress, minFractionDigits } from "@common/utils/client-utils";
import { useTokenConfig } from "./use-token-config";

export const useTransactionHistoryInfo = (): [{
    getIcon: (transactionItem: HistoryItem) => string | undefined,
    getStatusColor: (transactionItem: HistoryItem) => string,
    getFunctionName: (transactionItem: HistoryItem) => string,
    getDescription: (transactionItem: HistoryItem) => string,
    getAmountValue: (transactionItem: HistoryItem) => string,
    getAmountFullValue: (transactionItem: HistoryItem) => string,
    getNetworkFee: (transactionItem: HistoryItem) => string,
    getTransferInfo: (transactionItem: HistoryItem) => { transferType: string, transferAddress: string } | null,
}] => {

    const [, convertUnit, getTokenImage] = useTokenConfig();

    const getIcon = (transactionItem: HistoryItem) => {
        return getTokenImage(transactionItem.send.denom);
    }

    const getStatusColor = (transactionItem: HistoryItem) => {
        const { func, result } = transactionItem;
        if (func === 'Receive' && result.status === 'Success') {
            return theme.color.green[2];
        } else if (result.status === 'Success') {
            return theme.color.neutral[0];
        } else if (result.status === 'Failed') {
            return theme.color.neutral[9];
        }
        return theme.color.neutral[9];
    }

    const getFunctionName = (transactionItem: HistoryItem) => {
        const { func, type } = transactionItem;
        if (type === '/bank.MsgSend') {
            if (['Failed'].includes(func)) {
                return 'Send';
            }
        }
        return func;
    }

    const getDescription = (transactionItem: HistoryItem) => {
        const { func, type } = transactionItem;
        switch (func) {
            case 'Send':
                return `To: ${formatAddress(transactionItem.to ?? '', 4)}`;
            case 'Receive':
                return `To: ${formatAddress(transactionItem.from ?? '', 4)}`
            default:
                break;
        }
        switch (type) {
            case '/vm.m_addpkg':
                return 'AddPkg';
            case '/vm.m_call':
                return `pkg: ${transactionItem.type}`;
            default:
                return `pkg: ${transactionItem.type}`;
        }
    }

    const getAmountValue = (transactionItem: HistoryItem) => {
        const result = convertUnit(transactionItem.send.value, transactionItem.send.denom, 'COMMON');
        return `${amountSetSymbol(result.amount)} ${result.denom}`;
    }

    const getAmountFullValue = (transactionItem: HistoryItem) => {
        const result = convertUnit(transactionItem.send.value, transactionItem.send.denom, 'COMMON');
        return `${minFractionDigits(result.amount, 6)} ${result.denom}`;
    }

    const getNetworkFee = (transactionItem: HistoryItem) => {
        const result = convertUnit(transactionItem.fee.value, transactionItem.fee.denom, 'COMMON');
        return `${minFractionDigits(result.amount, 6)} ${result.denom}`;
    }

    const getTransferInfo = (transactionItem: HistoryItem) => {
        if (transactionItem.type !== '/bank.MsgSend') {
            return null;
        }
        const isSend = transactionItem.func === 'Send';
        return {
            transferType: isSend ? "Send" : "From",
            transferAddress: isSend ? transactionItem.to ?? '' : transactionItem.from ?? ''
        }
    }

    return [{
        getIcon,
        getStatusColor,
        getFunctionName,
        getDescription,
        getAmountValue,
        getAmountFullValue,
        getNetworkFee,
        getTransferInfo
    }];
}