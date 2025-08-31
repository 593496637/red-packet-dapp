import { useBalance, useAccount, useChainId } from "wagmi";
import { formatEther } from "viem";

interface UseWalletBalanceReturn {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * 自定义Hook，用于获取和管理用户钱包余额
 * 支持实时更新和错误处理
 * 
 * 注意：此Hook会每30秒轮询一次余额数据，这是正常的Web3应用行为
 * 轮询目的：
 * 1. 检测用户余额变化（接收转账、交易确认等）
 * 2. 确保余额显示的准确性
 * 3. 支持多设备间的数据同步
 * 
 * 网络请求会发送到当前网络的RPC端点：
 * - 主网：Ethereum Mainnet RPC
 * - 测试网：Sepolia Testnet RPC (如 https://sepolia.drpc.org/)
 */
export function useWalletBalance(): UseWalletBalanceReturn {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // 获取钱包余额
  const {
    data: balanceData,
    isLoading,
    refetch,
  } = useBalance({
    address,
    query: {
      enabled: Boolean(address && isConnected),
      refetchInterval: 30000, // 每30秒刷新一次余额（降低轮询频率）
      staleTime: 15000, // 15秒内的数据认为是新鲜的
      // 在页面失去焦点时停止轮询，页面聚焦时恢复
      refetchOnWindowFocus: true,
    },
  });

  // 格式化余额显示
  const formatBalance = (balance: bigint): string => {
    const ethBalance = formatEther(balance);
    const numBalance = parseFloat(ethBalance);
    
    if (numBalance === 0) return "0";
    if (numBalance < 0.0001) return "< 0.0001";
    if (numBalance < 1) return numBalance.toFixed(4);
    if (numBalance < 1000) return numBalance.toFixed(3);
    
    // 对于大数值，使用科学计数法或K/M表示
    if (numBalance >= 1000000) {
      return (numBalance / 1000000).toFixed(2) + "M";
    }
    if (numBalance >= 1000) {
      return (numBalance / 1000).toFixed(2) + "K";
    }
    
    return numBalance.toFixed(3);
  };

  // 获取当前网络的币种符号
  const getCurrencySymbol = (): string => {
    switch (chainId) {
      case 1: // Mainnet
        return "ETH";
      case 11155111: // Sepolia
        return "ETH";
      default:
        return "ETH";
    }
  };

  const balance = balanceData?.value ? formatEther(balanceData.value) : "0";
  const formattedBalance = balanceData?.value 
    ? `${formatBalance(balanceData.value)} ${getCurrencySymbol()}`
    : `0 ${getCurrencySymbol()}`;

  return {
    balance,
    formattedBalance,
    isLoading: isLoading && isConnected,
    refetch,
  };
}

/**
 * 简化版本的Hook，只返回格式化的余额字符串
 */
export function useFormattedBalance(): string {
  const { formattedBalance, isLoading } = useWalletBalance();
  
  if (isLoading) return "加载中...";
  return formattedBalance;
}
