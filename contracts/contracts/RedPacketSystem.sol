// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title 红包系统合约
 * @dev 一个支持多用户创建多个随机或均分红包的工厂合约。
 * @notice 增加了事件，优化了资金分配逻辑，并支持超时后提现。
 */
contract RedPacketSystem {
    // 红包结构体
    struct RedPacket {
        address owner; // 创建者
        string message; // 祝福语
        uint256 totalAmount; // 总金额
        uint256 balance; // 剩余金额
        uint256 totalCount; // 总份数
        uint256 claimedCount; // 已领取份数
        bool isEven; // 是否均分
        uint256 creationTime; // 创建时间
    }

    // 红包ID计数器
    uint256 public packetCounter;

    // 存储所有红包: packetId => RedPacket
    mapping(uint256 => RedPacket) public packets;

    // 记录谁抢了哪个红包: packetId => userAddress => bool
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    // --- Events ---
    // v-- 修改点 1: 在事件定义的末尾，增加了 bool isEven --v
    event PacketCreated(
        uint256 indexed packetId,
        address indexed creator,
        string message,
        uint256 totalAmount,
        uint256 totalCount,
        bool isEven
    );
    event PacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount
    );
    event PacketEmpty(uint256 indexed packetId);
    event AlreadyClaimed(uint256 indexed packetId, address indexed claimer);
    event FundsWithdrawn(
        uint256 indexed packetId,
        address indexed owner,
        uint256 amount
    );

    /**
     * @dev 创建一个新红包
     * @param _message 祝福语
     * @param _count 红包数量
     * @param _isEven 是否均分
     */
    function createRedPacket(
        string memory _message,
        uint256 _count,
        bool _isEven
    ) external payable {
        require(msg.value > 0, "RedPacket: Must send ETH to create");
        require(_count > 0, "RedPacket: Count must be greater than 0");
        require(
            msg.value >= _count,
            "RedPacket: Amount must be at least 1 wei per packet"
        );

        uint256 packetId = ++packetCounter;
        packets[packetId] = RedPacket({
            owner: msg.sender,
            message: _message,
            totalAmount: msg.value,
            balance: msg.value,
            totalCount: _count,
            claimedCount: 0,
            isEven: _isEven,
            creationTime: block.timestamp
        });

        // v-- 修改点 2: 在 emit 语句的末尾，增加了 _isEven --v
        emit PacketCreated(
            packetId,
            msg.sender,
            _message,
            msg.value,
            _count,
            _isEven
        );
    }

    /**
     * @dev 抢红包
     * @param _packetId 红包的ID
     */
    function claimRedPacket(uint256 _packetId) external {
        RedPacket storage packet = packets[_packetId];

        // 基础检查
        require(packet.owner != address(0), "RedPacket: Not exist");
        require(
            packet.claimedCount < packet.totalCount,
            "RedPacket: No packets left"
        );
        if (hasClaimed[_packetId][msg.sender]) {
            emit AlreadyClaimed(_packetId, msg.sender);
            return; // 使用 return 而不是 require 来触发事件，对前端更友好
        }

        hasClaimed[_packetId][msg.sender] = true;
        packet.claimedCount++;

        uint256 amount;
        if (packet.claimedCount == packet.totalCount) {
            // 最后一个人，获得所有剩余金额
            amount = packet.balance;
        } else {
            if (packet.isEven) {
                // 均分模式
                amount = packet.totalAmount / packet.totalCount;
            } else {
                // 随机模式
                amount = _getRandomAmount(
                    packet.balance,
                    packet.totalCount - packet.claimedCount + 1
                );
            }
        }

        if (amount > packet.balance) {
            amount = packet.balance;
        }

        packet.balance -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "RedPacket: Transfer failed");

        emit PacketClaimed(_packetId, msg.sender, amount);

        if (packet.claimedCount == packet.totalCount) {
            emit PacketEmpty(_packetId);
        }
    }

    /**
     * @dev 生成随机金额 (内部函数)
     */
    function _getRandomAmount(
        uint256 _balance,
        uint256 _remainingCount
    ) private view returns (uint256) {
        if (_remainingCount == 0) return 0;
        uint256 avg = _balance / _remainingCount;
        uint256 seed = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, _balance))
        );
        uint256 random = (seed % (avg * 2)) + 1;

        uint256 maxAmount = _balance - (_remainingCount - 1); // 至少为后面的人留 1 wei
        if (random > maxAmount) {
            random = maxAmount;
        }
        return random;
    }

    /**
     * @dev 创建者在5分钟后取回剩余金额
     * @param _packetId 红包ID
     */
    function withdraw(uint256 _packetId) external {
        RedPacket storage packet = packets[_packetId];
        require(msg.sender == packet.owner, "RedPacket: Not owner");
        require(
            block.timestamp > packet.creationTime + 5 minutes,
            "RedPacket: Not expired yet"
        );
        require(packet.balance > 0, "RedPacket: No balance to withdraw");

        uint256 amountToWithdraw = packet.balance;
        packet.balance = 0;

        (bool success, ) = msg.sender.call{value: amountToWithdraw}("");
        require(success, "RedPacket: Withdraw failed");

        emit FundsWithdrawn(_packetId, msg.sender, amountToWithdraw);
    }
}
