export const validateDoContractRequest = (requestData: any) => {
  if (typeof requestData?.gasFee !== 'number') {
    if (Number.isNaN(parseInt(`${requestData?.gasFee}`))) {
      return false;
    }
  }
  if (typeof requestData?.gasWanted !== 'number') {
    if (Number.isNaN(parseInt(`${requestData?.gasWanted}`))) {
      return false;
    }
  }
  if (!Array.isArray(requestData?.messages)) {
    return false;
  }
  return true;
};

export const validateTrasactionMessageOfBankSend = (message: { [key in string]: any }) => {
  if (!message.type || !message.value) {
    return false;
  }
  if (message.type !== '/bank.MsgSend') {
    return false;
  }
  if (typeof message.value !== 'object') {
    return false;
  }
  if (!message.value.to_address || typeof message.value.to_address !== 'string') {
    return false;
  }
  if (!message.value.from_address || typeof message.value.from_address !== 'string') {
    return false;
  }
  if (!message.value.amount || typeof message.value.amount !== 'string') {
    return false;
  }

  return true;
};

export const validateTrasactionMessageOfVmCall = (message: { [key in string]: any }) => {
  if (!message.type || !message.value) {
    return false;
  }
  if (message.type !== '/vm.m_call') {
    return false;
  }
  if (typeof message.value !== 'object') {
    return false;
  }
  if (Object.keys(message.value).indexOf('caller') === -1) {
    return false;
  }
  if (Object.keys(message.value).indexOf('send') === -1) {
    return false;
  }
  if (Object.keys(message.value).indexOf('pkg_path') === -1) {
    return false;
  }
  if (Object.keys(message.value).indexOf('func') === -1) {
    return false;
  }
  if (Object.keys(message.value).indexOf('args') === -1) {
    return false;
  }

  return true;
};

export const validateTrasactionMessageOfAddPkg = (message: { [key in string]: any }) => {
  if (!message.type || !message.value) {
    return false;
  }
  if (message.type !== '/vm.m_addpkg') {
    return false;
  }
  if (typeof message.value !== 'object') {
    return false;
  }
  if (typeof message.value.creator !== 'string') {
    return false;
  }
  if (typeof message.value.deposit !== 'string') {
    return false;
  }
  if (typeof message.value.package !== 'object') {
    return false;
  }

  const packageValue = message.value.package;
  if (typeof packageValue?.Name !== 'string') {
    return false;
  }
  if (typeof packageValue?.Path !== 'string') {
    return false;
  }
  if (!Array.isArray(packageValue?.Files)) {
    return false;
  }
  return true;
};
