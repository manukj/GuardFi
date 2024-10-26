// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/BridgeSecurityAnalyzerFTSO.sol";
import "./DeployHelpers.s.sol";

contract DeployBridgeSecurityAnalyzer is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    // Deploy the BridgeSecurityAnalyzerFTSO contract with deployer as the operator address
    BridgeSecurityAnalyzerFTSO analyzer = new BridgeSecurityAnalyzerFTSO(deployer);
    
    console.logString(
      string.concat(
        "BridgeSecurityAnalyzerFTSO deployed at: ", vm.toString(address(analyzer))
      )
    );
  }
}