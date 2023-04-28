import styled from 'styled-components';

export const ManageTokenSearchInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.color.neutral[8]};
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.color.neutral[6]};

  .search-icon-wrapper {
    display: inline-flex;
    flex-shrink: 0;
    width: fit-content;
    align-items: center;
    padding: 0 5px;

    .search {
      width: 17px;
      height: 17px;
    }
  }

  .input-wrapper {
    display: inline-flex;
    flex-shrink: 1;
    width: 100%;
    height: 24px;
    padding: 0 12px;

    .search-input {
      width: 100%;
      ${({ theme }) => theme.fonts.body2Reg};
    }
  }

  .added-icon-wrapper {
    display: inline-flex;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    align-items: center;
    cursor: pointer;

    .added {
      width: 100%;
      height: 100%;
    }
  }
`;
