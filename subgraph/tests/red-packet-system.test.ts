import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AlreadyClaimed } from "../generated/schema"
import { AlreadyClaimed as AlreadyClaimedEvent } from "../generated/RedPacketSystem/RedPacketSystem"
import { handleAlreadyClaimed } from "../src/red-packet-system"
import { createAlreadyClaimedEvent } from "./red-packet-system-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let packetId = BigInt.fromI32(234)
    let claimer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAlreadyClaimedEvent = createAlreadyClaimedEvent(packetId, claimer)
    handleAlreadyClaimed(newAlreadyClaimedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AlreadyClaimed created and stored", () => {
    assert.entityCount("AlreadyClaimed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AlreadyClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "packetId",
      "234"
    )
    assert.fieldEquals(
      "AlreadyClaimed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "claimer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
