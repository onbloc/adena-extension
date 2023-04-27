import { RoutePath } from '@router/path';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordValidationError } from '@common/errors';
import { useAdenaContext, useWalletContext } from '@hooks/use-context';
import {
  validateEmptyPassword,
  validateNotMatchConfirmPassword,
  validateWrongPasswordLength,
} from '@common/validation';
import {
  AdenaWallet,
  LedgerAccount,
  LedgerConnector,
  LedgerKeyring,
  deserializeAccount,
  isLedgerAccount,
} from 'adena-module';

interface LocationState {
  accounts: Array<string>;
  currentAccount: string | null;
}

export const useLedgerPassword = () => {
  const location = useLocation();
  const { walletService, accountService } = useAdenaContext();
  const { updateWallet } = useWalletContext();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputs, setInputs] = useState({
    pwd: '',
    confirmPwd: '',
  });
  const [terms, setTerms] = useState(false);
  const [isPwdError, setIsPwdError] = useState(false);
  const [isConfirmPwdError, setIsConfirmPwdError] = useState(false);
  const { pwd, confirmPwd } = inputs;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsPwdError(false);
    setIsConfirmPwdError(false);
    setErrorMessage('');
  }, [pwd, confirmPwd]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terms && pwd && confirmPwd) {
      nextButtonClick();
    }
  };

  const handleTermsChange = () => setTerms((prev: boolean) => !prev);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputs((input) => ({ ...input, [name]: value }));
    },
    [pwd, confirmPwd],
  );

  const validationConfirmPassword = (isValidPassword?: boolean) => {
    const password = pwd;
    const confirmPassword = confirmPwd;
    try {
      if (validateNotMatchConfirmPassword(password, confirmPassword)) return true;
    } catch (error) {
      if (error instanceof PasswordValidationError) {
        switch (error.getType()) {
          case 'NOT_MATCH_CONFIRM_PASSWORD':
            setIsConfirmPwdError(true);
            break;
          default:
            break;
        }
        if (isValidPassword) {
          setErrorMessage(error.message);
        }
      }
    }
    return false;
  };

  const validationPassword = () => {
    const password = pwd;
    try {
      validateEmptyPassword(password);
      validateWrongPasswordLength(password);
      return true;
    } catch (error) {
      console.log(error);
      setIsPwdError(true);
      if (error instanceof PasswordValidationError) {
        setErrorMessage(error.message);
      }
    }
    return false;
  };

  const validationCheck = async () => {
    const isValidPassword = validationPassword();
    const isValidConfirmPassword = validationConfirmPassword(isValidPassword);

    try {
      if (isValidPassword && isValidConfirmPassword) {
        return 'FINISH';
      }
    } catch (error) {
      console.error(error);
    }
    return 'FAIL';
  };

  const nextButtonClick = async () => {
    const validationState = await validationCheck();
    if (validationState === 'FINISH') {
      const { accounts } = location.state as LocationState;
      const transport = await LedgerConnector.openConnected();
      if (!transport) {
        return;
      }
      const deserializeAccounts = accounts.map(deserializeAccount).filter(isLedgerAccount);
      const keyring = await LedgerKeyring.fromLedger(new LedgerConnector(transport));
      const mappedAccounts = deserializeAccounts.map((account) => {
        return {
          ...account.toData(),
          name: `Ledger ${account.hdPath + 1}`,
          keyringId: keyring.id,
        };
      });
      const ledgerWallet = new AdenaWallet({
        accounts: [...mappedAccounts],
        keyrings: [keyring.toData()],
        currentAccountId: mappedAccounts[0]?.id,
      });
      await walletService.saveWallet(ledgerWallet, pwd);
      await transport.close();
      navigate(RoutePath.ApproveHardwareWalletLedgerAllSet);
      return;
    }
  };

  return {
    pwdState: {
      value: pwd,
      onChange: onChange,
      error: isPwdError,
      ref: inputRef,
    },
    confirmPwdState: {
      value: confirmPwd,
      onChange: onChange,
      error: isConfirmPwdError,
    },
    termsState: {
      value: terms,
      onChange: handleTermsChange,
    },
    errorMessage: errorMessage,
    buttonState: {
      onClick: nextButtonClick,
      disabled: terms && pwd && confirmPwd ? false : true,
    },
    onKeyDown,
  };
};
