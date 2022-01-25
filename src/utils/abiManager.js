import { ethers } from 'ethers';
import hardhat_abis from '../abis/hardhat';
import rinkeby_abis from '../abis/rinkeby';

class ABIManager{
  signer = null;

  constructor(signer){
      this.signer = signer;
  }
  
  getABIDirectory(){
    const DirectoryByChainID = {
      // TODO: create mainnet ABIs, add index.js and import
      // "1": mainnet,
      "4": rinkeby_abis,
      "31337": hardhat_abis,
    };
    const jsonFiles = DirectoryByChainID[this.signer.chainId];
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

  KasuContract(){
    return new ethers.Contract(this.contractAddress.Kasu,
                               this.Kasu.abi,
                               this.signer);
  }

  FakeNFTContract() {
    return new ethers.Contract(this.contractAddress.FakeNFT,
                               this.FakeNFT.abi,
                               this.signer);
  }

}

export {ABIManager, }