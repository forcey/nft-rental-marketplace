const { ethers } = require("hardhat");

var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
var expect = chai.expect;

const utils = require("../scripts/deployUtils");

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
  Unavailable: 2,
};

describe("Kasu", function () {

  beforeEach("deploy contract", async () => {
    [owner, account1, account2] = await ethers.getSigners();

    contract = await utils.deployContract("Kasu");
    fakeNFT = await utils.deployContract("FakeNFT");
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
  });

  describe("borrow", function () {
    it("should revert if listing does not exist", async function () {
      await expect(
        contract.connect(account1).borrow(1)
      ).to.be.revertedWith("listing does not exist");
    });

    it("should revert if token is your own", async function () {
      await contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED);
      await expect(
        contract.connect(owner).borrow(1, { value: 1000 })
      ).to.be.revertedWith("cannot rent your own token");
    });

    it("should revert if payment is not exact amount", async function () {
      await contract.connect(owner).listNFT(TOKEN_ID_1, TOKEN_ADDRESS, MAX_RENT_DURATION, DAILY_INTEREST_RATE, COLLATERAL_REQUIRED);
      await expect(
        contract.connect(account1).borrow(1, { value: 1000 })
      ).to.be.revertedWith("must send the exact payment");
    });

    it("should revert if token cannot be transferred", async function () {
      await fakeNFT.connect(owner).mint(1);
      await contract.connect(owner).listNFT(1, fakeNFT.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, ethers.utils.parseEther("10"));
      // 5 days * 1% * 10 ether = 0.5 ether, plus collateral of 10 ether
      await expect(
        contract.connect(account1).borrow(1, { value: ethers.utils.parseEther("10.5") })
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it("should emit transfer event if all goes well", async function () {
      await fakeNFT.connect(owner).mint(1);
      await fakeNFT.connect(owner).setApprovalForAll(contract.address, true);
      await contract.connect(owner).listNFT(1, fakeNFT.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, ethers.utils.parseEther("10"));
      // 5 days * 1% * 10 ether = 0.5 ether, plus collateral of 10 ether
      const tx = await contract.connect(account1).borrow(1, { value: ethers.utils.parseEther("10.5") });
      await expect(tx).to.emit(fakeNFT, "Transfer").withArgs(owner.address, account1.address, 1);

      const block = await ethers.provider.getBlock(tx.blockNumber);

      expect(
        await contract.viewAllListings()
      ).to.containSubset([
        {
          id: ethers.BigNumber.from(1),
          tokenId: ethers.BigNumber.from(1),
          tokenAddress: fakeNFT.address,
          lenderAddress: owner.address,
          duration: 5,
          dailyInterestRate: 1,
          collateralRequired: ethers.utils.parseEther("10"),
          rental: {
            borrowerAddress: account1.address,
            rentDuration: 5,
            rentedAt: ethers.BigNumber.from(block.timestamp),
          },
          rentalStatus: RentalStatus.Unavailable
        }]);
    });

    it("should revert if token is already rent out", async function () {
      await fakeNFT.connect(owner).mint(1);
      await fakeNFT.connect(owner).setApprovalForAll(contract.address, true);
      await contract.connect(owner).listNFT(1, fakeNFT.address, MAX_RENT_DURATION, DAILY_INTEREST_RATE, ethers.utils.parseEther("10"));
      // 5 days * 1% * 10 ether = 0.5 ether, plus collateral of 10 ether
      await contract.connect(account1).borrow(1, { value: ethers.utils.parseEther("10.5") });
      await expect(
        contract.connect(account2).borrow(1, { value: ethers.utils.parseEther("10.5") })
      ).to.be.revertedWith("not an available listing");
    });
  });
});
