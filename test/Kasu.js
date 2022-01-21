const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Kasu", function () {

  beforeEach("deploy contract", async () => {
    const accounts = await ethers.getSigners();

    owner = accounts[0];
    account1 = accounts[1];

    const Kasu = await ethers.getContractFactory("Kasu");

    contract = await Kasu.deploy();

    await contract.deployed();
  });

  describe("getListingCount", function () {
    it("should get listing count", async function () {

      await contract.connect(account1).incrementListingCount();

      let listingCount = await contract.connect(account1).getListingCount();
      listingCount = listingCount.toNumber();

      expect(listingCount).to.eq(1);
    });
  });
});
