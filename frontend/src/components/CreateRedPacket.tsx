import { useState, useMemo, useEffect } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { contractAddress, contractAbi } from "../contracts/RedPacketSystem";
import { useContractTransaction } from "../hooks/useContractTransaction";
import { useWalletBalance } from "../hooks/useWalletBalance";
import toast from "react-hot-toast";

export function CreateRedPacket() {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [count, setCount] = useState("");
  const [amount, setAmount] = useState("");
  const [isEven, setIsEven] = useState(false);

  const { writeContract, isPending, isConfirming, isConfirmed } = useContractTransaction("create");
  const { balance, formattedBalance, isLoading: balanceLoading } = useWalletBalance();

  // 表单重置
  useEffect(() => {
    if (isConfirmed) {
      setMessage("");
      setCount("");
      setAmount("");
      setIsEven(false);
    }
  }, [isConfirmed]);

  // 计算预览
  const estimateInfo = useMemo(() => {
    if (!amount || !count || isNaN(Number(amount)) || isNaN(Number(count))) return null;
    
    const totalAmount = Number(amount);
    const totalCount = Number(count);
    
    if (totalAmount <= 0 || totalCount <= 0) return null;
    
    const avgAmount = totalAmount / totalCount;
    return {
      avgAmount: avgAmount.toFixed(4),
      minAmount: isEven ? avgAmount.toFixed(4) : "0.0001",
      maxAmount: isEven ? avgAmount.toFixed(4) : (avgAmount * 2).toFixed(4),
      totalAmount: totalAmount.toFixed(4),
      isValid: avgAmount >= 0.0001
    };
  }, [amount, count, isEven]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("请先连接钱包");
      return;
    }
    
    if (!message || !count || !amount) {
      toast.error("请填写所有字段");
      return;
    }

    const totalAmount = parseFloat(amount);
    const currentBalance = parseFloat(balance);
    
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast.error("请输入有效的金额");
      return;
    }
    
    if (currentBalance < totalAmount) {
      toast.error(`余额不足！当前余额: ${formattedBalance}，需要: ${totalAmount} ETH`);
      return;
    }

    if (!estimateInfo?.isValid) {
      toast.error("每份红包金额不能少于 0.0001 ETH");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "createRedPacket",
      args: [message, BigInt(count), isEven],
      value: parseEther(amount),
    });
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* 红包封面 - 紧凑版 */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-t-2xl p-4 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <div className="text-4xl mb-2">🧧</div>
          <div className="font-bold mb-1">发红包</div>
          <div className="text-red-100 text-xs">恭喜发财 · 红包拿来</div>
        </div>
      </div>

      {/* 表单内容 - 紧凑布局 */}
      <div className="bg-white rounded-b-2xl shadow-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* 祝福语 */}
          <div>
            <div className="text-gray-800 font-medium mb-1.5 text-sm">祝福语</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="恭喜发财，红包拿来！"
              className="w-full h-16 px-3 py-2 bg-gray-50 border-0 rounded-lg resize-none text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-200 focus:outline-none transition-all"
              maxLength={50}
            />
            <div className="text-right text-xs text-gray-400 mt-0.5">
              {message.length}/50
            </div>
          </div>

          {/* 金额和份数 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-gray-800 font-medium mb-1.5 text-sm">总金额</div>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.1"
                  className="w-full h-9 px-3 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-200 focus:outline-none transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">ETH</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                余额: {balanceLoading ? "..." : formattedBalance}
              </div>
            </div>

            <div>
              <div className="text-gray-800 font-medium mb-1.5 text-sm">份数</div>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="5"
                className="w-full h-9 px-3 bg-gray-50 border-0 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-200 focus:outline-none transition-all"
              />
              <div className="text-xs text-gray-500 mt-0.5">最多100份</div>
            </div>
          </div>

          {/* 分配方式 */}
          <div>
            <div className="text-gray-800 font-medium mb-1.5 text-sm">分配方式</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEven(false)}
                className={`flex-1 p-2.5 rounded-lg border transition-all ${
                  !isEven
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-lg mb-0.5">🎯</div>
                <div className="font-medium text-xs">拼手气</div>
                <div className="text-xs opacity-60">随机金额</div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsEven(true)}
                className={`flex-1 p-2.5 rounded-lg border transition-all ${
                  isEven
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-lg mb-0.5">⚖️</div>
                <div className="font-medium text-xs">普通</div>
                <div className="text-xs opacity-60">平均分配</div>
              </button>
            </div>
          </div>

          {/* 预览 */}
          {estimateInfo && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">📊</span>
                <span className="font-medium text-sm text-gray-800">预览</span>
                {!estimateInfo.isValid && (
                  <span className="text-red-600 text-xs">⚠️</span>
                )}
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">每个红包</span>
                  <span className="font-mono text-gray-800">
                    {isEven 
                      ? `${estimateInfo.avgAmount} ETH` 
                      : `${estimateInfo.minAmount} ~ ${estimateInfo.maxAmount} ETH`
                    }
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">总计</span>
                  <span className="text-gray-800">
                    {count} 份 × {estimateInfo.totalAmount} ETH
                  </span>
                </div>
                {!estimateInfo.isValid && (
                  <div className="text-red-600 text-xs pt-1">
                    每份至少需要 0.0001 ETH
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 发送按钮 */}
          <button
            type="submit"
            disabled={!isConnected || isPending || isConfirming || !message || !amount || !count || !estimateInfo?.isValid}
            className={`w-full h-10 rounded-lg font-medium text-sm transition-all transform ${
              !isConnected || isPending || isConfirming || !message || !amount || !count || !estimateInfo?.isValid
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {!isConnected ? (
              <span>🔗 请连接钱包</span>
            ) : isPending ? (
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>等待确认...</span>
              </div>
            ) : isConfirming ? (
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>发送中...</span>
              </div>
            ) : (
              <span>🧧 塞钱进红包</span>
            )}
          </button>

          {/* 提示 */}
          <div className="text-center text-xs text-gray-500 pt-1">
            红包24小时后过期，未领取的金额将自动退回
          </div>
        </form>
      </div>
    </div>
  );
}