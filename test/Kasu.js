const { ethers } = require("hardhat");

var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
var expect = chai.expect;

const MAX_RENT_DURATION = 5;
const DAILY_INTEREST_RATE = 1;
const COLLATERAL_REQUIRED = 10; // in ETH
const TOKEN_ID_1 = 100;
const TOKEN_ID_2 = 200;
const TOKEN_ADDRESS = "0x5f4a54E29ccb8a02CDF7D7BFa8a0999A8330CCeD"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const RentalStatus = {
  None: 0,
  Available: 1,
  Unavilable: 2,
};

describe("Kasu", function () {

  beforeEach("deploy contract", async () => {
    const accounts = await ethers.getSigners();

    owner = accounts[0];
    account1 = accounts[1];

    const KasuContractArtifact = artifacts.readArtifactSync("Kasu");
    const Kasu = await ethers.getContractFactoryFromArtifact(KasuContractArtifact);

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
        contract.connect(owner).listNFT(TOKEN_ID_1, "0x0000000000000000000000000000000000000000", MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: TokenAddress cannot be empty");
    });

    it("should revert when listing rent duration is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, 0, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: Duration cannot be zero");
    });

    it("should revert when daily interest rate is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, MAX_RENT_DURATION, 0, COLLATERAL_REQUIRED)
      ).to.be.revertedWith("validateListingNFT:: Daily interest rate cannot be zero");
    });

    it("should revert when collateral is zero", async function () {
      await expect(
        contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, 0)
      ).to.be.revertedWith("validateListingNFT:: Collateral cannot be zero");
    });

    it("should emit listNFT event when NFT is listed", async function () {
      await expect(contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED))
        .to.emit(contract, "ListNFT")
        .withArgs(1, TOKEN_ID_1, TOKEN_ADDRESS, owner.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED);
    });
  });

  describe("viewAllListings", function () {
    it("should return all listings", async function () {
      await contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, 1, 2, 3);
      await contract.connect(owner).listNFT(TOKEN_ID_2, TOKEN_ADDRESS, 4, 5, 6);
      expect(
        await contract.viewAllListings()
      ).to.containSubset([
        {
          id: ethers.BigNumber.from(1),
          tokenId: ethers.BigNumber.from(TOKEN_ID_1),
          tokenAddress: TOKEN_ADDRESS,
          lenderAddress: owner.address,
          duration: 1,
          dailyInterestRate: 2,
          collateralRequired: ethers.BigNumber.from(3),
          rental: {
            borrowerAddress: ZERO_ADDRESS,
            rentDuration: 0,
            rentedAt: ethers.BigNumber.from(0),
          },
          rentalStatus: RentalStatus.Available
        },
        {
          id: ethers.BigNumber.from(2),
          tokenId: ethers.BigNumber.from(TOKEN_ID_2),
          tokenAddress: TOKEN_ADDRESS,
          lenderAddress: owner.address,
          duration: 4,
          dailyInterestRate: 5,
          collateralRequired: ethers.BigNumber.from(6),
          rental: {
            borrowerAddress: ZERO_ADDRESS,
            rentDuration: 0,
            rentedAt: ethers.BigNumber.from(0),
          },
          rentalStatus: RentalStatus.Available
        }
      ])
    })
  })
});
