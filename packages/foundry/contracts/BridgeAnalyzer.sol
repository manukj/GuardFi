// BridgeAnalyzer.sol
pragma solidity ^0.8.24;

contract BridgeAnalyzer {
    struct VulnerabilityCheck {
        string functionName;
        bool hasVulnerability;
        uint8 riskLevel;
        string description;
    }

    function analyzeBridgeContract(
        address bridge
    ) public view returns (VulnerabilityCheck[] memory) {
        VulnerabilityCheck[] memory checks = new VulnerabilityCheck[](3);
        checks[0] = analyzeMintSecurity(bridge);
        checks[1] = analyzeWithdrawSecurity(bridge);
        checks[2] = analyzeOwnershipSecurity(bridge);
        return checks;
    }

    function analyzeMintSecurity(
        address bridge
    ) public view returns (VulnerabilityCheck memory) {
        bool hasMultiSig;
        bool hasLimits;

        try IBridge(bridge).requiredSigners() returns (uint256 signers) {
            hasMultiSig = signers > 2; // Require at least 3 signers
        } catch {
            hasMultiSig = false;
        }

        try IBridge(bridge).mintLimit() returns (uint256 limit) {
            hasLimits = limit > 0;
        } catch {
            hasLimits = false;
        }

        uint8 riskLevel;
        string memory description;

        if (!hasMultiSig) {
            riskLevel = 5;
            description = "No multi-signature requirement for minting";
        } else if (!hasLimits) {
            riskLevel = 4;
            description = "Unrestricted minting capability";
        } else {
            riskLevel = 1;
            description = "No vulnerabilities detected";
        }

        return
            VulnerabilityCheck({
                functionName: "mint()",
                hasVulnerability: !hasMultiSig || !hasLimits,
                riskLevel: riskLevel,
                description: description
            });
    }

    function analyzeWithdrawSecurity(
        address bridge
    ) public view returns (VulnerabilityCheck memory) {
        bool hasTimelock;
        bool hasWithdrawLimit;

        try IBridge(bridge).withdrawalDelay() returns (uint256 delay) {
            hasTimelock = delay >= 1 days;
        } catch {
            hasTimelock = false;
        }

        try IBridge(bridge).withdrawalLimit() returns (uint256 limit) {
            hasWithdrawLimit = limit > 0;
        } catch {
            hasWithdrawLimit = false;
        }

        uint8 riskLevel;
        string memory description;

        if (!hasTimelock) {
            riskLevel = 5;
            description = "No timelock on withdrawals";
        } else if (!hasWithdrawLimit) {
            riskLevel = 4;
            description = "No withdrawal limits";
        } else {
            riskLevel = 1;
            description = "No vulnerabilities detected";
        }

        return
            VulnerabilityCheck({
                functionName: "withdraw()",
                hasVulnerability: !hasTimelock || !hasWithdrawLimit,
                riskLevel: riskLevel,
                description: description
            });
    }

    function analyzeOwnershipSecurity(
        address bridge
    ) public view returns (VulnerabilityCheck memory) {
        bool hasTwoStepTransfer;
        bool hasTimelock;

        try IBridge(bridge).pendingOwner() returns (address pending) {
            hasTwoStepTransfer = pending != address(0); // Check if there's a pending owner
        } catch {
            hasTwoStepTransfer = false;
        }

        try IBridge(bridge).ownershipTransferDelay() returns (uint256 delay) {
            hasTimelock = delay >= 1 days;
        } catch {
            hasTimelock = false;
        }

        string memory description = !hasTwoStepTransfer
            ? "Single-step ownership transfer"
            : (
                !hasTimelock
                    ? "No timelock on ownership transfer"
                    : "No vulnerabilities detected"
            );

        return
            VulnerabilityCheck({
                functionName: "transferOwnership()",
                hasVulnerability: !hasTwoStepTransfer || !hasTimelock,
                riskLevel: !hasTwoStepTransfer || !hasTimelock ? 3 : 1,
                description: description
            });
    }
}

interface IBridge {
    function requiredSigners() external view returns (uint256);
    function mintLimit() external view returns (uint256);
    function withdrawalDelay() external view returns (uint256);
    function withdrawalLimit() external view returns (uint256);
    function pendingOwner() external view returns (address);
    function ownershipTransferDelay() external view returns (uint256);
}
