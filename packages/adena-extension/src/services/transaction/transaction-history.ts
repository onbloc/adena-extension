import { TransactionHistoryRepository } from '@repositories/transaction';
import { NetworkMetainfo } from '@states/network';

export class TransactionHistoryService {
  private transactionHisotyrRepository: TransactionHistoryRepository;

  constructor(transactionHisotyrRepository: TransactionHistoryRepository) {
    this.transactionHisotyrRepository = transactionHisotyrRepository;
  }

  public setNetworkMetainfo(networkMetainfo: NetworkMetainfo): void {
    return this.transactionHisotyrRepository.setNetworkMetainfo(networkMetainfo);
  }

  public fetchAllTransactionHistory(
    address: string,
    from: number,
    size?: number,
  ): Promise<{
    hits: number;
    next: boolean;
    txs: import('/Users/limsanghyun/Documents/sourcecode/adena-wallet/packages/adena-extension/src/components/transaction-history/transaction-history/transaction-history').TransactionInfo[];
  }> {
    return this.transactionHisotyrRepository.fetchAllTransactionHistoryBy(address, from, size);
  }

  public fetchNativeTransactionHistory(
    address: string,
    from: number,
    size?: number,
  ): Promise<{
    hits: number;
    next: boolean;
    txs: import('/Users/limsanghyun/Documents/sourcecode/adena-wallet/packages/adena-extension/src/components/transaction-history/transaction-history/transaction-history').TransactionInfo[];
  }> {
    return this.transactionHisotyrRepository.fetchNativeTransactionHistoryBy(address, from, size);
  }

  public fetchGRC20TransactionHistory(
    address: string,
    packagePath: string,
    from: number,
    size?: number,
  ): Promise<{
    hits: number;
    next: boolean;
    txs: import('/Users/limsanghyun/Documents/sourcecode/adena-wallet/packages/adena-extension/src/components/transaction-history/transaction-history/transaction-history').TransactionInfo[];
  }> {
    return this.transactionHisotyrRepository.fetchGRC20TransactionHistoryBy(
      address,
      packagePath,
      from,
      size,
    );
  }
}
