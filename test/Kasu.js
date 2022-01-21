const { expect } = require("chai");
const { ethers } = require("hardhat");

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
    it("should revert when token id is empty", async function () {
      await expect(
        contract.connect(owner).listNFT(0, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED)
			).to.be.revertedWith("validateListingNFT:: TokenId cannot be empty");
    });

    it("should revert when token address is empty", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID, "0x0000000000000000000000000000000000000000", MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: TokenAddress cannot be empty");
    });

    it("should revert when listing rent duration is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, 0, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: Duration cannot be zero");
    });

    it("should revert when daily interest rate is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, MAX_RENT_DURATION, 0, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: Daily interest rate cannot be zero");
    });

    it("should revert when collateral is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, 0)
      ).to.be.revertedWith("validateListingNFT:: Collateral cannot be zero");
    });

    it("should emit listNFT event when NFT is listed", async function () {
      let currentListingCount = (await contract.connect(owner).getListingCount()).toNumber();

      await expect(contract.connect(owner).listNFT(TOKEN_ID, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED))
        .to.emit(contract, "ListNFT")
        .withArgs(currentListingCount, TOKEN_ID, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED);

    });
  });

});
