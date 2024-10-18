import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TokenValidationError } from '@common/errors';
import { parseReamPathItemsByPath } from '@common/utils/parse-utils';
import { isGRC20TokenModel } from '@common/validation';
import AdditionalToken from '@components/pages/additional-token/additional-token';
import { AddingType } from '@components/pages/additional-token/additional-token-type-selector';
import { ManageTokenLayout } from '@components/pages/manage-token-layout';
import useAppNavigate from '@hooks/use-app-navigate';
import { useDebounce } from '@hooks/use-debounce';
import { useGRC20Token } from '@hooks/use-grc20-token';
import { useGRC20Tokens } from '@hooks/use-grc20-tokens';
import { useNetwork } from '@hooks/use-network';
import { useTokenMetainfo } from '@hooks/use-token-metainfo';
import { RoutePath, TokenInfo } from '@types';

const ManageTokenAddedContainer: React.FC = () => {
  const { navigate, goBack } = useAppNavigate();
  const { tokenMetainfos, addGRC20TokenMetainfo } = useTokenMetainfo();
  const { currentNetwork } = useNetwork();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedTokenInfo, setSelectedTokenInfo] = useState<TokenInfo | null>(null);
  const [finished, setFinished] = useState(false);
  const [addingType, setAddingType] = useState(AddingType.SEARCH);
  const [manualTokenPath, setManualTokenPath] = useState('');

  const { data: grc20Tokens } = useGRC20Tokens();

  const {
    debouncedValue: debouncedManualTokenPath,
    setDebouncedValue: setDebouncedManualTokenPath,
    isLoading: isLoadingDebounce,
  } = useDebounce(manualTokenPath, 500);
  const { data: manualGRC20Token, isFetching: isFetchingManualGRC20Token } =
    useGRC20Token(debouncedManualTokenPath);

  const isValidManualGRC20Token = useMemo(() => {
    if (manualTokenPath === '') {
      return true;
    }

    try {
      parseReamPathItemsByPath(manualTokenPath);
      return true;
    } catch {
      return false;
    }
  }, [manualTokenPath]);

  const errorManualGRC20Token = useMemo(() => {
    if (manualTokenPath === '') {
      return null;
    }

    if (!isValidManualGRC20Token) {
      return new TokenValidationError('INVALID_REALM_PATH');
    }

    const isLoading = isLoadingDebounce || isLoadingManualGRC20Token;
    if (!isLoading && manualGRC20Token === null) {
      return new TokenValidationError('INVALID_REALM_PATH');
    }

    const isRegistered = tokenMetainfos.some((tokenMetaInfo) => {
      if (tokenMetaInfo.tokenId === manualTokenPath) {
        return true;
      }

      if (isGRC20TokenModel(tokenMetaInfo)) {
        return tokenMetaInfo.pkgPath === manualTokenPath;
      }

      return false;
    });
    if (isRegistered) {
      return new TokenValidationError('ALREADY_ADDED');
    }

    return null;
  }, [tokenMetainfos, isLoadingDebounce, manualGRC20Token, manualTokenPath]);

  const isLoadingManualGRC20Token = useMemo(() => {
    if (!isValidManualGRC20Token) {
      return false;
    }

    return isLoadingDebounce || isFetchingManualGRC20Token;
  }, [isValidManualGRC20Token, isLoadingDebounce, isFetchingManualGRC20Token]);

  const tokenInfos: TokenInfo[] = useMemo(() => {
    if (!grc20Tokens) {
      return [];
    }

    return grc20Tokens
      .filter((token) => token.networkId === currentNetwork.networkId)
      .filter(
        (token) =>
          !tokenMetainfos.find(
            (tokenMetainfo) =>
              tokenMetainfo.tokenId === token.tokenId &&
              tokenMetainfo.networkId === token.networkId,
          ),
      )
      .filter(
        (token) =>
          token?.pkgPath.includes(keyword) ||
          token?.symbol.includes(keyword) ||
          token?.name.includes(keyword),
      )
      .map((token) => ({
        tokenId: token?.tokenId,
        name: token?.name,
        symbol: token?.symbol,
        path: token?.pkgPath,
        decimals: token?.decimals,
        chainId: token?.networkId,
        pathInfo: token?.pkgPath.replace('gno.land/', ''),
      }));
  }, [grc20Tokens, keyword]);

  const closeSelectBox = (): void => {
    setOpened(false);
  };

  const onChangeKeyword = useCallback((keyword: string) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+`/\\\\[\]'";.,?<>]*$/;
    if (!regex.test(keyword)) {
      return;
    }
    setKeyword(keyword);
  }, []);

  const onChangeManualTokenPath = useCallback((tokenPath: string) => {
    setManualTokenPath(tokenPath);
  }, []);

  const selectAddingType = useCallback((addingType: AddingType) => {
    setAddingType(addingType);
    setKeyword('');
    setManualTokenPath('');
    setDebouncedManualTokenPath('');
    setSelectedTokenInfo(null);
    setOpened(false);
    setSelected(false);
  }, []);

  const onClickListItem = useCallback(
    (tokenId: string) => {
      const tokenInfo = tokenInfos?.find((tokenInfo) => tokenInfo.tokenId === tokenId);
      if (!tokenInfo) {
        return;
      }

      setSelected(true);
      setSelectedTokenInfo(tokenInfo);
      setOpened(false);
    },
    [tokenInfos],
  );

  const onClickCancel = useCallback(() => {
    navigate(RoutePath.Wallet);
  }, []);

  const onClickAdd = useCallback(async () => {
    if (errorManualGRC20Token) {
      return;
    }

    if (!selected || !selectedTokenInfo || finished) {
      return;
    }

    await addGRC20TokenMetainfo(selectedTokenInfo);
    setFinished(true);
  }, [selected, selectedTokenInfo, finished]);

  useEffect(() => {
    document.body.addEventListener('click', closeSelectBox);
    return () => document.body.removeEventListener('click', closeSelectBox);
  }, [document.body]);

  useEffect(() => {
    if (finished) {
      goBack();
    }
  }, [finished]);

  useEffect(() => {
    if (addingType === AddingType.SEARCH) {
      return;
    }

    if (isLoadingManualGRC20Token) {
      setSelectedTokenInfo(null);
      return;
    }

    if (!manualGRC20Token) {
      setSelectedTokenInfo(null);
      return;
    }

    setSelected(true);
    setSelectedTokenInfo({
      tokenId: manualGRC20Token.tokenId,
      name: manualGRC20Token.name,
      symbol: manualGRC20Token.symbol,
      path: manualGRC20Token.pkgPath,
      decimals: manualGRC20Token.decimals,
      chainId: manualGRC20Token.networkId,
      pathInfo: manualGRC20Token.pkgPath.replace('gno.land/', ''),
    });
  }, [addingType, manualGRC20Token, isLoadingManualGRC20Token]);

  return (
    <ManageTokenLayout>
      <AdditionalToken
        opened={opened}
        addingType={addingType}
        selected={selected}
        keyword={keyword}
        tokenInfos={tokenInfos ?? []}
        manualTokenPath={manualTokenPath}
        isLoadingManualGRC20Token={isLoadingManualGRC20Token}
        errorManualGRC20Token={errorManualGRC20Token}
        selectedTokenInfo={selectedTokenInfo}
        selectAddingType={selectAddingType}
        onChangeKeyword={onChangeKeyword}
        onChangeManualTokenPath={onChangeManualTokenPath}
        onClickOpenButton={setOpened}
        onClickListItem={onClickListItem}
        onClickBack={goBack}
        onClickCancel={onClickCancel}
        onClickAdd={onClickAdd}
      />
    </ManageTokenLayout>
  );
};

export default ManageTokenAddedContainer;
