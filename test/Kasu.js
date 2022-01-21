const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants, expectRevert } = require('@openzeppelin/test-helpers');


const MAX_RENT_DURATION = 5;
const DAILY_INTEREST_RATE = 1;
const COLLATERAL_REQUIRED = 10; // in ETH
const TOKEN_ID = 1;
const TOKEN_ADDRESS = "0x5f4a54E29ccb8a02CDF7D7BFa8a0999A8330CCeD"


describe("Kasu", function () {
  beforeEach("deploy contract", async () => {
    const accounts = await ethers.getSigners();

    owner = accounts[0];
    account1 = accounts[1];

    const Kasu = await ethers.getContractFactory("Kasu");

    contract = await Kasu.deploy();

    await contract.deployed();
  });

  describe("listNFT", function () {
    it("should revert when lender address is not the message sender", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, account1.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED),
        'You do not own the NFT',
      );
    });

    it("should revert when token id is empty", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(0, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED),
        'validateListingNFT:: TokenId cannot be empty',
      );
    });

    it("should revert when token address is empty", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(TOKEN_ID, constants.ZERO_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED),
        'validateListingNFT:: TokenAddress cannot be empty',
      );
    });

    it("should revert when listing rent duration is zero", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, owner.address, 0, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED),
        'validateListingNFT:: Duration cannot be zero',
      );
    });

    it("should revert when daily interest rate is zero", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, 0, COLLATERAL_REQUIRED),
        'validateListingNFT:: Daily interest rate cannot be zero',
      );
    });

    it("should revert when collateral is zero", async function () {
      await expectRevert(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, 0),
        'validateListingNFT:: Collateral cannot be zero',
      );
    });

    it("should emit listNFT event when NFT is listed", async function () {
      let currentListingId = (await contract.connect(owner).getListingId()).toNumber();

      await expect(contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED))
        .to.emit(contract, "ListNFT")
        .withArgs(currentListingId, TOKEN_ID, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED);
      
      const newListingId = (await contract.connect(owner).getListingId()).toNumber();

      expect(newListingId).to.eq(currentListingId += 1);
    });

  });
});
