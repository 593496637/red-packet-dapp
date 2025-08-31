# 🧧 Red Packet DApp - Frontend

基于 React + TypeScript + Vite 构建的去中心化红包系统前端应用。

## 🏗️ 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的前端构建工具
- **Wagmi v2** - React Hooks for Ethereum
- **Viem v2** - 轻量级的以太坊库
- **Apollo Client** - GraphQL 状态管理
- **React Query** - 服务端状态管理
- **React Hot Toast** - 通知组件

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── ConnectWallet.tsx    # 钱包连接组件
│   ├── CreateRedPacket.tsx  # 创建红包组件
│   └── RedPacketList.tsx    # 红包列表组件
├── contracts/           # 智能合约相关
│   └── RedPacketSystem.ts   # 合约 ABI 和配置
├── hooks/              # 自定义 Hooks
│   └── useContractTransaction.ts # 合约交互 Hook
├── wagmi.ts            # Wagmi 配置
├── App.tsx             # 主应用组件
└── main.tsx           # 应用入口点
```

## 🌐 Web3 集成

### 钱包连接
使用 Wagmi 的 `useConnect` Hook 支持多种钱包：
- MetaMask
- WalletConnect
- Coinbase Wallet
- 其他 EIP-6963 兼容钱包

### 网络配置
应用配置为 Sepolia 测试网：
```typescript
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
```

### 合约交互
- 使用 `useWriteContract` 进行写操作
- 使用 `useReadContract` 进行读操作  
- 自定义 Hook `useContractTransaction` 处理交易状态

## 📊 数据查询

### The Graph 集成
使用 Apollo Client 连接子图：
- 查询红包创建事件
- 查询红包领取记录
- 实时数据更新

### React Query
管理客户端状态和缓存：
- 交易状态缓存
- 用户余额查询
- 错误重试机制

## 🎨 UI 组件

### ConnectWallet
- 显示钱包连接状态
- 支持多种钱包选择
- 网络切换提示

### CreateRedPacket
- 红包创建表单
- 金额和份数输入
- 分发模式选择（随机/均分）
- 祝福语输入

### RedPacketList
- 显示所有红包
- 领取状态展示
- 实时数据更新

## 🔧 开发配置

### ESLint 配置
项目使用 TypeScript ESLint 配置：
- React Hooks 规则检查
- TypeScript 类型检查
- 代码格式化规则

### Vite 配置
- React 插件支持
- 热模块替换 (HMR)
- 生产构建优化

### 类型定义
- 完整的 TypeScript 类型支持
- 智能合约 ABI 类型生成
- Web3 类型安全

## 🧪 开发最佳实践

### 状态管理
- 使用 React Query 管理服务端状态
- 使用 React Context 管理全局状态
- 避免prop drilling

### 错误处理
- 全局错误边界
- 交易失败处理
- 网络错误重试

### 性能优化
- 组件懒加载
- 图片优化
- 代码分割

## 🔗 相关链接

- [Wagmi 文档](https://wagmi.sh/)
- [Viem 文档](https://viem.sh/)
- [Apollo Client 文档](https://www.apollographql.com/docs/react/)
- [React Query 文档](https://tanstack.com/query/latest)
