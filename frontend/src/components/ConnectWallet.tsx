import { useAccount, useConnect } from "wagmi";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { AccountSwitcher } from "./AccountSwitcher";
import type { Connector } from "wagmi";

export function ConnectWallet() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // 如果用户已连接钱包，显示微信风格的钱包管理界面
  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        {/* 账户切换器 */}
        <AccountSwitcher showBalance={false} />
        {/* 网络切换器 */}
        <NetworkSwitcher className="hidden sm:block" />
      </div>
    );
  }

  // 如果用户未连接，显示微信风格的连接按钮
  const handleConnect = (connector: Connector) => {
    try {
      console.log('尝试连接钱包:', connector.name);
      connect({ connector });
    } catch (error) {
      console.error('连接钱包失败:', error);
    }
  };

  if (connectors.length === 0) {
    return (
      <div className="px-4 py-2 bg-gray-100 rounded text-sm text-gray-500">
        无可用钱包
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 主要连接按钮 */}
      {connectors.length > 0 && (
        <button 
          onClick={() => handleConnect(connectors[0])}
          className="px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          style={{ 
            backgroundColor: 'var(--wechat-red-primary)', 
            color: 'white', 
            border: 'none',
            borderRadius: 'var(--wechat-radius-button)',
            fontWeight: '500',
            minHeight: '36px',
            outline: 'none',
            pointerEvents: 'auto',
            zIndex: 100
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span>💼</span>
          <span>连接钱包</span>
        </button>
      )}
      
      {/* 备用连接器 */}
      {connectors.length > 1 && (
        <details className="mt-2">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            其他连接方式 ({connectors.length - 1})
          </summary>
          <div className="mt-2 space-y-1">
            {connectors.slice(1).map((connector) => (
              <button 
                key={connector.id} 
                onClick={() => handleConnect(connector)}
                className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border cursor-pointer transition-colors"
              >
                连接 {connector.name}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
