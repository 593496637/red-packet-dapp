// 共享的合约交易hook，简化重复逻辑
import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';

export function useContractTransaction(toastId: string) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirming) toast.loading("处理中...", { id: toastId });
    if (isConfirmed) toast.success("成功！", { id: toastId });
    if (error) toast.error(error.message || "操作失败", { id: toastId });
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