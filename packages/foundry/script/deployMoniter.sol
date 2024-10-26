// script/DeployMonitor.s.sol
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "packages/foundry/contracts/BridgeMonitor.sol";

contract DeployMonitor is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address sepoliaBridge = vm.envAddress("SEPOLIA_BRIDGE");
        address goerliBridge = vm.envAddress("HOLESKY_BRIDGE");


        vm.startBroadcast(deployerPrivateKey);

        BridgeMonitor monitor = new BridgeMonitor(
            sepoliaBridge,
            goerliBridge
        );

        vm.stopBroadcast();
    }
}