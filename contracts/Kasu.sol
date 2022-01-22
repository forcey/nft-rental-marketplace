// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./KasuStorage.sol";

contract Kasu is KasuStorage {
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

    function getListingCount() public view returns (uint) {
        return _getListingCount();
    }

    // [Feature 1] Main listings dashboard
    // This function returns all listings stored in the contract.
    function viewAllListings() public view returns (Listing[] memory){
        uint256[] memory listingIds = _getListingIds();
        Listing[] memory listings = new Listing[](listingIds.length);
        for (uint i = 0; i < listingIds.length; i++) {
            listings[i] = _getListingById(listingIds[i]);
        }
        return listings;
    }

    // [Feature 1] Main listings dashboard
    // Front end will invoke this function to deposit collateral and receive the NFT to the borrower's address
    function borrow(uint256 listingId) public {

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
    function unListNFT(uint256 listingId) public {

    }

    // [Feature 2] Lender's dashboard
    // Lender can unlist NFT and this listing is removed from the map/storage
    function terminateRental(uint256 listingId) public {

    }

    // [Feature 3] Borrower's dashboard
    // borrower can see all the NFTs they borrowed
    function viewRentedListings(uint256 listingId) public {

    }

    // [Feature 3] Borrower's dashboard
    // After borrower return NFT, collateral is sent from smart contract to borrower's address
    function returnNFT(uint256 listingId) public {

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
