const hre = require("hardhat");
const utils = require("./deployUtils");

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

    const kasuContract = await utils.deployContract("Kasu");
    const fakeNFT = await utils.deployContract("FakeNFT");
    console.log(`Kasu Contract address:`, kasuContract.address);
    console.log(`FakeNFT Contract address:`, fakeNFT.address);

    saveFrontendFiles({
        "Kasu": kasuContract,
        "FakeNFT": fakeNFT
    });

    const owner = accounts[0];
    console.log(`Minting 10 NFTs for account address: ${owner.address}`)
    await fakeNFT.connect(owner).mint(10);

    console.log(`Listing 5 NFTs from account ${owner.address}`);
    await fakeNFT.setApprovalForAll(kasuContract.address, true);

    for (let i = 0; i < 5; i++) {
        id = await fakeNFT.tokenOfOwnerByIndex(owner.address, i);
        await kasuContract.listNFT(
            id, // tokenId
            fakeNFT.address, // tokenAddress
            getRandomInt(1, 8), // duration
            getRandomInt(1, 10), // dailyInterestRate
            ethers.utils.parseEther("1").mul(getRandomInt(1, 10)) // collateralRequired in wei
        );
    }
    events = await kasuContract.queryFilter("ListNFT");
    const listingIds = [];
    for (const event of events) {
        listingIds.push(removeNumericKeys(event.args).listingId);
    }
    console.log(`Listing IDs: ${listingIds}`)

    // Borrow
    const account1 = accounts[1];
    console.log(`Borrowing some NFTs from account ${account1.address}`)
    const listings = await kasuContract.viewAllListings();
    for (let i = 0; i < listings.length - 2; i++) {
        const listing = listings[i];
        console.log(`Listing id: ${listing.id}, rent duration: ${listing.duration}, collateral req: ${hre.ethers.utils.formatEther(listing.collateralRequired)} eth, interest rate: ${listing.dailyInterestRate}%`)
        const totalAmountRequired = listing.collateralRequired.add(listing.collateralRequired.mul(listing.dailyInterestRate * listing.duration).div(100));
        console.log(`${account1.address} borrowing listing ${listing.id} for a total of ${hre.ethers.utils.formatEther(totalAmountRequired)} ETH`);
        await kasuContract.connect(account1).borrow(
            listing.id,
            { value: totalAmountRequired }
        );
    }

    console.log('Setting next block timestamp forward 14 days so you can terminate rentals')
    const latestBlock = await hre.ethers.provider.getBlock("latest");
    const sevenDaysInTheFuture = latestBlock.timestamp + 86400 * 14;
    await hre.ethers.provider.send('evm_setNextBlockTimestamp', [sevenDaysInTheFuture]);
    await hre.ethers.provider.send('evm_mine');
}

function saveFrontendFiles(contracts) {
    const fs = require("fs");
    const DirectoryByChainID = {
        "1": "/mainnet",
        "4": "/rinkeby",
        "31337": "/hardhat",
      };

    const subDir = DirectoryByChainID[hre.network.config.chainId] || '/hardhat'
    const contractsDir = __dirname + "/../src/abis" + subDir;

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
