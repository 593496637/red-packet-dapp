import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";

export function ConnectWallet() {
  // 获取账户信息
  const { address, isConnected } = useAccount();
  // 获取 ENS name
  const { data: ensName } = useEnsName({ address });
  // 获取连接器函数和可用连接器列表
  const { connect, connectors } = useConnect();
  // 获取断开连接函数
  const { disconnect } = useDisconnect();

  // 如果用户已连接钱包，显示账户信息和断开按钮
  if (isConnected) {
    return (
      <div>
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  // 如果用户未连接，显示所有可用钱包的连接按钮
  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
