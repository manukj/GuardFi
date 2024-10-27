// BridgeAnalyzer.t.sol
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BridgeAnalyzer.sol";
import "../contracts/VulnerableBridge.sol";

contract BridgeAnalyzerTest is Test {
    BridgeAnalyzer public analyzer;
    VulnerableBridge public bridge;

    function setUp() public {
        analyzer = new BridgeAnalyzer();
        bridge = new VulnerableBridge();
    }

    // Test Mint Security
    function testMintWithoutMultisig() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            true, // has withdraw limit
            true, // has withdraw delay
            false, // single signer <- Testing this
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        assertEq(results[0].functionName, "mint()");
        assertTrue(results[0].hasVulnerability);
        assertEq(results[0].riskLevel, 5);
        assertEq(
            results[0].description,
            "No multi-signature requirement for minting"
        );
    }

    function testMintWithoutLimits() public {
        bridge.configureSecurityFeatures(
            false, // no mint limit <- Testing this
            true, // has withdraw limit
            true, // has withdraw delay
            true, // multiple signers
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        assertEq(results[0].functionName, "mint()");
        assertTrue(results[0].hasVulnerability);
        assertEq(results[0].riskLevel, 4);
        assertEq(results[0].description, "Unrestricted minting capability");
    }

    // Test Withdraw Security
    function testWithdrawWithoutTimelock() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            true, // has withdraw limit
            false, // no withdraw delay <- Testing this
            true, // multiple signers
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        assertEq(results[1].functionName, "withdraw()");
        assertTrue(results[1].hasVulnerability);
        assertEq(results[1].riskLevel, 5);
        assertEq(results[1].description, "No timelock on withdrawals");
    }

    function testWithdrawWithoutLimits() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            false, // no withdraw limit <- Testing this
            true, // has withdraw delay
            true, // multiple signers
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        assertEq(results[1].functionName, "withdraw()");
        assertTrue(results[1].hasVulnerability);
        assertEq(results[1].riskLevel, 4);
        assertEq(results[1].description, "No withdrawal limits");
    }

    // Test Ownership Security
    function testSingleStepOwnershipTransfer() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            true, // has withdraw limit
            true, // has withdraw delay
            true, // multiple signers
            false // no pending owner <- Testing this
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        assertEq(results[2].functionName, "transferOwnership()");
        assertTrue(results[2].hasVulnerability);
        assertEq(results[2].riskLevel, 3);
        assertEq(results[2].description, "Single-step ownership transfer");
    }

    // Combined Security Tests
    function testFullyVulnerableBridge() public {
        bridge.configureSecurityFeatures(
            false, // no mint limit
            false, // no withdraw limit
            false, // no withdraw delay
            false, // single signer
            false // no pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        // Check mint vulnerabilities
        assertEq(results[0].functionName, "mint()");
        assertTrue(results[0].hasVulnerability);
        assertEq(results[0].riskLevel, 5);
        assertEq(
            results[0].description,
            "No multi-signature requirement for minting"
        );

        // Check withdraw vulnerabilities
        assertEq(results[1].functionName, "withdraw()");
        assertTrue(results[1].hasVulnerability);
        assertEq(results[1].riskLevel, 5);
        assertEq(results[1].description, "No timelock on withdrawals");

        // Check ownership vulnerabilities
        assertEq(results[2].functionName, "transferOwnership()");
        assertTrue(results[2].hasVulnerability);
        assertEq(results[2].riskLevel, 3);
        assertEq(results[2].description, "Single-step ownership transfer");
    }

    function testFullySecureBridge() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            true, // has withdraw limit
            true, // has withdraw delay
            true, // multiple signers
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        // All checks should show no vulnerabilities
        for (uint i = 0; i < results.length; i++) {
            assertFalse(results[i].hasVulnerability);
            assertEq(results[i].riskLevel, 1);
            assertEq(results[i].description, "No vulnerabilities detected");
        }
    }

    function testPartiallySecureBridge() public {
        bridge.configureSecurityFeatures(
            true, // has mint limit
            false, // no withdraw limit
            true, // has withdraw delay
            false, // single signer
            true // has pending owner
        );

        BridgeAnalyzer.VulnerabilityCheck[] memory results = analyzer
            .analyzeBridgeContract(address(bridge));

        // Mint should be vulnerable (single signer)
        assertTrue(results[0].hasVulnerability);
        assertEq(results[0].riskLevel, 5);

        // Withdraw should be vulnerable (no limits)
        assertTrue(results[1].hasVulnerability);
        assertEq(results[1].riskLevel, 4);

        // Ownership should be secure
        assertFalse(results[2].hasVulnerability);
        assertEq(results[2].riskLevel, 1);
    }
}
