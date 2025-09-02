# 🧧 Red Packet System - Smart Contracts

基于 Hardhat 3 Beta 构建的以太坊红包系统智能合约，使用 `node:test` 原生测试运行器和 `viem` 库。

## 📋 合约概述

**RedPacketSystem.sol** 是一个支持多用户创建多个红包的工厂合约，具有以下特性：

- 🎁 **两种分发模式**: 随机分配和均分模式
- 🔒 **防重复领取**: 每个用户每个红包只能领取一次
- ⏰ **过期回收**: 24小时后创建者可提取未领取资金
- 📊 **完整事件**: 详细的事件日志便于前端集成
- 💰 **安全资金**: 优化的资金分配算法

## 🚀 合约部署

### 当前部署信息
- **网络**: Sepolia 测试网
- **合约地址**: `0x9986ec8e9D4d0724e7CD9320eD703a3CD69389C1`
- **验证状态**: 已在 Etherscan 验证
- **部署区块**: 9093069

## 🔧 开发环境

### 技术栈
- **Hardhat 3 Beta** - 智能合约开发框架
- **Node.js Test Runner** - 原生测试框架
- **Viem** - 轻量级以太坊库
- **TypeScript** - 类型安全开发
- **Foundry** - Solidity 测试兼容性

### 环境要求
- Node.js >= 18
- npm 或 yarn
- Hardhat CLI

## 📁 项目结构

```
contracts/
├── contracts/
│   └── RedPacketSystem.sol    # 主合约
├── ignition/
│   └── modules/               # 部署脚本
├── test/
│   ├── solidity/             # Solidity 测试
│   └── nodejs/               # Node.js 集成测试
├── hardhat.config.ts         # Hardhat 配置
└── package.json
```

## 🧪 测试

### 运行所有测试
```shell
npx hardhat test
```

### 分别运行测试类型
```shell
npx hardhat test solidity    # Solidity 单元测试
npx hardhat test nodejs      # Node.js 集成测试
```

### 测试覆盖率
- 完整的合约功能测试
- 边界条件测试
- 安全性测试
- Gas 优化测试

## 🚀 部署指南

### 本地部署
```shell
npx hardhat ignition deploy ignition/modules/RedPacketSystem.ts
```

### Sepolia 测试网部署

1. **配置环境变量**
   ```bash
   # 设置私钥
   npx hardhat keystore set SEPOLIA_PRIVATE_KEY
   
   # 设置 RPC URL
   npx hardhat keystore set SEPOLIA_RPC_URL
   
   # 设置 Etherscan API Key
   npx hardhat keystore set ETHERSCAN_API_KEY
   ```

2. **执行部署**
   ```shell
   npx hardhat ignition deploy --network sepolia ignition/modules/RedPacketSystem.ts
   ```

3. **验证合约**
   ```shell
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

## 🔍 合约接口

### 核心函数

#### createRedPacket
```solidity
function createRedPacket(
    string memory _message,
    uint256 _count,
    bool _isEven
) external payable
```
创建新红包，需要发送 ETH。

#### claimRedPacket
```solidity
function claimRedPacket(uint256 _packetId) external
```
领取指定红包。

#### withdraw
```solidity
function withdraw(uint256 _packetId) external
```
创建者在24小时后提取未领取资金。

### 事件

```solidity
event PacketCreated(
    uint256 indexed packetId,
    address indexed creator,
    string message,
    uint256 totalAmount,
    uint256 totalCount,
    bool isEven
);

event PacketClaimed(
    uint256 indexed packetId,
    address indexed claimer,
    uint256 amount
);

event PacketEmpty(uint256 indexed packetId);
event AlreadyClaimed(uint256 indexed packetId, address indexed claimer);
event FundsWithdrawn(uint256 indexed packetId, address indexed owner, uint256 amount);
```

## 🛡️ 安全特性

### 访问控制
- 只有创建者可以提取过期红包
- 每个用户只能领取一次

### 资金安全
- 使用 `call` 进行 ETH 转账
- 防止重入攻击
- 余额检查和更新

### 随机算法
```solidity
function _getRandomAmount(uint256 _balance, uint256 _remainingCount) 
    private view returns (uint256)
```
- 伪随机数生成
- 确保剩余用户至少获得 1 wei
- 防止资金分配不均

## 📊 Gas 优化

- 结构体打包优化
- 事件参数索引优化
- 计算逻辑优化
- 存储访问优化

## 🔗 网络配置

### Hardhat 网络配置
```typescript
networks: {
  hardhatMainnet: {
    type: "edr-simulated",
    chainType: "l1",
  },
  sepolia: {
    type: "http",
    chainType: "l1",
    url: configVariable("SEPOLIA_RPC_URL"),
    accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
  },
}
```

## 📖 使用示例

### JavaScript/TypeScript
```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// 创建红包
const hash = await walletClient.writeContract({
  address: '0x9986ec8e9D4d0724e7CD9320eD703a3CD69389C1',
  abi: RedPacketSystemABI,
  functionName: 'createRedPacket',
  args: ['新年快乐!', 10n, false],
  value: parseEther('0.1')
});
```

## 🐛 故障排除

### 常见问题
1. **Gas 估算失败**: 检查账户余额和网络连接
2. **交易失败**: 确认参数格式和权限
3. **部署失败**: 验证环境变量配置

### 调试命令
```shell
npx hardhat console --network sepolia
npx hardhat node --fork https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

## 🔗 相关资源

- [Hardhat 3 Beta 文档](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3)
- [Viem 文档](https://viem.sh/)
- [Node.js Test Runner](https://nodejs.org/api/test.html)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)
