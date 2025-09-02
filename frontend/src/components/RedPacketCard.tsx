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

interface Withdrawal {
  owner: string;
  amount: string;
  timestamp: string;
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
  withdrawals: Withdrawal[];
}

interface RedPacketCardProps {
  packet: RedPacket;
  onClaimSuccess?: () => void;
}

export function RedPacketCard({ packet, onClaimSuccess }: RedPacketCardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isConfirming, isConfirmed } =
    useContractTransaction("claim");
  const {
    writeContract: withdrawContract,
    isPending: isWithdrawPending,
    isConfirming: isWithdrawConfirming,
    isConfirmed: isWithdrawConfirmed,
  } = useContractTransaction("withdraw");

  // 计算状态
  const claimedCount = packet.claims.length;
  const totalCount = Number(packet.totalCount);
  const isFullyClaimed = claimedCount >= totalCount;
  const isClaimedByUser = packet.claims.some(
    (claim) => claim.claimer.toLowerCase() === address?.toLowerCase()
  );

  // 提取功能相关状态
  const isOwner = address?.toLowerCase() === packet.owner.toLowerCase();
  const creationTime = Number(packet.creationTime) * 1000;
  const now = Date.now();
  const timeElapsed = now - creationTime;
  const hasUnclaimedFunds = claimedCount < totalCount;
  const hasWithdrawn = packet.withdrawals && packet.withdrawals.length > 0;

  // 抢红包功能相关状态
  const canClaim =
    isConnected &&
    address &&
    !isFullyClaimed &&
    !isClaimedByUser &&
    !hasWithdrawn;

  // 提取剩余资金功能相关状态
  const canWithdraw =
    isOwner &&
    hasUnclaimedFunds &&
    !hasWithdrawn &&
    timeElapsed >= 5 * 60 * 1000;

  // 计算剩余金额
  const totalAmount = BigInt(packet.totalAmount);

  // 监听交易确认，成功后刷新列表（使用防抖避免频繁调用）
  useEffect(() => {
    if ((isConfirmed || isWithdrawConfirmed) && onClaimSuccess) {
      // 延迟500ms刷新，避免交易确认时的频繁调用
      const timer = setTimeout(() => {
        onClaimSuccess();
      }, 500);

      return () => clearTimeout(timer);
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

    if (!isOwner) {
      toast.error("只有创建者可以提取剩余资金");
      return;
    }

    if (!hasUnclaimedFunds) {
      toast.error("没有剩余资金可提取");
      return;
    }

    if (timeElapsed < 5 * 60 * 1000) {
      toast.error("需要等待5分钟后才能提取剩余资金");
      return;
    }

    withdrawContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "withdraw",
      args: [BigInt(packet.packetId)],
    });
  };

  // 格式化创建时间显示
  const formatCreationTime = () => {
    const date = new Date(creationTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // 小于1分钟显示"刚刚"
    if (diffMs < 60 * 1000) {
      return "刚刚";
    }

    // 小于1小时显示分钟
    if (diffMs < 60 * 60 * 1000) {
      const minutes = Math.floor(diffMs / (60 * 1000));
      return `${minutes}分钟前`;
    }

    // 小于24小时显示小时
    if (diffMs < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diffMs / (60 * 60 * 1000));
      return `${hours}小时前`;
    }

    // 小于7天显示天数
    if (diffMs < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }

    // 超过7天显示具体日期
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 计算剩余时间
  const getTimeRemaining = () => {
    const remainingTime = 5 * 60 * 1000 - timeElapsed;
    if (remainingTime <= 0) return "已过期";

    const minutes = Math.floor(remainingTime / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s后可提取`;
    } else {
      return `${seconds}s后可提取`;
    }
  };

  const renderActionButton = () => {
    if (!address) {
      return (
        <button
          disabled
          className="w-full h-12 text-gray-500 bg-gray-200 rounded-xl text-sm cursor-not-allowed flex items-center justify-center"
        >
          请先连接钱包
        </button>
      );
    }

    if (isFullyClaimed) {
      return (
        <button
          disabled
          className="w-full h-12 text-gray-500 bg-gray-200 rounded-xl text-sm cursor-not-allowed flex items-center justify-center"
        >
          🎉 红包已抢完
        </button>
      );
    }

    // 如果创建者已经提取了剩余资金，红包结束
    if (hasWithdrawn) {
      return (
        <button
          disabled
          className="w-full h-12 text-gray-500 bg-gray-200 rounded-xl text-sm cursor-not-allowed flex items-center justify-center"
        >
          🏦 剩余资金已提取
        </button>
      );
    }

    // 如果用户已经抢过这个红包，显示已领取状态
    if (isClaimedByUser) {
      const userClaim = packet.claims.find(
        (claim) => claim.claimer.toLowerCase() === address?.toLowerCase()
      );

      // 如果是创建者且还有剩余资金可提取，在已领取状态下显示提取按钮
      if (isOwner && hasUnclaimedFunds && !hasWithdrawn && canWithdraw) {
        return (
          <div className="w-full space-y-2">
            <button
              disabled
              className="w-full h-10 text-green-700 bg-green-100 rounded-xl text-sm cursor-not-allowed flex flex-col items-center justify-center"
            >
              <span className="text-xs">✅ 你已领取过这个红包</span>
              {userClaim && (
                <span className="text-xs font-bold">
                  +
                  {parseFloat(formatEther(BigInt(userClaim.amount))).toFixed(4)}{" "}
                  ETH
                </span>
              )}
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawPending || isWithdrawConfirming}
              className={`w-full h-10 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center ${
                isWithdrawPending || isWithdrawConfirming
                  ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                  : "text-white bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isWithdrawPending || isWithdrawConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {isWithdrawPending ? "等待确认..." : "提取中..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🏦</span>
                  <span>提取剩余资金</span>
                </div>
              )}
            </button>
          </div>
        );
      }

      return (
        <div className="w-full">
          <button
            disabled
            className="w-full h-12 text-green-700 bg-green-100 rounded-xl text-sm cursor-not-allowed flex flex-col items-center justify-center"
          >
            <span className="text-xs">✅ 你已领取过这个红包</span>
            {userClaim && (
              <span className="text-xs font-bold mt-0.5">
                +{parseFloat(formatEther(BigInt(userClaim.amount))).toFixed(4)}{" "}
                ETH
              </span>
            )}
          </button>
        </div>
      );
    }

    // 创建者可以提取剩余资金（满5分钟后且没有抢过红包）
    if (isOwner && hasUnclaimedFunds && !hasWithdrawn && canWithdraw) {
      return (
        <div className="w-full space-y-2">
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className={`w-full h-10 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center ${
              isPending || isConfirming
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            }`}
          >
            {isPending || isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                处理中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>抢红包</span>
              </div>
            )}
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawPending || isWithdrawConfirming}
            className={`w-full h-10 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center ${
              isWithdrawPending || isWithdrawConfirming
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-white bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isWithdrawPending || isWithdrawConfirming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                {isWithdrawPending ? "等待确认..." : "提取中..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🏦</span>
                <span>提取剩余资金</span>
              </div>
            )}
          </button>
        </div>
      );
    }

    // 创建者等待提取（未满5分钟且没有抢过红包）
    if (isOwner && hasUnclaimedFunds && !hasWithdrawn && !canWithdraw) {
      return (
        <div className="w-full space-y-2">
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className={`w-full h-10 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center ${
              isPending || isConfirming
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            }`}
          >
            {isPending || isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                处理中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>抢红包</span>
              </div>
            )}
          </button>
          <button
            disabled
            className="w-full h-10 text-blue-700 bg-blue-100 rounded-xl text-sm cursor-not-allowed flex flex-col items-center justify-center"
          >
            <span className="text-xs">⏰ {getTimeRemaining()}</span>
          </button>
        </div>
      );
    }

    // 普通用户抢红包
    return (
      <button
        onClick={handleClaim}
        disabled={isPending || isConfirming}
        className={`w-full h-12 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center ${
          isPending || isConfirming
            ? "text-gray-500 bg-gray-200 cursor-not-allowed"
            : "text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        }`}
      >
        {isPending || isConfirming ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            处理中...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span>抢红包</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      {/* 头部区域 - 固定高度 */}
      <div className="h-16 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center text-white">
          <div className="text-xl mb-0.5">🧧</div>
          <div className="text-xs font-medium">
            {parseFloat(formatEther(totalAmount)).toFixed(4)} ETH
          </div>
        </div>
      </div>

      {/* 内容区域 - 自适应高度 */}
      <div className="flex-1 p-3 flex flex-col min-h-0">
        {/* 祝福语 - 紧凑布局 */}
        <div className="text-center mb-2 flex-shrink-0">
          <div className="text-gray-600 text-xs mb-1 line-clamp-2 leading-relaxed">
            "{packet.message}"
          </div>
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isFullyClaimed
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isFullyClaimed ? "已抢完" : `剩余 ${totalCount - claimedCount} 个`}
          </div>
        </div>

        {/* 创建者信息 - 紧凑布局 */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-2 flex-shrink-0">
          <UserAvatar address={packet.owner} size="sm" />
          <div className="flex-1 min-w-0">
            <UserName
              address={packet.owner}
              className="text-gray-800 text-xs font-medium truncate"
            />
            <div className="text-gray-500 text-xs mt-0.5">
              {formatCreationTime()}
            </div>
          </div>
          <div className="text-gray-400 text-xs font-mono">
            #{packet.packetId}
          </div>
        </div>

        {/* 进度条 - 紧凑布局 */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>领取进度</span>
            <span>
              {claimedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isFullyClaimed ? "bg-gray-400" : "bg-green-500"
              }`}
              style={{ width: `${(claimedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* 创建者提取信息 */}
        {isOwner && hasUnclaimedFunds && (
          <div className="mb-2 p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <div className="text-blue-800 text-xs font-medium">
              🏦 创建者权限
            </div>
            <div className="text-blue-700 text-xs">
              {hasWithdrawn
                ? "✅ 剩余资金已提取"
                : canWithdraw
                ? "✅ 5分钟已过，可提取剩余资金"
                : `⏰ ${getTimeRemaining()}`}
            </div>
          </div>
        )}

        {/* 操作按钮区域 - 固定在底部 */}
        <div className="mt-auto pt-2 flex-shrink-0">{renderActionButton()}</div>
      </div>
    </div>
  );
}
