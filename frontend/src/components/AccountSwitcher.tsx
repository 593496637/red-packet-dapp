import { useState, useEffect, useRef } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useENS } from "../hooks/useENS";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useENSRefresh } from "../contexts/ENSRefreshContext";
import toast from "react-hot-toast";

interface AccountSwitcherProps {
  className?: string;
  showBalance?: boolean;
}

export function AccountSwitcher({ className = "", showBalance = true }: AccountSwitcherProps) {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const previousAddress = useRef<string | undefined>(address);

  // 获取当前账户的ENS信息
  const { ensName, displayName, avatarUrl, isLoading: ensLoading, refetch: refetchENS } = useENS({ 
    address, 
    enabled: isConnected 
  });

  // 获取当前账户余额
  const { formattedBalance, isLoading: balanceLoading, refetch: refetchBalance } = useWalletBalance();

  // 获取ENS刷新上下文
  const ensRefreshContext = useENSRefresh();

  // 监听账户变更，在切换账户后刷新ENS和余额数据
  useEffect(() => {
    // 如果地址发生变化且都不为空，说明是账户切换
    if (previousAddress.current && address && previousAddress.current !== address && isConnected) {
      console.log(`账户从 ${previousAddress.current} 切换到 ${address}`);
      
      // 延迟300ms后刷新数据，确保钱包状态稳定
      const timer = setTimeout(() => {
        refetchENS();
        refetchBalance();
        // 注意：不显示账户切换Toast，因为网络切换会触发网络Toast
        // 这避免了网络切换时同时显示两个Toast的问题
      }, 300);

      // 更新previous address
      previousAddress.current = address;
      
      return () => clearTimeout(timer);
    } else if (address && !previousAddress.current && isConnected) {
      // 首次连接钱包时也需要刷新ENS数据
      console.log(`首次连接钱包: ${address}`);
      const timer = setTimeout(() => {
        refetchENS();
        refetchBalance();
      }, 300);
      previousAddress.current = address;
      return () => clearTimeout(timer);
    } else {
      // 更新previous address
      previousAddress.current = address;
    }
  }, [address, isConnected, refetchENS, refetchBalance]);

  // 注册ENS刷新函数到全局上下文，以便网络切换时调用
  useEffect(() => {
    ensRefreshContext.registerRefreshFunction(() => {
      refetchENS();
      refetchBalance();
    });
  }, [refetchENS, refetchBalance, ensRefreshContext]);

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 处理账户切换
  const handleAccountSwitch = () => {
    // 对于MetaMask，我们可以触发账户选择
    if (connector?.name === 'MetaMask' && (window as any).ethereum) {
      (window as any).ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      }).then(() => {
        // 权限请求完成后，账户会自动切换
        setIsOpen(false);
        // 延迟刷新，等待账户切换完成
        setTimeout(() => {
          refetchENS();
          refetchBalance();
          // 手动账户切换时显示Toast
          toast.success("账户已切换，正在更新信息...", { duration: 2000 });
        }, 1000);
      }).catch((error: Error) => {
        console.error('账户切换失败:', error);
        toast.error('账户切换失败，请重试');
      });
    } else {
      // 对于其他钱包，先断开再重新连接
      disconnect();
      setIsOpen(false);
    }
  };

  // 处理连接不同的钱包
  const handleConnectWallet = (connectorInstance: any) => {
    connect({ connector: connectorInstance });
    setIsOpen(false);
  };

  // 处理断开连接
  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 当前账户信息 - 可点击 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 w-full text-left"
      >
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          {ensLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse border-2 border-gray-200" />
          ) : (
            <img 
              src={avatarUrl} 
              alt={ensName || "Avatar"}
              className="w-10 h-10 rounded-full border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
              }}
            />
          )}
        </div>
        
        {/* 用户信息 */}
        <div className="flex-grow min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {ensLoading ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            ) : (
              displayName
            )}
          </div>
          
          {/* 地址或余额信息 */}
          <div className="text-sm text-gray-500 truncate">
            {showBalance ? (
              balanceLoading ? (
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              ) : (
                formattedBalance
              )
            ) : (
              formatAddress(address || "")
            )}
          </div>
          
          {/* ENS状态 */}
          {!ensLoading && ensName && (
            <div className="text-xs text-green-600 truncate">
              ✓ {ensName}
            </div>
          )}
        </div>
        
        {/* 下拉箭头 */}
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* 当前账户信息详情 */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900 mb-1">当前账户</div>
            <div className="text-xs text-gray-500 font-mono break-all">
              {address}
            </div>
            {showBalance && (
              <div className="text-sm text-gray-700 mt-2">
                余额: {formattedBalance}
              </div>
            )}
            {connector && (
              <div className="text-xs text-gray-500 mt-1">
                通过 {connector.name} 连接
              </div>
            )}
          </div>

          {/* 账户操作 */}
          <div className="py-1">
            {/* 切换账户 */}
            <button
              onClick={handleAccountSwitch}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              切换账户
            </button>

            {/* 连接其他钱包 */}
            {connectors.filter(c => c.id !== connector?.id).map((connectorInstance) => (
              <button
                key={connectorInstance.id}
                onClick={() => handleConnectWallet(connectorInstance)}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {connectorInstance.name === 'MetaMask' && (
                    <div className="w-5 h-5 bg-orange-500 rounded"></div>
                  )}
                  {connectorInstance.name === 'WalletConnect' && (
                    <div className="w-5 h-5 bg-blue-500 rounded"></div>
                  )}
                  {connectorInstance.name === 'Injected' && (
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  )}
                </div>
                连接 {connectorInstance.name}
              </button>
            ))}

            {/* 分割线 */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* 复制地址 */}
            <button
                          onClick={() => {
              if (address) {
                navigator.clipboard.writeText(address);
                toast.success("地址已复制到剪贴板");
              }
              setIsOpen(false);
            }}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制地址
            </button>

            {/* 断开连接 */}
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              断开连接
            </button>
          </div>
        </div>
      )}

      {/* 点击外部关闭菜单 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
