import { decryptAES } from 'adena-module';
import { StorageMigration008 } from './storage-migration-v008';

const mockStorageData = {
  NETWORKS: [],
  CURRENT_CHAIN_ID: 'test4',
  CURRENT_NETWORK_ID: 'test4',
  SERIALIZED: 'U2FsdGVkX19eI8kOCI/T9o1Ru0b2wdj5rHxmG4QbLQ0yZH4kDa8/gg6Ac2JslvEm',
  ENCRYPTED_STORED_PASSWORD: '',
  CURRENT_ACCOUNT_ID: '',
  ACCOUNT_NAMES: {},
  ESTABLISH_SITES: {},
  ADDRESS_BOOK: '',
  ACCOUNT_TOKEN_METAINFOS: {},
  QUESTIONNAIRE_EXPIRED_DATE: null,
  WALLET_CREATION_GUIDE_CONFIRM_DATE: null,
  ADD_ACCOUNT_GUIDE_CONFIRM_DATE: null,
  ACCOUNT_GRC721_COLLECTIONS: {},
  ACCOUNT_GRC721_PINNED_PACKAGES: {},
};

describe('serialized wallet migration V008', () => {
  it('version', () => {
    const migration = new StorageMigration008();
    expect(migration.version).toBe(8);
  });

  it('up success', async () => {
    const mockData = {
      version: 7,
      data: mockStorageData,
    };
    const migration = new StorageMigration008();
    const result = await migration.up(mockData);

    expect(result.data.CURRENT_CHAIN_ID).toEqual('test5');
    expect(result.data.CURRENT_NETWORK_ID).toEqual('test5');
  });

  it('up password success', async () => {
    const mockData = {
      version: 1,
      data: mockStorageData,
    };
    const password = '123';
    const migration = new StorageMigration008();
    const result = await migration.up(mockData);

    expect(result.version).toBe(8);
    expect(result.data).not.toBeNull();
    expect(result.data.ACCOUNT_GRC721_COLLECTIONS).toEqual({});
    expect(result.data.ACCOUNT_GRC721_PINNED_PACKAGES).toEqual({});

    const serialized = result.data.SERIALIZED;
    const decrypted = await decryptAES(serialized, password);
    const wallet = JSON.parse(decrypted);

    expect(wallet.accounts).toHaveLength(0);
    expect(wallet.keyrings).toHaveLength(0);

    expect(result.data.CURRENT_CHAIN_ID).toEqual('test5');
    expect(result.data.CURRENT_NETWORK_ID).toEqual('test5');
  });

  it('up failed throw error', async () => {
    const mockData: any = {
      version: 1,
      data: { ...mockStorageData, SERIALIZED: null },
    };
    const migration = new StorageMigration008();

    await expect(migration.up(mockData)).rejects.toThrow(
      'Storage Data does not match version V007',
    );
  });
});
