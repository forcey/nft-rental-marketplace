import { ethers } from 'ethers';
import Kasu from '../abis/Kasu.json'

async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

function getContract(contractAddr, artifact) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, artifact.abi, signer);

    return contract;
}

function getProviders() {
    const env = require('dotenv').config().parsed
    // TODO add this filter on keys that the dev has given in .env and
    // dynamically create the options, assert its not empty...
    const options = {
        alchemy: env.ALCHEMY_API_KEY,
        infura: env.INFURA_API_KEY
    }
    return ethers.getDefaultProvider(env.NETWORK, options)
} 

export { requestAccount, getContract }