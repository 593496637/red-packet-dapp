# 🧧 Red Packet DApp - Frontend

基于 React + TypeScript + Vite 构建的去中心化红包系统前端应用。

## 🏗️ 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的前端构建工具
- **Wagmi v2** - React Hooks for Ethereum
- **Viem v2** - 轻量级的以太坊库
- **Apollo Client** - GraphQL 状态管理，智能缓存
- **React Query** - 服务端状态管理
- **Tailwind CSS** - 原子化CSS框架
- **React Hot Toast** - 通知组件
- **ENS 集成** - 用户名和头像支持

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
│   ├── ConnectWallet.tsx        # 钱包连接组件
│   ├── CreateRedPacket.tsx      # 创建红包组件 (紧凑设计)
│   ├── RedPacketList.tsx        # 红包列表组件  
│   ├── RedPacketCard.tsx        # 红包卡片组件 (玻璃态设计)
│   ├── NetworkSwitcher.tsx      # 网络切换组件 (8个网络支持)
│   ├── Modal.tsx                # 通用弹窗组件
│   └── UserProfile.tsx          # 用户资料组件 (ENS集成)
├── contracts/           # 智能合约相关
│   └── RedPacketSystem.ts       # 合约 ABI 和配置
├── hooks/              # 自定义 Hooks
│   ├── useContractTransaction.ts # 合约交互 Hook
│   ├── useENS.ts                # ENS 名称和头像 Hook
│   └── useWalletBalance.ts      # 钱包余额 Hook
├── wagmi.ts            # Wagmi 配置 (多网络支持)
├── App.tsx             # 主应用组件
├── main.tsx           # 应用入口点 (Apollo配置)
└── index.css          # Tailwind CSS 样式
```

## 🌐 Web3 集成

### 钱包连接
使用 Wagmi 的 `useConnect` Hook 支持多种钱包：
- MetaMask
- WalletConnect
- Coinbase Wallet
- 其他 EIP-6963 兼容钱包

### 网络配置
应用支持多个网络，推荐 Sepolia 测试网：
```typescript
export const config = createConfig({
  chains: [sepolia, mainnet, goerli, holesky, polygon, bsc, arbitrum, optimism],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(), // ENS 解析
    // ... 其他网络
  },
  pollingInterval: 30_000, // 优化轮询间隔
});
```

**支持网络**：
- 🔧 **Sepolia Testnet** (推荐) - 红包合约部署网络
- 🌐 **Ethereum Mainnet** - ENS 解析支持
- 🧪 **Goerli/Holesky** - 以太坊测试网
- 💜🟡🔵🔴 **Layer 2** - Polygon、BSC、Arbitrum、Optimism

### 合约交互
- 使用 `useWriteContract` 进行写操作
- 使用 `useReadContract` 进行读操作  
- 自定义 Hook `useContractTransaction` 处理交易状态

## 📊 数据查询

### The Graph 集成
使用 Apollo Client 连接子图，**智能缓存优化**：
```typescript
const apolloClient = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      pollInterval: 0, // 禁用自动轮询
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

- 查询红包创建事件 (包含 `creationTime`)
- 查询红包领取记录 
- **手动刷新优先**，操作后自动更新

### React Query
管理客户端状态和缓存：
- 交易状态缓存
- 用户余额查询
- 错误重试机制

## 🎨 UI 组件

### CreateRedPacket (创建红包)
- **紧凑单屏设计** - 无需滚动的表单布局
- **红包封面风格** - 红色渐变 + 节日氛围
- **实时预览** - 金额分配计算和有效性检查
- **智能验证** - 字段级错误提示和动画反馈

### RedPacketCard (红包卡片)
- **玻璃态设计** - backdrop-blur 现代化效果
- **24小时倒计时** - 创建者提取资金功能 🏦
- **ENS 集成** - 自动显示用户名和头像
- **展开记录** - 可查看详细领取历史

### NetworkSwitcher (网络切换)
- **分层显示** - 推荐网络 vs 其他网络
- **视觉指示器** - 独特颜色和 emoji 图标
- **智能提示** - 自动识别当前网络状态

### Modal (通用弹窗)
- **简约设计** - 毛玻璃背景 + 圆角设计
- **响应式** - 多尺寸支持，居中显示
- **交互优化** - ESC 键关闭，点击外部关闭

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

## ✨ 核心功能

### 红包创建 🧧
- 紧凑表单设计，36px 控件高度
- 实时预览分配结果
- 两种模式：拼手气 vs 普通
- 表单验证和错误提示

### 红包领取 💰
- 玻璃态卡片展示
- 一键领取，防重复
- 进度条和状态显示
- ENS 名称自动解析

### 资金提取 🏦
- 24小时倒计时显示
- 创建者专用权限
- 蓝色主题提取按钮
- 自动刷新列表

### 网络管理 🌐
- 8个网络支持
- 智能推荐系统
- 视觉状态指示
- 一键网络切换

## 🎯 性能优化

- **智能缓存**: Apollo Client cache-first策略
- **禁用轮询**: 手动刷新优先，减少API请求
- **ENS优化**: 5分钟缓存，减少重复解析
- **组件优化**: useCallback/useMemo性能提升

## 🔗 相关链接

- [Wagmi 文档](https://wagmi.sh/)
- [Viem 文档](https://viem.sh/)
- [Apollo Client 文档](https://www.apollographql.com/docs/react/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Tailwind CSS 文档](https://tailwindcss.com)
