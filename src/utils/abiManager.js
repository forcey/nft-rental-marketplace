import { ethers } from 'ethers';
import hardhat_abis from '../abis/hardhat';
import rinkeby_abis from '../abis/rinkeby';

class ABIManager{
  chainId = null;

  constructor(chainId){
      this.chainId = chainId;
  }
  
  getABIDirectory(){
    const DirectoryByChainID = {
      // TODO: create mainnet ABIs, add index.js and import
      // "1": mainnet,
      "4": rinkeby_abis,
      "31337": hardhat_abis,
    };
    const jsonFiles = DirectoryByChainID[this.chainId];
    if (jsonFiles !== undefined){
      return jsonFiles
    }
    return hardhat_abis
  }
  
  get Kasu() {
      return this.getABIDirectory().Kasu;
  }
  
  get contractAddress() {
      return this.getABIDirectory().contractAddress;
  }
  
  get FakeNFT() {
      return this.getABIDirectory().FakeNFT;
  }

  KasuContract(signer){
    return new ethers.Contract(this.contractAddress.Kasu, this.Kasu.abi, signer);
  }

  FakeNFTContract(signer) {
    return new ethers.Contract(this.contractAddress.FakeNFT, this.FakeNFT.abi, signer);
  }

}

export {ABIManager, }