import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// --- Wagmi 配置 ---
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 创建一个 QueryClient 实例 (wagmi v2 的要求)
const queryClient = new QueryClient()

// 创建 wagmi 配置
export const config = createConfig({
  chains: [sepolia], // 指定我们支持的网络，这里是 Sepolia
  transports: {
    [sepolia.id]: http() // 为 Sepolia 网络配置一个公共的 HTTP RPC 接口
  },
})
// --- Wagmi 配置结束 ---


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 用 WagmiProvider 和 QueryClientProvider 包裹我们的 App。
      这样，App 组件以及它的所有子组件都可以访问 wagmi 提供的 hooks 和状态。
    */}
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)