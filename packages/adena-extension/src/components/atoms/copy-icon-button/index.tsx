import React, { useCallback, useEffect, useState } from 'react';
import { CopyButtonWrapper } from './copy-icon-button.styles';
import IconCopy from '@assets/icon-copy';
import IconCopyCheck from '@assets/icon-copy-check';

export interface CopyIconButtonProps {
  className?: string;
  copyText: string;
}

export const CopyIconButton: React.FC<CopyIconButtonProps> = ({ className = '', copyText }) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setChecked(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [checked]);

  const onClickCopyButton = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setChecked(true);
      navigator.clipboard.writeText(copyText);
    },
    [copyText, checked],
  );

  return (
    <CopyButtonWrapper className={className} checked={checked} onClick={onClickCopyButton}>
      {checked ? <IconCopyCheck /> : <IconCopy />}
    </CopyButtonWrapper>
  );
};
