import { useState } from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { sepolia, mainnet, goerli, holesky, polygon, bsc, arbitrum, optimism } from "wagmi/chains";
import toast from "react-hot-toast";

interface NetworkInfo {
  id: number;
  name: string;
  symbol: string;
  color: string;
  icon: string;
}

// 支持的网络配置
const SUPPORTED_NETWORKS: NetworkInfo[] = [
  {
    id: mainnet.id,
    name: "Ethereum Mainnet",
    symbol: "ETH",
    color: "bg-blue-500",
    icon: "🌐"
  },
  {
    id: sepolia.id,
    name: "Sepolia Testnet",
    symbol: "ETH",
    color: "bg-purple-500",
    icon: "🔧"
  },
  {
    id: goerli.id,
    name: "Goerli Testnet",
    symbol: "ETH",
    color: "bg-yellow-500",
    icon: "🧪"
  },
  {
    id: holesky.id,
    name: "Holesky Testnet",
    symbol: "ETH",
    color: "bg-indigo-500",
    icon: "🎯"
  },
  {
    id: polygon.id,
    name: "Polygon",
    symbol: "MATIC",
    color: "bg-purple-600",
    icon: "💜"
  },
  {
    id: bsc.id,
    name: "BSC",
    symbol: "BNB",
    color: "bg-yellow-400",
    icon: "🟡"
  },
  {
    id: arbitrum.id,
    name: "Arbitrum One",
    symbol: "ETH",
    color: "bg-blue-600",
    icon: "🔵"
  },
  {
    id: optimism.id,
    name: "Optimism",
    symbol: "ETH",
    color: "bg-red-500",
    icon: "🔴"
  }
];

interface NetworkSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function NetworkSwitcher({ className = "", showLabel = true }: NetworkSwitcherProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  // 获取当前网络信息
  const currentNetwork = SUPPORTED_NETWORKS.find(network => network.id === chainId) || {
    id: chainId,
    name: "未知网络",
    symbol: "ETH",
    color: "bg-gray-500",
    icon: "❓"
  };

  // 处理网络切换
  const handleNetworkSwitch = async (networkId: number) => {
    if (networkId === chainId) {
      setIsOpen(false);
      return;
    }

    try {
      await switchChain({ chainId: networkId });
      const network = SUPPORTED_NETWORKS.find(n => n.id === networkId);
      toast.success(`已切换到 ${network?.name} 网络`);
      setIsOpen(false);
    } catch (error) {
      console.error('网络切换失败:', error);
      toast.error('网络切换失败，请检查钱包设置');
    }
  };

  // 如果未连接钱包，不显示网络切换器
  if (!isConnected) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 当前网络显示按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          chainId === sepolia.id 
            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            : isPending 
              ? "bg-gray-100 cursor-not-allowed opacity-70" 
              : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1`}
      >
        {/* 网络状态指示器 */}
        <div className={`w-3 h-3 rounded-full ${currentNetwork.color} flex items-center justify-center`}>
          {isPending ? (
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          )}
        </div>
        
        {/* 网络名称 */}
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {currentNetwork.name}
          </span>
        )}
        
        {/* 下拉箭头 */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[220px] max-h-80 overflow-y-auto">
          {chainId === sepolia.id && (
            <>
              <div className="px-4 py-2 text-xs text-green-600 bg-green-50 font-medium">
                ✅ 推荐网络：适合红包应用测试
              </div>
              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}
          
          {/* 推荐网络区域 */}
          <div className="px-3 py-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">推荐网络</div>
            {SUPPORTED_NETWORKS.filter(n => n.id === sepolia.id).map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-lg mb-1 ${
                  network.id === chainId ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'text-gray-700'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* 网络图标 */}
                <div className={`w-6 h-6 rounded-full ${network.color} flex items-center justify-center text-white text-xs shadow-sm`}>
                  {network.icon}
                </div>
                
                {/* 网络信息 */}
                <div className="flex-1">
                  <div className="font-medium text-sm">{network.name}</div>
                  <div className="text-xs text-gray-500">{network.symbol}</div>
                </div>
                
                {/* 推荐标签和状态 */}
                <div className="flex items-center gap-2">
                  {network.id === sepolia.id && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">推荐</span>
                  )}
                  {network.id === chainId && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          {/* 其他网络区域 */}
          <div className="px-3 py-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">其他网络</div>
            {SUPPORTED_NETWORKS.filter(n => n.id !== sepolia.id).map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-lg mb-1 ${
                  network.id === chainId ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'text-gray-700'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* 网络图标 */}
                <div className={`w-6 h-6 rounded-full ${network.color} flex items-center justify-center text-white text-xs shadow-sm`}>
                  {network.icon}
                </div>
                
                {/* 网络信息 */}
                <div className="flex-1">
                  <div className="font-medium text-sm">{network.name}</div>
                  <div className="text-xs text-gray-500">{network.symbol}</div>
                </div>
                
                {/* 当前网络标识 */}
                {network.id === chainId && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* 分割线 */}
          <div className="border-t border-gray-100 my-1"></div>
          
          {/* 网络状态信息 */}
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span>当前链ID:</span>
              <span className="font-mono">{chainId}</span>
            </div>
            <div className="text-xs text-gray-400">
              红包合约部署在 Sepolia 测试网
            </div>
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

/**
 * 紧凑版网络切换器，只显示网络状态指示器
 */
export function CompactNetworkSwitcher({ className = "" }: { className?: string }) {
  return (
    <NetworkSwitcher 
      className={className}
      showLabel={false}
    />
  );
}
