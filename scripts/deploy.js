const hre = require("hardhat");

async function deployContract(name) {
    const factory = await hre.ethers.getContractFactory(name);
    const contract = await factory.deploy();

    await contract.deployed();
    console.log(`${name} Contract address:`, contract.address);

    return contract;
}

async function main() {
    const accounts = await hre.ethers.getSigners();

    const kasuContract = await deployContract("Kasu");
    const fakeNFT = await deployContract("FakeNFT");
    saveFrontendFiles({
        "Kasu": kasuContract,
        "FakeNFT": fakeNFT
    });

    for (const account of accounts) {
        // Mint 10 NFTs for each account
        await fakeNFT.connect(account).mint(10);
    }
}

function saveFrontendFiles(contracts) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

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
    );}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
