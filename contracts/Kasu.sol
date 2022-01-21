// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "hardhat/console.sol";

contract Kasu {
    // Events

    event ListNFT(
        uint256 listingId,
        uint256 indexed tokenId,
        address indexed tokenAddress,
        address indexed lenderAddress,
        uint16 duration,
        uint16 dailyInterestRate,
        uint256 collateralRequired
    );
    uint public listingsCount = 1;

    enum RentalStatus {
        None,
        Available,
        Unavailable
    }

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
        RentalStatus rentalStatus; // status of rental
    }

    struct Rental {
        address payable borrowerAddress;
        uint16 rentDuration; // current rent duration
        uint256 rentedAt; // timestamp at which the NFT was rented
    }

    // create a mapping of listing_id => Listing
    mapping(uint => Listing) listingsMap;
    // set of active (non-deleted) listing ids.
    EnumerableSet.UintSet listingsSet;
    using EnumerableSet for EnumerableSet.UintSet;

    function getListingCount() public view returns (uint) {
        return listingsCount;
    }

    // assigns id to a listing, inserts into the data structure, and returns the id.
    function _addListing(Listing memory listing) internal returns (uint) {
        listing.id = listingsCount++;
        listingsMap[listing.id] = listing;
        listingsSet.add(listing.id);
        return listing.id;
    }

    // deletes a listing from the data structure.
    function _deleteListing(uint id) internal {
        delete listingsMap[id];
        listingsSet.remove(id);
    }

    // [Feature 1] Main listings dashboard
    // This function returns all listings stored in the contract. Only show when rental status is available
    function viewAllListings() public returns (Listing[] memory){

    }

    // [Feature 1] Main listings dashboard
    // Front end will invoke this function to deposit collateral and receive the NFT to the borrower's address
    function borrow(uint256 tokenId) public {

    }

    // [Feature 2] Lender's dashboard
    // Front end will pass in owner's token ids and return all the listings
    function viewOwnerListings(address ownerAddress) public returns (Listing[] memory){

    }
    // [Feature 2] Lender's dashboard
    // Lender can list NFT and store all this information in Listing
    function listNFT(uint256 tokenId, address tokenAddress, uint16 duration, uint16 dailyInterestRate, uint256 collateralRequired) public {
        // TODO: this is basic functionality to enable testing. Need to add validation etc. for public use.
        Listing memory listing = Listing ({
            id: 0,  // will be assigned by _addListing()
            tokenId: tokenId,
            tokenAddress: tokenAddress,
            lenderAddress: payable(msg.sender),
            duration: duration,
            dailyInterestRate: dailyInterestRate,
            collateralRequired: collateralRequired,
            rental: Rental({
                borrowerAddress: payable(0),
                rentDuration: 0,
                rentedAt: 0
            }),
            rentalStatus: RentalStatus.Available
        });

        validateListingNFT(listing);

        _addListing(listing);

        emit ListNFT(
            listing.id,
            listing.tokenId,
            listing.tokenAddress,
            listing.lenderAddress,
            listing.duration,
            listing.dailyInterestRate,
            listing.collateralRequired
        );
    }  

    // [Feature 2] Lender's dashboard
    // Lender can unlist NFT and this listing is removed from the map/storage
    function unListNFT(uint256 tokenId) public {

    }

    // [Feature 2] Lender's dashboard
    // Lender can unlist NFT and this listing is removed from the map/storage
    function terminateRental(uint256 tokenId) public {

    }

    // [Feature 3] Borrower's dashboard
    // borrower can see all the NFTs they borrowed
    function viewRentedListings(uint256 tokenId) public {

    }

    // [Feature 3] Borrower's dashboard
    // After borrower return NFT, collateral is sent from smart contract to borrower's address
    function returnNFT(uint256 tokenId) public {

    }

     // helper functions

    function validateListingNFT(Listing memory listing) private pure {
        require(listing.tokenId != 0, "validateListingNFT:: TokenId cannot be empty");
        require(listing.tokenAddress != address(0), "validateListingNFT:: TokenAddress cannot be empty");
        require(listing.duration > 0, "validateListingNFT:: Duration cannot be zero");
        require(listing.dailyInterestRate > 0, "validateListingNFT:: Daily interest rate cannot be zero");
        require(listing.collateralRequired > 0, "validateListingNFT:: Collateral cannot be zero");
    }

}
