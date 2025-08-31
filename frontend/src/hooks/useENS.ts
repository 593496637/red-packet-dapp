import { useEnsName, useEnsAvatar } from "wagmi";
import { mainnet } from "wagmi/chains";
import type { Address } from "viem";

interface UseENSOptions {
  address?: Address | string;
  enabled?: boolean;
}

interface UseENSReturn {
  ensName: string | null | undefined;
  ensAvatar: string | null | undefined;
  isLoading: boolean;
  displayName: string;
  avatarUrl: string;
  hasEns: boolean; // 是否有 ENS 名称
  refetch: () => void; // 强制刷新ENS数据
}

/**
 * 自定义Hook，用于获取ENS名称和头像
 * 自动处理类型转换和错误状态
 */
export function useENS({ address, enabled = true }: UseENSOptions): UseENSReturn {
  // 获取ENS名称 - 强制使用主网进行 ENS 解析
  const { 
    data: ensName, 
    isLoading: isLoadingName,
    refetch: refetchName
  } = useEnsName({ 
    address: address as Address,
    chainId: mainnet.id, // 强制使用以太坊主网解析 ENS
    query: {
      enabled: Boolean(address && enabled),
      retry: 1, // 减少重试次数避免过多请求
      staleTime: 1000 * 60 * 5, // 5分钟缓存
      refetchOnWindowFocus: false, // 避免频繁刷新
      refetchOnReconnect: false,
    }
  });

  // 获取ENS头像，只有当有ENS名称时才查询 - 同样使用主网
  const { 
    data: ensAvatar, 
    isLoading: isLoadingAvatar,
    refetch: refetchAvatar
  } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id, // 强制使用以太坊主网解析头像
    query: {
      enabled: Boolean(ensName && enabled),
      retry: 1, // 减少重试次数
      staleTime: 1000 * 60 * 5, // 5分钟缓存
      refetchOnWindowFocus: false, // 避免频繁刷新
      refetchOnReconnect: false,
    }
  });

  // 格式化地址用于显示
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 生成默认头像URL
  const getDefaultAvatar = (addr: string) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${addr}`;
  };

  // 强制刷新ENS数据的方法
  const refetch = () => {
    refetchName();
    refetchAvatar();
  };

  return {
    ensName,
    ensAvatar,
    isLoading: isLoadingName || isLoadingAvatar,
    displayName: ensName || (address ? formatAddress(address as string) : ''),
    avatarUrl: ensAvatar || (address ? getDefaultAvatar(address as string) : ''),
    hasEns: Boolean(ensName),
    refetch
  };
}

/**
 * 简化版本的Hook，只获取显示名称
 */
export function useDisplayName(address?: Address | string): string {
  const { displayName } = useENS({ address });
  return displayName;
}

/**
 * 简化版本的Hook，只获取头像URL
 */
export function useAvatarUrl(address?: Address | string): string {
  const { avatarUrl } = useENS({ address });
  return avatarUrl;
}