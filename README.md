# 🧧 区块链红包系统

> **像发微信红包一样简单，但钱是真的加密货币！**

这是一个可以在区块链上发红包、抢红包的网站应用。就像微信红包一样，但是：
- 💰 使用真正的加密货币(ETH)
- 🔍 所有交易记录都是公开透明的  
- 🔒 没有任何中心机构能控制你的资金
- ⏰ 24小时没人抢完的红包会自动退钱

## ⚡ 5分钟上手体验

### 第1步：安装钱包
- 在浏览器安装 [MetaMask 钱包插件](https://metamask.io)
- 创建钱包账户（记住密码！）

### 第2步：获取测试币
- 在 MetaMask 中切换到 "Sepolia 测试网"
- 去 [测试币水龙头](https://sepoliafaucet.com) 免费获取测试用的 ETH

### 第3步：运行项目
```bash
# 下载代码
git clone <这个项目的地址>
cd red-packet-dapp

# 启动网站
cd frontend
npm install
npm run dev
```

### 第4步：开始玩
- 在浏览器打开 http://localhost:5173
- 连接你的 MetaMask 钱包
- 创建红包、抢红包，尽情体验！

## 🎁 你能做什么？

### 🧧 发红包
- 设置红包金额和份数
- 写上祝福语
- 选择随机金额或者平均分配
- 一键发布到区块链

### 💰 抢红包  
- 看到红包就能抢（每人只能抢一次）
- 立即到账，资金安全
- 可以看到谁抢了多少钱

### 🏦 提取资金
- 如果24小时后还有人没抢完
- 发红包的人可以把剩余的钱提取回来

## 📖 新手学习路线

### 🐣 完全没基础？
1. 先看 [`docs/小白入门指南.md`](docs/小白入门指南.md) - 从零开始的详细教程
2. 再看 [`docs/10分钟快速上手.md`](docs/10分钟快速上手.md) - 快速体验项目

### 🚀 想深入学习？
1. [`docs/常见问题解答.md`](docs/常见问题解答.md) - 遇到问题先看这里
2. [`docs/README.md`](docs/README.md) - 完整的开发文档
3. [`docs/01-开发流程全览.md`](docs/01-开发流程全览.md) - 了解项目架构

## ❗ 重要提醒

⚠️ **这是测试网项目**
- 使用的是测试网络的假币，没有真实价值
- 仅用于学习和体验区块链技术
- 不要在主网使用未经审计的代码

⚠️ **安全提醒**  
- 妥善保管你的钱包助记词和私钥
- 不要将私钥告诉任何人
- 测试网的币可以免费获取，不要购买

---

## 🔧 技术细节 (开发者专用)

<details>
<summary>点击查看技术架构和开发命令</summary>

### 项目架构

- **智能合约**: 部署在 Sepolia 测试网的红包系统合约  
- **前端应用**: React + TypeScript + Vite 构建的 Web3 DApp
- **数据索引**: The Graph 协议子图，用于高效的区块链数据查询

### 部署信息
- **合约地址**: `0x4e659F1DB6E5475800A6E8d12F0f6dd25c65960f`
- **网络**: Sepolia 测试网
- **子图**: 已部署到 The Graph Studio

### 开发命令

#### 前端开发
```bash
cd frontend
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run lint       # 运行代码检查
npm run preview    # 预览生产构建
```

#### 合约开发
```bash
cd contracts
npx hardhat test                    # 运行所有测试
npx hardhat test solidity          # 运行 Solidity 测试
npx hardhat test nodejs            # 运行 Node.js 测试
npx hardhat ignition deploy <module>  # 部署合约
```

#### 子图开发
```bash
cd subgraph
npm run codegen    # 生成类型定义
npm run build      # 构建子图
npm run deploy     # 部署到 The Graph
npm run test       # 运行测试
```

### 项目架构详解

#### 智能合约 (`/contracts`)
- **RedPacketSystem.sol**: 核心合约，处理红包创建、领取和提现
- 使用 Hardhat 3 beta 和 `viem` 库
- 支持两种分发模式：随机和均分
- 24小时过期机制，创建者可提取未领取资金

#### 前端应用 (`/frontend`)
- React 19 + TypeScript + Vite
- Web3 集成：`wagmi` v2 + `viem` v2
- 状态管理：React Query + Apollo Client
- **多网络支持**: 8个网络包括主网、测试网和Layer 2
- **UI组件**: 紧凑红包主题设计，支持钱包连接、网络切换、红包创建和领取
- **ENS集成**: 支持ENS名称和头像显示
- **智能刷新**: 手动刷新优先，操作后自动更新

#### 子图 (`/subgraph`)
- 索引合约事件：`PacketCreated`, `PacketClaimed`
- 提供 GraphQL API 供前端查询
- 部署在 The Graph 网络

### 功能特性

#### 🎁 红包功能
- **创建红包**: 紧凑单屏设计，设置金额、份数、祝福语和分发模式
- **领取红包**: 玻璃态卡片设计，防重复领取，支持ENS显示
- **查看记录**: 实时显示红包状态和领取记录，可展开查看详情
- **资金提取**: 24小时倒计时，创建者可提取未领取资金 🏦
- **网络切换**: 支持8个网络，推荐Sepolia测试网
- **智能缓存**: 优化网络请求，手动刷新控制

#### 🔒 安全特性
- 防重复领取机制
- 资金分配算法优化
- 全面的事件日志
- 合约权限控制

### 网络配置

项目支持多个网络，推荐使用 Sepolia 测试网：

**推荐网络** 🔧：
- **Sepolia**: Chain ID 11155111 (红包合约部署网络)

**支持的其他网络**：
- 🌐 Ethereum Mainnet (ENS解析)
- 🧪 Goerli Testnet 
- 🎯 Holesky Testnet
- 💜 Polygon 
- 🟡 BSC
- 🔵 Arbitrum One
- 🔴 Optimism

**说明**: 红包功能仅在Sepolia网络可用，其他网络用于钱包连接和未来扩展。

### 环境配置

#### contracts/.env
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

</details>

## 🤝 参与贡献

欢迎参与改进这个项目：
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🐛 问题反馈

如果遇到问题或有改进建议：
- 📚 先查看 [`docs/常见问题解答.md`](docs/常见问题解答.md)
- 🐛 [创建 Issue](../../issues) 反馈问题
- 💬 或在社区讨论交流

## 📄 许可证

本项目采用 MIT 许可证，可自由使用和学习。