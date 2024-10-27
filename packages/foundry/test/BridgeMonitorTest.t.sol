// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/BridgeMonitor.sol";

contract BridgeMonitorTest is Test {
    BridgeMonitor public monitor;
    address constant SEPOLIA_BRIDGE = 0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789;
    address constant HOLESKY_BRIDGE = 0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789;
    address constant USER = address(0x1);

    // Define event signatures directly in the test contract since they're constants
    bytes32 constant DEPOSIT_EVENT_SIG = keccak256("Deposit(address,uint256)");
    bytes32 constant WITHDRAW_EVENT_SIG = keccak256("Withdraw(address,uint256)");
    bytes32 constant UPGRADE_EVENT_SIG = keccak256("Upgraded(address)");

    event AlertRaised(
        bytes32 indexed transactionId,
        uint8 severity,
        string description,
        address indexed bridgeAddress
    );

    function setUp() public {
        monitor = new BridgeMonitor();
        // Verify the constructor set the addresses correctly
        assertEq(monitor.sepoliaBridge(), SEPOLIA_BRIDGE);
        assertEq(monitor.holeskyBridge(), HOLESKY_BRIDGE);
    }

    function createBaseProof(bytes32 txHash, address bridge) internal pure returns (EVMTransaction.Proof memory) {
        EVMTransaction.Proof memory proof;
        
        // Initialize request body
        proof.data.requestBody.transactionHash = txHash;
        proof.data.requestBody.requiredConfirmations = 1;
        proof.data.requestBody.provideInput = false;
        proof.data.requestBody.listEvents = true;
        proof.data.requestBody.logIndices = new uint32[](0);

        // Initialize response body
        proof.data.responseBody.receivingAddress = bridge;
        proof.data.responseBody.events = new EVMTransaction.Event[](1);
        
        return proof;
    }

    function createEvent(
        address emitter,
        bytes32 eventSig,
        bytes32[] memory extraTopics,
        bytes memory data
    ) internal pure returns (EVMTransaction.Event memory) {
        bytes32[] memory topics = new bytes32[](1 + extraTopics.length);
        topics[0] = eventSig;
        for (uint i = 0; i < extraTopics.length; i++) {
            topics[i + 1] = extraTopics[i];
        }
        
        return EVMTransaction.Event({
            logIndex: 0,
            emitterAddress: emitter,
            topics: topics,
            data: data,
            removed: false
        });
    }

    function testInitialState() public {
        BridgeMonitor.SecurityAlert[] memory alerts = monitor.getAlerts();
        assertEq(alerts.length, 0, "Initial alerts should be empty");
    }

    function testProcessDepositEvent() public {
        bytes32 txHash = keccak256("testDeposit");
        uint256 depositAmount = 150 ether; // Over 100 ether threshold

        // Create proof with deposit event
        EVMTransaction.Proof memory proof = createBaseProof(txHash, SEPOLIA_BRIDGE);
        
        // Create deposit event
        bytes32[] memory extraTopics = new bytes32[](0);
        bytes memory eventData = abi.encode(USER, depositAmount);
        proof.data.responseBody.events[0] = createEvent(
            SEPOLIA_BRIDGE,
            DEPOSIT_EVENT_SIG,
            extraTopics,
            eventData
        );

        // Expect alert emission
        vm.expectEmit(true, true, true, true);
        emit AlertRaised(txHash, 2, "Large deposit detected", SEPOLIA_BRIDGE);

        monitor.verifyAndProcessTransaction(proof);

        // Verify alert was stored
        BridgeMonitor.SecurityAlert[] memory alerts = monitor.getAlerts();
        assertEq(alerts.length, 1, "Should have one alert");
        assertEq(alerts[0].transactionId, txHash);
        assertEq(alerts[0].severity, 2);
        assertEq(alerts[0].description, "Large deposit detected");
        assertEq(alerts[0].bridgeAddress, SEPOLIA_BRIDGE);
    }

    function testProcessWithdrawEvent() public {
        bytes32 txHash = keccak256("testWithdraw");
        uint256 withdrawAmount = 150 ether; // Over 100 ether threshold

        // Create proof with withdraw event
        EVMTransaction.Proof memory proof = createBaseProof(txHash, HOLESKY_BRIDGE);
        
        // Create withdraw event
        bytes32[] memory extraTopics = new bytes32[](0);
        bytes memory eventData = abi.encode(USER, withdrawAmount);
        proof.data.responseBody.events[0] = createEvent(
            HOLESKY_BRIDGE,
            WITHDRAW_EVENT_SIG,
            extraTopics,
            eventData
        );

        // Expect alert emission
        vm.expectEmit(true, true, true, true);
        emit AlertRaised(txHash, 3, "Large withdrawal detected", HOLESKY_BRIDGE);

        monitor.verifyAndProcessTransaction(proof);

        // Verify alert was stored
        BridgeMonitor.SecurityAlert[] memory alerts = monitor.getAlerts();
        assertEq(alerts.length, 1, "Should have one alert");
        assertEq(alerts[0].severity, 3);
        assertEq(alerts[0].description, "Large withdrawal detected");
    }

    function testProcessUpgradeEvent() public {
        bytes32 txHash = keccak256("testUpgrade");
        address newImplementation = address(0x2);

        // Create proof with upgrade event
        EVMTransaction.Proof memory proof = createBaseProof(txHash, SEPOLIA_BRIDGE);
        
        // Create upgrade event with implementation address in topics
        bytes32[] memory extraTopics = new bytes32[](1);
        extraTopics[0] = bytes32(uint256(uint160(newImplementation)));
        proof.data.responseBody.events[0] = createEvent(
            SEPOLIA_BRIDGE,
            UPGRADE_EVENT_SIG,
            extraTopics,
            ""
        );

        // Expect alert emission
        vm.expectEmit(true, true, true, true);
        emit AlertRaised(txHash, 3, "Bridge contract upgraded", SEPOLIA_BRIDGE);

        monitor.verifyAndProcessTransaction(proof);

        // Verify alert was stored
        BridgeMonitor.SecurityAlert[] memory alerts = monitor.getAlerts();
        assertEq(alerts.length, 1, "Should have one alert");
        assertEq(alerts[0].severity, 3);
        assertEq(alerts[0].description, "Bridge contract upgraded");
    }

    function testPreventDoubleProcessing() public {
        bytes32 txHash = keccak256("testDeposit");
        uint256 depositAmount = 150 ether;

        // Create proof with deposit event
        EVMTransaction.Proof memory proof = createBaseProof(txHash, SEPOLIA_BRIDGE);
        
        // Create deposit event
        bytes32[] memory extraTopics = new bytes32[](0);
        bytes memory eventData = abi.encode(USER, depositAmount);
        proof.data.responseBody.events[0] = createEvent(
            SEPOLIA_BRIDGE,
            DEPOSIT_EVENT_SIG,
            extraTopics,
            eventData
        );

        // First processing should succeed
        monitor.verifyAndProcessTransaction(proof);

        // Second processing should revert
        vm.expectRevert("Transaction already processed");
        monitor.verifyAndProcessTransaction(proof);
    }

    function testRejectUnmonitoredBridge() public {
        bytes32 txHash = keccak256("testDeposit");
        address unknownBridge = address(0x3);

        // Create proof with unmonitored bridge
        EVMTransaction.Proof memory proof = createBaseProof(txHash, unknownBridge);

        // Should revert with appropriate message
        vm.expectRevert("Not a monitored bridge");
        monitor.verifyAndProcessTransaction(proof);
    }
}