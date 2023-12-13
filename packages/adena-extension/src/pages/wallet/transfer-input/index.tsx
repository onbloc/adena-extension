import React from 'react';
import TransferInputLayout from '@layouts/transfer-input-layout/transfer-input-layout';
import TransferInputContainer from './transfer-input-container';

const TransferInput: React.FC = () => {
  return <TransferInputLayout transaferInput={<TransferInputContainer />} />;
};

export default TransferInput;