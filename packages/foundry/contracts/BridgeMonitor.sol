
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "packages/foundry/contracts/flare-periphery-contracts/coston/EVMTransaction.sol";
import "packages/foundry/contracts/flare-periphery-contracts/coston/IStateConnector.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeMonitor {
    // Bridge event signatures we care about
    bytes32 constant DEPOSIT_EVENT_SIG = keccak256("Deposit(address,uint256)");
    bytes32 constant WITHDRAW_EVENT_SIG = keccak256("Withdraw(address,uint256)");
    bytes32 constant UPGRADE_EVENT_SIG = keccak256("Upgraded(address)");

    // Bridge addresses
    address public sepoliaBridge;
    address public goerliBridge;

    struct SecurityAlert {
        bytes32 transactionId;
        uint8 severity;  // 1: Info, 2: Warning, 3: Critical
        string description;
        uint256 timestamp;
        address bridgeAddress;
    }

    // Store alerts and processed transactions
    mapping(bytes32 => bool) public processedTxs;
    SecurityAlert[] public alerts;

    event AlertRaised(
        bytes32 indexed transactionId,
        uint8 severity,
        string description,
        address indexed bridgeAddress
    );

    constructor(address _sepoliaBridge, address _goerliBridge) {
        sepoliaBridge = _sepoliaBridge;
        goerliBridge = _goerliBridge;
    }

    function verifyAndProcessTransaction(EVMTransaction.Proof calldata proof) external {
        bytes32 txHash = proof.data.requestBody.transactionHash;
        require(!processedTxs[txHash], "Transaction already processed");
        
        // Verify this transaction is from one of our bridges
        address txSource = proof.data.responseBody.receivingAddress;
        require(
            txSource == sepoliaBridge || txSource == goerliBridge,
            "Not a monitored bridge"
        );

        // Process events
        for (uint i = 0; i < proof.data.responseBody.events.length; i++) {
            EVMTransaction.Event memory evt = proof.data.responseBody.events[i];
            
            // Check if event is from our bridge contract
            if (evt.emitterAddress != txSource) continue;

            // Check event signatures
            bytes32 eventSig = evt.topics[0];
            
            if (eventSig == DEPOSIT_EVENT_SIG) {
                processDepositEvent(txHash, evt, txSource);
            } else if (eventSig == WITHDRAW_EVENT_SIG) {
                processWithdrawEvent(txHash, evt, txSource);
            } else if (eventSig == UPGRADE_EVENT_SIG) {
                processUpgradeEvent(txHash, evt, txSource);
            }
        }

        processedTxs[txHash] = true;
    }

    function processDepositEvent(
        bytes32 txHash,
        EVMTransaction.Event memory evt,
        address bridge
    ) internal {
        // Decode event data
        (address user, uint256 amount) = abi.decode(evt.data, (address, uint256));

        // Check for large deposits
        if (amount > 100 ether) {  // Example threshold
            raiseAlert(
                txHash,
                2, // Warning
                "Large deposit detected",
                bridge
            );
        }
    }

    function processWithdrawEvent(
        bytes32 txHash,
        EVMTransaction.Event memory evt,
        address bridge
    ) internal {
        (address user, uint256 amount) = abi.decode(evt.data, (address, uint256));

        // Check for large withdrawals
        if (amount > 100 ether) {
            raiseAlert(
                txHash,
                3, // Critical
                "Large withdrawal detected",
                bridge
            );
        }
    }

    function processUpgradeEvent(
        bytes32 txHash,
        EVMTransaction.Event memory evt,
        address bridge
    ) internal {
        address newImplementation = address(uint160(uint256(evt.topics[1])));
        
        raiseAlert(
            txHash,
            3, // Critical
            "Bridge contract upgraded",
            bridge
        );
    }

function raiseAlert(
        bytes32 txHash,
        uint8 severity,
        string memory description,
        address bridge
    ) internal {
        SecurityAlert memory alert = SecurityAlert({
            transactionId: txHash,
            severity: severity,
            description: description,
            timestamp: block.timestamp,
            bridgeAddress: bridge
        });

        alerts.push(alert);
        emit AlertRaised(txHash, severity, description, bridge);
    }

    // View functions
    function getAlerts() external view returns (SecurityAlert[] memory) {
        return alerts;
    }
}