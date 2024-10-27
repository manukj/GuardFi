// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockVerifier {
    function verifyEVMTransaction(
        bytes32 transactionHash,
        uint16 requiredConfirmations
    ) external pure returns (bool) {
        return true; // Always returns true for mock verification
    }
}
