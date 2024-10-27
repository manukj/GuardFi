// script/DeployBridgeAnalyzer.s.sol
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/BridgeAnalyzer.sol";

contract DeployBridgeAnalyzer is Script {
    function run() external {
        // Retrieve private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy BridgeAnalyzer
        BridgeAnalyzer analyzer = new BridgeAnalyzer();

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log the address
        console.log("BridgeAnalyzer deployed to:", address(analyzer));
    }
}
