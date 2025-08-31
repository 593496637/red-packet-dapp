// 共享的合约交易hook，简化重复逻辑
import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';

// 错误信息友好化处理
function getErrorMessage(error: Error | null): string {
  if (!error) return "操作失败";
  
  const message = error.message.toLowerCase();
  
  // 用户取消交易
  if (message.includes('user rejected') || 
      message.includes('user denied') ||
      message.includes('user cancelled') ||
      message.includes('user canceled')) {
    return "您取消了交易";
  }
  
  // 余额不足
  if (message.includes('insufficient funds') || 
      message.includes('balance')) {
    return "余额不足";
  }
  
  // Gas费用不足
  if (message.includes('gas') && message.includes('insufficient')) {
    return "Gas费用不足";
  }
  
  // 网络错误
  if (message.includes('network') || message.includes('connection')) {
    return "网络连接错误，请重试";
  }
  
  // 合约执行失败
  if (message.includes('execution reverted') || 
      message.includes('revert')) {
    return "合约执行失败，请检查参数";
  }
  
  // 其他错误返回简化信息
  return "操作失败，请重试";
}

export function useContractTransaction(toastId: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("正在处理交易...", { id: toastId });
    }
    if (isConfirmed) {
      toast.success("交易成功！", { id: toastId });
    }
    if (error) {
      const friendlyMessage = getErrorMessage(error);
      toast.error(friendlyMessage, { id: toastId });
    }
  }, [isConfirming, isConfirmed, error, toastId]);

  return {
    hash,
    writeContract,
    isPending,
    isConfirming,
    isConfirmed,
    error
  };
}