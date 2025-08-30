import {
  PacketCreated as PacketCreatedEvent,
  PacketClaimed as PacketClaimedEvent,
} from "../generated/RedPacketSystem/RedPacketSystem";
import { RedPacket, Claim } from "../generated/schema";

/**
 * 处理 PacketCreated 事件。
 * 当一个新的红包被创建时，这个函数会被调用。
 */
export function handlePacketCreated(event: PacketCreatedEvent): void {
  let entity = new RedPacket(event.params.packetId.toString());

  // 所有数据都直接来自 event.params，非常高效！
  entity.packetId = event.params.packetId;
  entity.owner = event.params.creator;
  entity.message = event.params.message;
  entity.totalAmount = event.params.totalAmount;
  entity.totalCount = event.params.totalCount;
  entity.isEven = event.params.isEven; // <-- 直接从事件获取
  entity.creationTime = event.block.timestamp;

  entity.save();
}

/**
 * 处理 PacketClaimed 事件。
 * 当一个红包被领取时，这个函数会被调用。
 */
export function handlePacketClaimed(event: PacketClaimedEvent): void {
  // 创建一个新的 Claim 实体。
  // 为了保证 ID 的唯一性，我们通常使用交易哈希和日志索引的组合。
  let entity = new Claim(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  // 填充 Claim 实体的字段。
  entity.packetId = event.params.packetId;
  entity.claimer = event.params.claimer;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  entity.redPacket = event.params.packetId.toString()

  // 保存这个新的领取记录。
  entity.save();
}
