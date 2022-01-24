// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./KasuStorage.sol";

abstract contract KasuMath is KasuStorage {
    // Calculates the upfront payment for renting an NFT.
    // Includes collateral and the full-term interest. 
    function _calculatePayment(Listing storage listing) internal view returns (uint256) {
        return listing.collateralRequired + _calculateInterest(listing, listing.duration * 1 days);
    }

    // Calculates the interest payment for a partial rental period.
    function _calculateInterest(Listing storage listing, uint periodInSeconds) internal view returns (uint256) {
        return listing.dailyInterestRate * listing.collateralRequired * periodInSeconds / (1 days) / 100;
    }
}