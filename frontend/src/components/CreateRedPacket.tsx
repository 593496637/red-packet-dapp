// frontend/src/components/CreateRedPacket.tsx
import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { contractAddress, contractAbi } from "../contracts/RedPacketSystem";
import toast from "react-hot-toast";

export function CreateRedPacket() {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [count, setCount] = useState("");
  const [amount, setAmount] = useState("");
  const [isEven, setIsEven] = useState(false);

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirming) {
      toast.loading("正在创建红包...", { id: "create" });
    }
    if (isConfirmed) {
      toast.success("红包创建成功！", { id: "create" });
      // 成功后清空表单
      setMessage("");
      setCount("");
      setAmount("");
      setIsEven(false);
    }
    if (error) {
      toast.error(error.message || "创建失败", { id: "create" });
    }
  }, [isConfirming, isConfirmed, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !count || !amount) {
      toast.error("请填写所有字段");
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

  if (!isConnected) {
    return <p>请先连接钱包以创建红包。</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
      }}
    >
      <h3>创建一个新红包</h3>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="祝福语，例如：恭喜发财！"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="红包总金额 (ETH)"
      />
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        placeholder="红包总份数"
      />
      <label>
        <input
          type="checkbox"
          checked={isEven}
          onChange={(e) => setIsEven(e.target.checked)}
        />
        是否均分红包？(否则为随机)
      </label>
      <button type="submit" disabled={isPending || isConfirming}>
        {isPending
          ? "等待钱包确认..."
          : isConfirming
          ? "交易处理中..."
          : "创建红包"}
      </button>
    </form>
  );
}
