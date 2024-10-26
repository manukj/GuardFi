// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/BridgeSecurityAnalyzerFTSO.sol";

contract BridgeSecurityAnalyzerFTSOTest is Test {
    BridgeSecurityAnalyzerFTSO public analyzer;
    address public testOperator;

    function setUp() public {
        // Use a test account to simulate a bridge operator
        testOperator = vm.addr(1);
        
        // Deploy the contract and initialize with the test operator
        analyzer = new BridgeSecurityAnalyzerFTSO(testOperator);
    }

    function testInitialFeedValue() public view {
    // Check that the initial feed values are set as expected (e.g., zero)
    (uint256[] memory values, , ) = analyzer.getFtsoV2CurrentFeedValues(); // Ensure this function signature is correct
    
    for (uint256 i = 0; i < values.length; i++) {
        require(values[i] == 0, "Initial feed value is not zero");
    }
}

    function testUpdateFeedValues() public {
        // Simulate the retrieval of feed values and update in the analyzer contract
        uint256 newThreshold = 1000 * 10 ** 18;
        analyzer.updatePriceThreshold(newThreshold);

        // Check that the threshold is updated correctly
        require(analyzer.priceThreshold() == newThreshold, "Threshold update failed");
    }

    function testAnomalyDetection() public {
        // Simulate setting a feed value that triggers an anomaly alert
        uint256 highValue = 2000 * 10 ** 18; // Value above threshold for testing
        vm.startPrank(testOperator); // Use operator permissions for testing
        
        analyzer.checkFeedAnomalies(); // Trigger the check

        // To verify the event emission, you would normally use vm.expectEmit() here.
        // Add assertions or further checks as needed based on your logic.
    }

    function testEventEmission() public {
        // Monitor for specific events on test execution
        uint256 highValue = 2000 * 10 ** 18; // This should match the high value for anomaly detection
        vm.expectEmit(true, true, true, true);
        emit analyzer.FeedAnomalyDetected(
            analyzer.feedIds(0), // Access feedIds through the analyzer
            highValue,
            block.timestamp,
            "Imminent Risk"
        );

        // Run the anomaly check, which should emit the event
        analyzer.checkFeedAnomalies();
    }
}