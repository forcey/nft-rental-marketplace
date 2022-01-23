import { ethers } from 'ethers';

function getContract(contractAddr, artifact) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, artifact.abi, signer);

    return contract;
}

export { getContract }
