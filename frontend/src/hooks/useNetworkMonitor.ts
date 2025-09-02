import { useEffect, useRef } from 'react';
import { useChainId, useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface NetworkChangeListener {
  onNetworkChange?: (newChainId: number, oldChainId: number) => void;
  showToast?: boolean;
  onENSRefreshNeeded?: () => void; // 网络切换后需要刷新ENS的回调
}

/**
 * 自定义Hook，用于监听网络变更并提供用户提示
 */
export function useNetworkMonitor({ 
  onNetworkChange, 
  showToast = true,
  onENSRefreshNeeded
}: NetworkChangeListener = {}) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const previousChainId = useRef<number | null>(null);
  const onENSRefreshNeededRef = useRef(onENSRefreshNeeded);
  
  // 保持ref中的回调为最新
  onENSRefreshNeededRef.current = onENSRefreshNeeded;

  // 获取网络名称
  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return `网络 ${chainId}`;
    }
  };

  // 检查网络是否支持
  const isSupportedNetwork = (chainId: number): boolean => {
    return [1, 11155111].includes(chainId); // mainnet, sepolia
  };

  useEffect(() => {
    // 只在钱包连接时监听网络变更
    if (!isConnected) {
      previousChainId.current = null;
      return;
    }

    // 如果这是第一次设置chainId
    if (previousChainId.current === null) {
      previousChainId.current = chainId;
      
      // 检查初始网络是否支持
      if (!isSupportedNetwork(chainId)) {
        toast.error(
          `当前网络 "${getNetworkName(chainId)}" 不被支持。请切换到 Ethereum 或 Sepolia 网络。`,
          { duration: 6000 }
        );
      }
      return;
    }

    // 如果网络确实发生了变更
    if (previousChainId.current !== chainId) {
      const oldChainId = previousChainId.current;
      const newNetworkName = getNetworkName(chainId);
      const isSupported = isSupportedNetwork(chainId);

      // 触发回调
      if (onNetworkChange) {
        onNetworkChange(chainId, oldChainId);
      }

      // 触发ENS刷新回调
      if (onENSRefreshNeededRef.current) {
        // 延迟触发，确保网络切换完成
        setTimeout(() => {
          onENSRefreshNeededRef.current?.();
        }, 1000);
      }

      // 显示通知
      if (showToast) {
        if (isSupported) {
          toast.success(`已切换到 ${newNetworkName}`, {
            duration: 3000,
            icon: '🌐'
          });
        } else {
          toast.error(
            `已切换到不支持的网络 "${newNetworkName}"。请切换到 Ethereum 或 Sepolia 网络以继续使用。`,
            { duration: 6000 }
          );
        }
      }

      // 更新previous chainId
      previousChainId.current = chainId;
    }
  }, [chainId, isConnected, onNetworkChange, showToast]);

  return {
    currentChainId: chainId,
    isSupported: isSupportedNetwork(chainId),
    networkName: getNetworkName(chainId),
    isSupportedNetwork,
    getNetworkName
  };
}

/**
 * 简化版本的Hook，只返回网络支持状态
 */
export function useNetworkSupport() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  
  const isSupportedNetwork = (chainId: number): boolean => {
    return [1, 11155111].includes(chainId);
  };

  return {
    isSupported: isConnected ? isSupportedNetwork(chainId) : true, // 未连接时认为支持
    chainId,
    isConnected
  };
}
