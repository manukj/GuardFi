// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "./flare-periphery-contracts/coston2/ContractRegistry.sol";
import {TestFtsoV2Interface} from "./flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

contract BridgeSecurityAnalyzerFTSO {
    TestFtsoV2Interface internal ftsoV2;
    
    // Feed IDs (FLR/USD, BTC/USD, ETH/USD)
    bytes21[] public feedIds = [
        bytes21(0x01464c522f55534400000000000000000000000000), // FLR/USD
        bytes21(0x014254432f55534400000000000000000000000000), // BTC/USD
        bytes21(0x014554482f55534400000000000000000000000000)  // ETH/USD
    ];

    event FeedAnomalyDetected(bytes21 feedId, uint256 value, uint64 timestamp, string riskLevel);

    // Set a threshold for price anomaly detection
    uint256 public priceThreshold = 1000 * 10 ** 18; // Example threshold for demonstration

    constructor() {
        // Initialize FTSOv2 through test registry (use production ContractRegistry for live)
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * Check feeds and detect anomalies that might indicate security risks.
     */
    function checkFeedAnomalies()
        external
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            uint64 _timestamp
        )
    {
        // Retrieve the current feed values
        (_feedValues, _decimals, _timestamp) = ftsoV2.getFeedsById(feedIds);

        // Loop through feed values to detect any significant anomalies
        for (uint256 i = 0; i < _feedValues.length; i++) {
            if (_feedValues[i] > priceThreshold) {
                // Emit an event for the analyzer system to detect this anomaly
                emit FeedAnomalyDetected(feedIds[i], _feedValues[i], _timestamp, "Imminent Risk");
            } else if (_feedValues[i] < priceThreshold / 10) {
                emit FeedAnomalyDetected(feedIds[i], _feedValues[i], _timestamp, "Moderate Risk");
            } else {
                emit FeedAnomalyDetected(feedIds[i], _feedValues[i], _timestamp, "Super Secure");
            }
        }

        return (_feedValues, _decimals, _timestamp);
    }

    /**
     * Update the price threshold for risk analysis.
     */
    function updatePriceThreshold(uint256 newThreshold) external {
        priceThreshold = newThreshold;
    }
}