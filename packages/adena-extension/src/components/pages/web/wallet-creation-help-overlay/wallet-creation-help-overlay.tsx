import React, { useEffect, useMemo, useState } from 'react';
import WebHelpOverlay, {
  OverlayItem,
} from '@components/molecules/web-help-overlay/web-help-overlay';
import { WalletCreationHelpOverlayItem } from './wallet-creation-help-overlay.styles';

export interface WalletCreationHelpOverlayProps {
  hardwareWalletButtonRef?: React.RefObject<HTMLButtonElement>;
  airgapAccountButtonRef?: React.RefObject<HTMLButtonElement>;
  advancedOptionButtonRef?: React.RefObject<HTMLButtonElement>;
  onFinish: () => void;
}

function getTooltipPositionY(
  y: number,
  height: number,
  windowHeight: number,
): {
  position: 'top' | 'bottom';
  height: number;
} {
  const positionY = y;
  const boxHeight = height;
  const tooltipHeight = 214;

  if (windowHeight === 0 || y + boxHeight + tooltipHeight < windowHeight) {
    return {
      position: 'bottom',
      height: positionY + boxHeight + 10,
    };
  }

  return {
    position: 'top',
    height: positionY - tooltipHeight - 10,
  };
}

const WalletCreationHelpOverlay: React.FC<WalletCreationHelpOverlayProps> = ({
  hardwareWalletButtonRef,
  airgapAccountButtonRef,
  advancedOptionButtonRef,
  onFinish,
}) => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const hardwareWalletHelpItem: OverlayItem | null = useMemo(() => {
    if (!hardwareWalletButtonRef?.current) return null;
    const { x, y, width, height } = hardwareWalletButtonRef.current.getBoundingClientRect();
    const tooltipPositionInfo = getTooltipPositionY(y, height, windowSize.height);
    return {
      x: x + width / 2,
      y: tooltipPositionInfo.height,
      position: tooltipPositionInfo.position,
      tooltipInfo: {
        securityRate: 2,
        convenienceRate: 2,
        content: (
          <WalletCreationHelpOverlayItem>
            This allows you to connect with accounts
            <br />
            from <b>hardware wallets</b>.
          </WalletCreationHelpOverlayItem>
        ),
      },
    };
  }, [hardwareWalletButtonRef?.current, windowSize]);

  const airgapAccountHelpItem: OverlayItem | null = useMemo(() => {
    if (!airgapAccountButtonRef?.current) return null;
    const { x, y, width, height } = airgapAccountButtonRef.current.getBoundingClientRect();
    const tooltipPositionInfo = getTooltipPositionY(y, height, windowSize.height);
    return {
      x: x + width / 2,
      y: tooltipPositionInfo.height,
      position: tooltipPositionInfo.position,
      tooltipInfo: {
        securityRate: 3,
        convenienceRate: 1,
        content: (
          <WalletCreationHelpOverlayItem>
            This allows you to connect with accounts
            <br />
            from an <b>air-gapped environment</b>.
          </WalletCreationHelpOverlayItem>
        ),
      },
    };
  }, [airgapAccountButtonRef?.current, windowSize]);

  const advancedOptionHelpItem: OverlayItem | null = useMemo(() => {
    if (!advancedOptionButtonRef?.current) return null;
    const { x, y, width, height } = advancedOptionButtonRef.current.getBoundingClientRect();
    const tooltipPositionInfo = getTooltipPositionY(y, height, windowSize.height);
    return {
      x: x + width / 2,
      y: tooltipPositionInfo.height,
      position: tooltipPositionInfo.position,
      tooltipInfo: {
        securityRate: 1,
        convenienceRate: 3,
        content: (
          <WalletCreationHelpOverlayItem>
            This allows you to create or restore accounts
            <br /> with <b>Seed Phrases</b>, <b>Private Key</b> or <b>Google Login</b>.
          </WalletCreationHelpOverlayItem>
        ),
      },
    };
  }, [advancedOptionButtonRef?.current, windowSize]);

  const helpItems = useMemo(() => {
    const items = [hardwareWalletHelpItem, airgapAccountHelpItem, advancedOptionHelpItem];
    if (items.includes(null)) {
      return [];
    }
    return items as OverlayItem[];
  }, [hardwareWalletHelpItem, airgapAccountHelpItem, advancedOptionHelpItem]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = (): void => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    } else {
      return () =>
        window.removeEventListener('resize', () => {
          return null;
        });
    }
  }, []);

  return <WebHelpOverlay items={helpItems} onFinish={onFinish} />;
};

export default WalletCreationHelpOverlay;
