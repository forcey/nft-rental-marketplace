// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./KasuStorage.sol";
import "./KasuMath.sol";

contract Kasu is KasuStorage, KasuMath {
    using EnumerableSet for EnumerableSet.UintSet;

    // Events
    event ListNFT(uint256 listingId);
    event TerminateRental(uint256 listingId);

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
    function borrow(uint256 listingId) public payable {
        require(_listingExists(listingId), "listing does not exist");

        Listing storage listing = _getListingById(listingId);
        require(listing.rental.rentedAt == 0, "not an available listing");
        require(listing.lenderAddress != msg.sender, "cannot rent your own token");

        uint payment = _calculatePayment(listing);
        require(msg.value == payment, "must send the exact payment");

        listing.rental.borrowerAddress = payable(msg.sender);
        listing.rental.rentedAt = block.timestamp;

        IERC721 token = IERC721(listing.tokenAddress);
        token.safeTransferFrom(listing.lenderAddress, msg.sender, listing.tokenId);
    }

    // [Feature 2] Lender's dashboard
    // Returns a list of all the listings owned by the sender
    function viewOwnedOngoingListingsAndRentals() public view returns (Listing[] memory){
        // Note: Dynamic arrays are not allowed unless they are storage
        // so we need to allocate a statically sized-array to return.
        // We can probably optimize this, but this should functionally work for now.
        uint listingsOwned = 0;
        for (uint i = 0; i < listingsSet.length(); i++) {
            Listing memory listing = _getListingById(listingsSet.at(i));
            if (listing.lenderAddress == msg.sender) {
                listingsOwned++;
            }
        }
        Listing[] memory ownerListings = new Listing[](listingsOwned);
        uint j = 0;
        for (uint i = 0; i < listingsSet.length(); i++) {
            Listing memory listing = _getListingById(listingsSet.at(i));
            if (listing.lenderAddress == msg.sender) {
                ownerListings[j] = listing;
                j++;
            }
        }
        return ownerListings;
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
                rentedAt: 0
            })
        });

        validateListingNFT(listing);

        _addListing(listing);

        emit ListNFT(listing.id);
    }

    // [Feature 2] Lender's dashboard
    // Lender can unlist NFT and this listing is removed from the map/storage
    function unListNFT(uint256 listingId) public {

    }

    // [Feature 2] Lender's dashboard
    // Lender can unlist NFT and this listing is removed from the map/storage
    function terminateRental(uint256 listingId) public {
        Listing memory listing = _getListingById(listingId);
        validateListingNFT(listing);
        require(listing.lenderAddress == msg.sender, "only the lender can terminate the rental");
        uint dueDate = listing.rental.rentedAt + listing.duration * 86400;
        require(block.timestamp >= dueDate, "cannot terminate rental that is not yet due");
        _deleteListing(listingId);
        (bool sent,) = msg.sender.call{ value: listing.collateralRequired }("");
        require(sent, "failed to send collateral back to lender");
        emit TerminateRental(listingId);
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
