const hre = require("hardhat");


async function deployContract(name) {
    const factory = await hre.ethers.getContractFactory(name);
    const contract = await factory.deploy();

    await contract.deployed();
    console.log(`${name} Contract address:`, contract.address);

    return contract;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function removeNumericKeys(object) {
    cleanObj = {}
    for (const key in object) {
        if (isNaN(key)) {
            cleanObj[key] = object[key]
        }
    }
    return cleanObj;
}

async function main() {
    const accounts = await hre.ethers.getSigners();

    const kasuContract = await deployContract("Kasu");
    const fakeNFT = await deployContract("FakeNFT");
    saveFrontendFiles({
        "Kasu": kasuContract,
        "FakeNFT": fakeNFT
    });

    console.log("Minting 10 NFTs for each account...")
    for (const account of accounts) {
        await fakeNFT.connect(account).mint(10);
        break;
    }

    owner = accounts[0];
    console.log("Listing 5 NFTs from account " + owner.address);

    for (var i = 0; i < 5; i++) {
        id = await fakeNFT.tokenOfOwnerByIndex(owner.address, i);
        await kasuContract.listNFT(id, fakeNFT.address, getRandomInt(1, 8), getRandomInt(1, 10), getRandomInt(1, 1000))
    }
    events = await kasuContract.queryFilter("ListNFT");
    for (const event of events) {
        console.log(removeNumericKeys(event.args))
    }
}

function saveFrontendFiles(contracts) {
    const fs = require("fs");
    const ABIManager  = require(__dirname + '/../src/utils/abiManager.js');
    console.log(hre.network.config.chainId);
    const abiManager = new ABIManager.ABIManager(hre.network.config.chainId);
    const contractsDir = abiManager.getABIDirectory();

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    var addresses = {}
    for (const contractName in contracts) {
        addresses[contractName] = contracts[contractName].address;

        const artifact = artifacts.readArtifactSync(contractName);

        fs.writeFileSync(
            contractsDir + `/${contractName}.json`,
            JSON.stringify(artifact, null, 2)
        );
    }
    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify(addresses, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
