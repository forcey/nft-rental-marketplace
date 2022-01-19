// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Kasu {
    uint public listingsCount; // keep track of number of listings

    constructor() public {
        listingsCount = 0;
    }

    enum RentalStatus { 
        Available, 
        Unavailable 
    }

    // Rent will be calcualted as collateral required (1ETH) * Daily interest rate (1%) * duration (5 days) 
    // 1ETH * 1% daily interest rate * 5 days = 0.05ETH total
    struct Listing {
        uint256 tokenId; // tokenId from ERC 721 https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
        address tokenAddress;
        address payable lenderAddress; // lenderAddress
        uint16 duration; // duration of the loan in days
        uint16 dailyInterestRate; // daily interest rate
        uint256 collateralRequired; // collateral required
        RentalStatus rentalStatus; // status of rental 
    }

    struct Rental {
        address payable borrowerAddress;
        uint16 rentDuration; // current rent duration
        uint256 rentedAt; // timestamp at which the NFT was rented
    }

    Listing[] public Listings;


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
    function listNFT(uint256 tokenId, uint16 duration, uint16 dailyInterestRate, uint256 collateralRequired) public {

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

}
