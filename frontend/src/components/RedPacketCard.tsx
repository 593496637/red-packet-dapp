import { useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { UserAvatar, UserName } from "./UserProfile";
import { useContractTransaction } from "../hooks/useContractTransaction";
import { contractAddress, contractAbi } from "../contracts/RedPacketSystem";
import toast from "react-hot-toast";

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
  creationTime: string;
  claims: Claim[];
}

interface RedPacketCardProps {
  packet: RedPacket;
  onClaimSuccess?: () => void; // 添加成功回调
}

export function RedPacketCard({ packet, onClaimSuccess }: RedPacketCardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isConfirming, isConfirmed } = useContractTransaction("claim");
  const { 
    writeContract: withdrawContract, 
    isPending: isWithdrawPending, 
    isConfirming: isWithdrawConfirming,
    isConfirmed: isWithdrawConfirmed 
  } = useContractTransaction("withdraw");

  // 计算状态
  const claimedCount = packet.claims.length;
  const totalCount = Number(packet.totalCount);
  const isFullyClaimed = claimedCount >= totalCount;
  const isClaimedByUser = packet.claims.some(
    (claim) => claim.claimer.toLowerCase() === address?.toLowerCase()
  );
  const canClaim = isConnected && address && !isFullyClaimed && !isClaimedByUser;
  
  // 提取功能相关状态
  const isOwner = address?.toLowerCase() === packet.owner.toLowerCase();
  const creationTime = Number(packet.creationTime) * 1000; // 转换为毫秒
  const now = Date.now();
  const timeElapsed = now - creationTime;
  const canWithdraw = isOwner && !isFullyClaimed && timeElapsed >= 24 * 60 * 60 * 1000; // 24小时
  const hasUnclaimedFunds = claimedCount < totalCount;

  // 计算剩余金额
  const totalAmount = BigInt(packet.totalAmount);

  // 监听交易确认，成功后刷新列表
  useEffect(() => {
    if ((isConfirmed || isWithdrawConfirmed) && onClaimSuccess) {
      onClaimSuccess();
    }
  }, [isConfirmed, isWithdrawConfirmed, onClaimSuccess]);

  const handleClaim = () => {
    if (!isConnected) {
      toast.error("请先连接钱包");
      return;
    }
    if (!canClaim) return;
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "claimRedPacket",
      args: [BigInt(packet.packetId)],
    });
  };

  const handleWithdraw = () => {
    if (!isConnected) {
      toast.error("请先连接钱包");
      return;
    }
    if (!canWithdraw) {
      toast.error("提取条件不满足");
      return;
    }
    withdrawContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "withdraw",
      args: [BigInt(packet.packetId)],
    });
  };

  // 计算剩余时间
  const getTimeRemaining = () => {
    const remainingTime = 24 * 60 * 60 * 1000 - timeElapsed;
    if (remainingTime <= 0) return "已过期";
    
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟后可提取`;
    } else {
      return `${minutes}分钟后可提取`;
    }
  };

  return (
    <div className={`group relative transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
      isFullyClaimed ? 'opacity-75' : ''
    }`}>
      {/* 玻璃态卡片容器 */}
      <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* 动态渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-500/30 opacity-60 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-400/20 via-transparent to-cyan-400/20 pointer-events-none"></div>
        
        {/* 装饰性光晕效果 */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400/40 to-purple-600/40 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-blue-400/40 to-cyan-600/40 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* 现代化红包头部 */}
          <div className="text-center mb-4">
            {/* 红包图标容器 */}
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl shadow-lg transform rotate-3"></div>
              <div className="relative text-2xl">🧧</div>
            </div>
            
            {/* 金额显示 */}
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {parseFloat(formatEther(totalAmount)).toFixed(4)} ETH
            </div>
            
            {/* 祝福语 */}
            <div className="text-gray-600 text-sm mb-2 opacity-90">
              "{packet.message}"
            </div>
            
            {/* 状态标签 */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isFullyClaimed 
                ? 'bg-gray-500/20 text-gray-600' 
                : 'bg-emerald-500/20 text-emerald-700'
            }`}>
              {isFullyClaimed ? '已抢完' : `剩余 ${totalCount - claimedCount} 个`}
            </div>
          </div>
        </div>

        {/* 创建者信息 */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-white/25 backdrop-blur-md rounded-xl border border-white/25">
          <UserAvatar address={packet.owner} size="sm" />
          <div className="flex-1">
            <UserName address={packet.owner} className="text-gray-800 text-xs font-medium" />
          </div>
          <div className="text-gray-500 text-xs font-mono">
            #{packet.packetId}
          </div>
        </div>

        {/* 进度信息 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 text-xs font-medium">领取进度</span>
            <span className="text-gray-800 text-xs font-bold">
              {claimedCount}/{totalCount}
            </span>
          </div>
          <div className="relative bg-white/40 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/30">
            <div 
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r"
              style={{ 
                width: `${(claimedCount / totalCount) * 100}%`,
                background: isFullyClaimed 
                  ? 'linear-gradient(90deg, #9CA3AF, #6B7280)' 
                  : 'linear-gradient(90deg, #10B981, #059669)'
              }}
            />
          </div>
        </div>

        {/* 领取记录 */}
        <div className="mb-4">
          <details className="bg-white/25 backdrop-blur-md rounded-xl p-3 border border-white/25 group">
            <summary className="cursor-pointer text-gray-700 text-xs font-medium flex items-center justify-between hover:text-gray-900 transition-colors">
              <span>领取记录 ({packet.claims.length})</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="mt-3 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {packet.claims.length > 0 ? (
                packet.claims.map((claim, index) => (
                  <div key={`${claim.claimer}-${index}`} className="flex items-center justify-between p-2 bg-white/20 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2">
                      <UserAvatar address={claim.claimer} size="sm" />
                      <UserName address={claim.claimer} className="text-gray-800 text-xs font-medium" />
                    </div>
                    <div className="text-emerald-600 text-xs font-semibold bg-emerald-100/50 px-2 py-1 rounded">
                      +{parseFloat(formatEther(BigInt(claim.amount))).toFixed(4)} ETH
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-gray-500 text-xs">
                  暂无领取记录
                </div>
              )}
            </div>
          </details>
        </div>

        {/* 创建者提取信息 */}
        {isOwner && hasUnclaimedFunds && (
          <div className="mb-4">
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-3 border border-blue-200/50">
              <div className="text-blue-800 text-xs font-medium mb-1">🏦 创建者权限</div>
              <div className="text-blue-700 text-xs">
                {canWithdraw ? (
                  "✅ 24小时已过，可提取剩余资金"
                ) : (
                  `⏰ ${getTimeRemaining()}`
                )}
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-2">
          {!address ? (
            <button
              disabled
              className="w-full py-4 text-gray-500 bg-gray-300/50 backdrop-blur-sm rounded-2xl text-sm cursor-not-allowed border border-gray-300/30"
            >
              请先连接钱包
            </button>
          ) : isFullyClaimed ? (
            <button
              disabled
              className="w-full py-4 text-gray-500 bg-gray-300/50 backdrop-blur-sm rounded-2xl text-sm cursor-not-allowed border border-gray-300/30"
            >
              🎉 红包已抢完
            </button>
          ) : isOwner && canWithdraw ? (
            // 创建者提取按钮
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawPending || isWithdrawConfirming}
              className={`w-full py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isWithdrawPending || isWithdrawConfirming
                  ? "text-gray-500 bg-gray-300/50 cursor-not-allowed border border-gray-300/30"
                  : "text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl border border-blue-300/50"
              }`}
            >
              {isWithdrawPending || isWithdrawConfirming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {isWithdrawPending ? "等待确认..." : "提取中..."}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>🏦</span>
                  <span>提取剩余资金</span>
                </div>
              )}
            </button>
          ) : isClaimedByUser ? (
            <div className="space-y-3">
              <button
                disabled
                className="w-full py-4 text-emerald-700 bg-emerald-100/60 backdrop-blur-sm rounded-2xl text-sm cursor-not-allowed border border-emerald-300/30"
              >
                ✅ 你已领取过这个红包
              </button>
              {(() => {
                const userClaim = packet.claims.find(
                  claim => claim.claimer.toLowerCase() === address?.toLowerCase()
                );
                return userClaim ? (
                  <div className="text-center p-4 bg-emerald-100/40 backdrop-blur-sm rounded-2xl border border-emerald-300/30">
                    <div className="text-emerald-800 text-sm">
                      <span>你的领取金额: </span>
                      <span className="font-bold text-base">
                        {parseFloat(formatEther(BigInt(userClaim.amount))).toFixed(4)} ETH
                      </span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={isPending || isConfirming}
              className={`w-full py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isPending || isConfirming
                  ? "text-gray-500 bg-gray-300/50 cursor-not-allowed border border-gray-300/30"
                  : "text-white bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl border border-orange-300/50 cursor-pointer"
              }`}
            >
              {isPending || isConfirming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  处理中...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">💰</span>
                  <span>抢红包</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}