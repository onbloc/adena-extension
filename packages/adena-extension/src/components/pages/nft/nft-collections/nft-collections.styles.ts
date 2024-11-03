import styled from 'styled-components';

export const NFTCollectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;

  &.non-items {
    padding-top: 151px;
  }

  .collection-wrapper {
    display: grid;
    width: 100%;
    min-height: auto;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .description {
    position: absolute;
    top: 210px;
    left: 0px;
    width: 100%;
    text-align: center;
  }

  .manage-collection-button-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;