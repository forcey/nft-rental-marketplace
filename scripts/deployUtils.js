const hre = require("hardhat");

async function deployContract(name) {
    const factory = await hre.ethers.getContractFactory(name);
    const contract = await factory.deploy();

    await contract.deployed();
    return contract;
}

module.exports = {deployContract};
