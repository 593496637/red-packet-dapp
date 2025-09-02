import { ConnectWallet } from "./components/ConnectWallet";
import { CreateRedPacket } from "./components/CreateRedPacket";
import { RedPacketList } from "./components/RedPacketList";
import { Modal } from "./components/Modal";
import { Toaster } from "react-hot-toast";
import { useNetworkMonitor } from "./hooks/useNetworkMonitor";
import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { ENSRefreshContext } from "./contexts/ENSRefreshContext";

function App() {
  const { isConnected } = useAccount();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // 存储ENS刷新函数的ref
  const ensRefreshRef = useRef<(() => void) | null>(null);
  // 存储红包列表刷新函数的ref
  const redPacketListRefreshRef = useRef<(() => void) | null>(null);

  // 启用网络变更监听
  useNetworkMonitor({
    showToast: true,
    onNetworkChange: (newChainId, oldChainId) => {
      console.log(`网络从 ${oldChainId} 切换到 ${newChainId}`);
    },
    onENSRefreshNeeded: () => {
      // 当网络切换时，刷新ENS数据
      if (ensRefreshRef.current) {
        ensRefreshRef.current();
        console.log('网络切换后刷新ENS数据');
      }
    }
  });

  // ENS刷新上下文值
  const ensRefreshContext = {
    refreshENS: () => {
      if (ensRefreshRef.current) {
        ensRefreshRef.current();
      }
    },
    registerRefreshFunction: (fn: () => void) => {
      ensRefreshRef.current = fn;
    }
  };

  // 处理红包创建成功
  const handleRedPacketCreated = () => {
    // 刷新红包列表
    if (redPacketListRefreshRef.current) {
      redPacketListRefreshRef.current();
    }
    // 关闭弹窗
    setShowCreateModal(false);
  };

  return (
    <ENSRefreshContext.Provider value={ensRefreshContext}>
      {/* 微信风格Toast通知 */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333333',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '400',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: 'none',
          }
        }}
      />

      {/* 固定布局容器 */}
      <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--wechat-bg)' }}>
        {/* 微信风格Header - 固定高度 */}
        <header className="wechat-card border-0 border-b border-wechat-border-light flex-shrink-0">
          <div className="wechat-card-padding">
            <div className="flex items-center justify-between">
              {/* 微信风格标题 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 wechat-red-packet rounded-lg flex items-center justify-center">
                  <span className="text-lg text-white">🧧</span>
                </div>
                <h1 className="text-lg font-medium wechat-text-primary">红包</h1>
              </div>
              
              {/* 钱包连接 */}
              <div>
                <ConnectWallet />
              </div>
            </div>
          </div>
        </header>

        {/* 可滚动主内容区 */}
        <main className="app-scroll-container">
          <div className="wechat-card-padding">
            {/* 发红包按钮区域 - 固定高度 */}
            <div className="mb-4 flex-shrink-0">
              {isConnected ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full wechat-button wechat-button-primary py-4 px-4 flex items-center justify-center gap-3 text-base"
                >
                  <span className="text-xl">🧧</span>
                  <span>发红包</span>
                </button>
              ) : (
                <div className="w-full py-4 px-4 bg-gray-100 rounded-lg text-center text-gray-500">
                  <span className="text-xl mr-2">🔒</span>
                  <span>请先连接钱包后发红包</span>
                </div>
              )}
            </div>

            {/* 红包列表 */}
            <RedPacketList 
              onRefreshRegister={(refreshFn) => {
                redPacketListRefreshRef.current = refreshFn;
              }}
            />
          </div>
        </main>
      </div>
      
      {/* 微信风格发红包弹窗 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="发红包"
        maxWidth="md"
      >
        <CreateRedPacket onSuccess={handleRedPacketCreated} />
      </Modal>

    </ENSRefreshContext.Provider>
  );
}

export default App;
