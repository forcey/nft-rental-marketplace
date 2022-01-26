import { ethers } from 'ethers';
import hardhat_abis from '../abis/hardhat';
import rinkeby_abis from '../abis/rinkeby';
import mainnet_abis from '../abis/mainnet';
import erc721_abi from '../abis/ERC721.json'
import LoginService from './LoginService';

function getABIDirectory() {
  const DirectoryByChainID = {
    "1": mainnet_abis,
    "4": rinkeby_abis,
    "31337": hardhat_abis,
  };
  const jsonFiles = DirectoryByChainID[LoginService.getInstance().chainId];
  if (jsonFiles !== undefined) {
    return jsonFiles
  }
  return hardhat_abis
}

function Kasu() {
  return getABIDirectory().Kasu;
}

function contractAddress() {
  return getABIDirectory().contractAddress;
}

function FakeNFT() {
  return getABIDirectory().FakeNFT;
}

function ERC721_ABI() {
  return erc721_abi;
}

function KasuContract() {
  return new ethers.Contract(contractAddress().Kasu,
    Kasu().abi,
    LoginService.getInstance().signer);
}

function FakeNFTContract() {
  return new ethers.Contract(contractAddress().FakeNFT,
    FakeNFT().abi,
    LoginService.getInstance().signer);
}

function ERC721Contract(address) {
  return new ethers.Contract(address,
    ERC721_ABI(),
    LoginService.getInstance().signer);
}

function getLoginServiceProvider() {
  return LoginService.getInstance().provider;
}

export { KasuContract, FakeNFTContract, getLoginServiceProvider, ERC721Contract };
