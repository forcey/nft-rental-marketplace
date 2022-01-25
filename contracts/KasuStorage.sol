// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

abstract contract KasuStorage {
    // Rent will be calcualted as collateral required (1ETH) * Daily interest rate (1%) * duration (5 days)
    // 1ETH * 1% daily interest rate * 5 days = 0.05ETH total
    struct Listing {
        uint256 id; // listing id
        uint256 tokenId; // tokenId from ERC 721 https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
        address tokenAddress;
        address payable lenderAddress; // lenderAddress
        uint16 duration; // duration of the loan in days
        uint16 dailyInterestRate; // daily interest rate
        uint256 collateralRequired; // collateral required
        Rental rental; // Store borrower + rental info
    }

    struct Rental {
        address payable borrowerAddress;
        uint256 rentedAt; // timestamp at which the NFT was rented
    }

    uint nextListingId = 1;
    // create a mapping of listing_id => Listing
    mapping(uint => Listing) listingsMap;
    // set of active (non-deleted) listing ids.
    EnumerableSet.UintSet internal  listingsSet;
    using EnumerableSet for EnumerableSet.UintSet;

    // assigns id to a listing, inserts into the data structure, and returns the id.
    function _addListing(Listing memory listing) internal returns (uint) {
        listing.id = nextListingId++;
        listingsMap[listing.id] = listing;
        listingsSet.add(listing.id);
        return listing.id;
    }

    // deletes a listing from the data structure.
    function _deleteListing(uint256 id) internal {
        delete listingsMap[id];
        listingsSet.remove(id);
    }

    // gets the number of active listings.
    function _getListingCount() internal view returns (uint) {
        return listingsSet.length();
    }

    // gets all the listing ids.
    function _getListingIds() internal view returns (uint256[] memory) {
        uint size = listingsSet.length();
        uint256[] memory listingIds = new uint256[](size);
        for (uint i = 0; i < size; i++) {
            listingIds[i] = listingsSet.at(i);
        }
        return listingIds;
    }

    function _listingExists(uint256 id) internal view returns (bool) {
        return listingsSet.contains(id);
    }

    // gets the listing by id.
    function _getListingById(uint256 id) internal view returns (Listing storage) {
        return listingsMap[id];
    }
}
