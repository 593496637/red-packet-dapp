// frontend/src/wagmi.ts
import { createConfig, http } from "wagmi";
import { mainnet, sepolia, goerli, holesky, polygon, bsc, arbitrum, optimism } from "wagmi/chains";

export const config = createConfig({
  chains: [
    sepolia, 
    mainnet, 
    goerli,
    holesky,
    polygon,
    bsc,
    arbitrum,
    optimism
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(), // 保留主网支持 ENS 解析
    [goerli.id]: http(),
    [holesky.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  // 减少轮询频率但保持 ENS 功能
  pollingInterval: 30_000, // 30秒轮询一次
});
