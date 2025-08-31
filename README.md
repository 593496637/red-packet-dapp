# 🧧 Red Packet DApp

一个基于以太坊的去中心化红包系统，支持随机和均分两种发放模式。

## 📋 项目概述

这是一个全栈 Web3 应用程序，允许用户创建和分发 ETH 红包。项目包含：

- **智能合约**: 部署在 Sepolia 测试网的红包系统合约
- **前端应用**: React + TypeScript + Vite 构建的 Web3 DApp
- **数据索引**: The Graph 协议子图，用于高效的区块链数据查询

## 🔗 部署信息

- **合约地址**: `0x4e659F1DB6E5475800A6E8d12F0f6dd25c65960f`
- **网络**: Sepolia 测试网
- **子图**: 已部署到 The Graph Studio

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm
- MetaMask 或其他 Web3 钱包
- Sepolia 测试网 ETH ([水龙头获取](https://sepoliafaucet.com/))

### 安装与运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd red-packet-dapp
   ```

2. **启动前端**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **运行智能合约测试**
   ```bash
   cd contracts
   npm install
   npx hardhat test
   ```

4. **构建和部署子图**
   ```bash
   cd subgraph
   npm install
   npm run codegen
   npm run build
   ```

## 🏗️ 项目架构

### 智能合约 (`/contracts`)
- **RedPacketSystem.sol**: 核心合约，处理红包创建、领取和提现
- 使用 Hardhat 3 beta 和 `viem` 库
- 支持两种分发模式：随机和均分
- 24小时过期机制，创建者可提取未领取资金

### 前端应用 (`/frontend`)
- React 19 + TypeScript + Vite
- Web3 集成：`wagmi` v2 + `viem` v2
- 状态管理：React Query + Apollo Client
- UI 组件：支持钱包连接、红包创建和领取

### 子图 (`/subgraph`)
- 索引合约事件：`PacketCreated`, `PacketClaimed`
- 提供 GraphQL API 供前端查询
- 部署在 The Graph 网络

## 📱 功能特性

### 🎁 红包功能
- **创建红包**: 设置金额、份数、祝福语和分发模式
- **领取红包**: 用户可领取红包，防重复领取
- **查看记录**: 实时显示红包状态和领取记录
- **资金回收**: 24小时后创建者可提取未领取资金

### 🔒 安全特性
- 防重复领取机制
- 资金分配算法优化
- 全面的事件日志
- 合约权限控制

## 🛠️ 开发命令

### 前端开发
```bash
cd frontend
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run lint       # 运行代码检查
npm run preview    # 预览生产构建
```

### 合约开发
```bash
cd contracts
npx hardhat test                    # 运行所有测试
npx hardhat test solidity          # 运行 Solidity 测试
npx hardhat test nodejs            # 运行 Node.js 测试
npx hardhat ignition deploy <module>  # 部署合约
```

### 子图开发
```bash
cd subgraph
npm run codegen    # 生成类型定义
npm run build      # 构建子图
npm run deploy     # 部署到 The Graph
npm run test       # 运行测试
```

## 🔧 配置说明

### 环境变量 (contracts/.env)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 网络配置
项目配置为 Sepolia 测试网：
- Chain ID: 11155111
- RPC: 使用 Infura 或 Alchemy
- 浏览器: https://sepolia.etherscan.io

## 📖 使用指南

1. **连接钱包**: 确保钱包连接到 Sepolia 测试网
2. **创建红包**: 输入金额、份数和祝福语，选择分发模式
3. **分享红包**: 将红包 ID 分享给朋友
4. **领取红包**: 朋友可通过红包 ID 领取
5. **查看记录**: 实时查看红包状态和领取记录

## 🧪 测试

### 合约测试
- Foundry 兼容的 Solidity 单元测试
- Node.js 原生测试运行器集成测试
- 使用 `viem` 进行以太坊交互

### 前端测试
- React 组件测试
- Web3 交互测试
- E2E 测试（可选）

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Hardhat 文档](https://hardhat.org/docs)
- [The Graph 文档](https://thegraph.com/docs)
- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)

## 🐛 问题反馈

如果发现问题或有改进建议，请[创建 Issue](../../issues)。