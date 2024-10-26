// VulnerableBridge.sol
pragma solidity ^0.8.24;

contract VulnerableBridge {
    uint256 public mintLimit;
    uint256 public withdrawalLimit;
    uint256 public withdrawalDelay;
    address public pendingOwner;
    uint256 public ownershipTransferDelay;
    uint256 public requiredSigners;

    function configureSecurityFeatures(
        bool hasMintLimit,
        bool hasWithdrawLimit,
        bool hasWithdrawDelay,
        bool hasMultiSig,
        bool hasPendingOwner
    ) external {
        mintLimit = hasMintLimit ? type(uint256).max : 0;
        withdrawalLimit = hasWithdrawLimit ? type(uint256).max : 0;
        withdrawalDelay = hasWithdrawDelay ? 1 days : 0;
        requiredSigners = hasMultiSig ? 3 : 1;
        pendingOwner = hasPendingOwner ? address(1) : address(0);
        ownershipTransferDelay = hasPendingOwner ? 1 days : 0;
    }
}
