import {
  AlreadyClaimed as AlreadyClaimedEvent,
  FundsWithdrawn as FundsWithdrawnEvent,
  PacketClaimed as PacketClaimedEvent,
  PacketCreated as PacketCreatedEvent,
  PacketEmpty as PacketEmptyEvent
} from "../generated/RedPacketSystem/RedPacketSystem"
import {
  AlreadyClaimed,
  FundsWithdrawn,
  PacketClaimed,
  PacketCreated,
  PacketEmpty
} from "../generated/schema"

export function handleAlreadyClaimed(event: AlreadyClaimedEvent): void {
  let entity = new AlreadyClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId
  entity.claimer = event.params.claimer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let entity = new FundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePacketClaimed(event: PacketClaimedEvent): void {
  let entity = new PacketClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId
  entity.claimer = event.params.claimer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePacketCreated(event: PacketCreatedEvent): void {
  let entity = new PacketCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId
  entity.creator = event.params.creator
  entity.message = event.params.message
  entity.totalAmount = event.params.totalAmount
  entity.totalCount = event.params.totalCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePacketEmpty(event: PacketEmptyEvent): void {
  let entity = new PacketEmpty(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.packetId = event.params.packetId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
