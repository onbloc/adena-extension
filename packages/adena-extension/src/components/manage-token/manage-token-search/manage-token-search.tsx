import React from 'react';
import { ManageTokenSearchWrapper } from './manage-token-search.styles';
import { ManageTokenInfo } from '@containers/manage-token-search-container/manage-token-search-container';
// import ManageTokenSearchInput from '@components/manage-token/manage-token-search-input/manage-token-search-input';
import ManageTokenList from '@components/manage-token/manage-token-list/manage-token-list';
import ManageTokenSearchInput from '../manage-token-search-input/manage-token-search-input';

export interface ManageTokenSearchProps {
  keyword: string;
  tokens: ManageTokenInfo[];
  onClickAdded: () => void;
  onChangeKeyword: (keyword: string) => void;
  onToggleActiveItem: (tokenId: string, activated: boolean) => void;
}

const ManageTokenSearch: React.FC<ManageTokenSearchProps> = ({
  keyword,
  tokens,
  onClickAdded,
  onChangeKeyword,
  onToggleActiveItem,
}) => {
  return (
    <ManageTokenSearchWrapper>
      <div className='input-wrapper'>
        <ManageTokenSearchInput
          keyword={keyword}
          onClickAdded={onClickAdded}
          onChangeKeyword={onChangeKeyword}
        />
      </div>
      <div className='list-wrapper'>
        <ManageTokenList
          tokens={tokens}
          onToggleActiveItem={onToggleActiveItem}
        />
      </div>
    </ManageTokenSearchWrapper>
  );
};

export default ManageTokenSearch;