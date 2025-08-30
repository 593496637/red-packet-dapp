import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import { contractAddress, contractAbi } from "../contracts/RedPacketSystem";
import { formatEther } from "viem";
import { useEffect } from "react";
import { useContractTransaction } from "../hooks/useContractTransaction";

// TypeScript interfaces
interface Claim {
  claimer: string;
  amount: string;
}

interface RedPacket {
  id: string;
  packetId: string;
  owner: string;
  message: string;
  totalAmount: string;
  totalCount: string;
  claims: Claim[];
}

interface RedPacketData {
  redPackets: RedPacket[];
}

// 1. 定义新的、更高效的 GraphQL 查询
const GET_RED_PACKETS = gql`
  query GetRedPackets {
    redPackets(orderBy: creationTime, orderDirection: desc, first: 100) {
      id
      packetId
      owner
      message
      totalAmount
      totalCount
      # 直接在查询中获取关联的 claims 列表
      claims {
        claimer
        amount
      }
    }
  }
`;

export function RedPacketList() {
  const { address } = useAccount();
  // useQuery 现在会每 5 秒自动重新查询一次数据
  const { loading, error, data, startPolling, stopPolling } = useQuery<RedPacketData>(
    GET_RED_PACKETS,
    {
      pollInterval: 5000,
    }
  );

  // 组件加载时开始轮询，卸载时停止
  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const { writeContract, isPending, isConfirming } = useContractTransaction("claim");

  const handleClaim = (packetId: string) => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "claimRedPacket",
      args: [BigInt(packetId)],
    });
  };

  if (loading && !data) return <p>加载红包列表中...</p>; // 初始加载时显示
  if (error) return <p>加载数据出错: {error.message}</p>;

  return (
    <div>
      <h3>红包广场 {loading && "(正在更新...)"}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {data?.redPackets.map((packet: RedPacket) => {
          // 2. 数据处理逻辑变得极其简单
          const claimedCount = packet.claims.length;
          const isClaimedByUser = packet.claims.some(
            (claim: Claim) =>
              claim.claimer.toLowerCase() === address?.toLowerCase()
          );

          return (
            <div
              key={packet.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>祝福语:</strong> {packet.message}
              </p>
              <p>
                <strong>来自:</strong> {packet.owner}
              </p>
              <p>
                <strong>总金额:</strong>{" "}
                {formatEther(BigInt(packet.totalAmount))} ETH
              </p>
              <p>
                <strong>状态:</strong> {claimedCount} / {packet.totalCount}{" "}
                份已被领取
              </p>

              {claimedCount >= Number(packet.totalCount) ? (
                <button disabled>已抢完</button>
              ) : isClaimedByUser ? (
                <button disabled>你已抢过</button>
              ) : (
                <button
                  onClick={() => handleClaim(packet.packetId)}
                  disabled={!address || isPending || isConfirming}
                >
                  {isPending || isConfirming ? "处理中..." : "抢！"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
