import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * 定义一个 Ignition 模块来部署 RedPacketSystem 合约。
 * Ignition Module for deploying the RedPacketSystem contract.
 */
const RedPacketModule = buildModule("RedPacketModule", (m) => {
  // 使用 m.contract() 方法来定义一个部署任务。
  // "RedPacketSystem" 是我们合约的名字。
  // 第二个参数 [] 是一个空数组，因为我们合约的 constructor (构造函数) 不需要任何参数。
  const redPacket = m.contract("RedPacketSystem", []);

  // 返回一个包含合约部署实例的对象，方便后续访问。
  return { redPacket };
});

// 导出这个模块，以便 Hardhat 可以使用它。
export default RedPacketModule;