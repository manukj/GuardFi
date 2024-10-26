// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/BridgeMonitor.sol";

contract DeployMonitor is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address sepoliaBridge = vm.envAddress("SEPOLIA_BRIDGE");
        // address holeskyBridge = vm.envAddress("HOLESKY_BRIDGE");

vm.createSelectFork(vm.rpcUrl('sepolia'));
        vm.startBroadcast(deployerPrivateKey);

        
        BridgeMonitor monitorSepolia = new BridgeMonitor(
        );
vm.stopBroadcast();


     vm.createSelectFork(vm.rpcUrl('holesky'));
     vm.startBroadcast(deployerPrivateKey);
         BridgeMonitor monitorholesky = new BridgeMonitor(
        );

        vm.stopBroadcast();
    }
}