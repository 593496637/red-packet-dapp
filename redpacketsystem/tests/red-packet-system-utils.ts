import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AlreadyClaimed,
  FundsWithdrawn,
  PacketClaimed,
  PacketCreated,
  PacketEmpty
} from "../generated/RedPacketSystem/RedPacketSystem"

export function createAlreadyClaimedEvent(
  packetId: BigInt,
  claimer: Address
): AlreadyClaimed {
  let alreadyClaimedEvent = changetype<AlreadyClaimed>(newMockEvent())

  alreadyClaimedEvent.parameters = new Array()

  alreadyClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )
  alreadyClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )

  return alreadyClaimedEvent
}

export function createFundsWithdrawnEvent(
  packetId: BigInt,
  owner: Address,
  amount: BigInt
): FundsWithdrawn {
  let fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent())

  fundsWithdrawnEvent.parameters = new Array()

  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundsWithdrawnEvent
}

export function createPacketClaimedEvent(
  packetId: BigInt,
  claimer: Address,
  amount: BigInt
): PacketClaimed {
  let packetClaimedEvent = changetype<PacketClaimed>(newMockEvent())

  packetClaimedEvent.parameters = new Array()

  packetClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )
  packetClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )
  packetClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return packetClaimedEvent
}

export function createPacketCreatedEvent(
  packetId: BigInt,
  creator: Address,
  message: string,
  totalAmount: BigInt,
  totalCount: BigInt
): PacketCreated {
  let packetCreatedEvent = changetype<PacketCreated>(newMockEvent())

  packetCreatedEvent.parameters = new Array()

  packetCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  packetCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalCount",
      ethereum.Value.fromUnsignedBigInt(totalCount)
    )
  )

  return packetCreatedEvent
}

export function createPacketEmptyEvent(packetId: BigInt): PacketEmpty {
  let packetEmptyEvent = changetype<PacketEmpty>(newMockEvent())

  packetEmptyEvent.parameters = new Array()

  packetEmptyEvent.parameters.push(
    new ethereum.EventParam(
      "packetId",
      ethereum.Value.fromUnsignedBigInt(packetId)
    )
  )

  return packetEmptyEvent
}
