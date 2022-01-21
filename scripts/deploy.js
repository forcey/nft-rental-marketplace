const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const Kasu = await hre.ethers.getContractFactory("Kasu");
    const kasuContract = await Kasu.deploy();

    await kasuContract.deployed();
    console.log("Kasu Contract address:", kasuContract.address);

    saveFrontendFiles(kasuContract);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ Kasu: contract.address }, undefined, 2)
    );

    const KasuContractArtifact = artifacts.readArtifactSync("Kasu");

    fs.writeFileSync(
        contractsDir + "/Kasu.json",
        JSON.stringify(KasuContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
