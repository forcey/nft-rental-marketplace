/* index file

import contractAddress from "./contract-address.json";
import FakeNFT from "./FakeNFT.json";
import Kasu from "./Kasu.json"

 const ABIIndex = {
  contractAddress : contractAddress,
  FakeNFT : FakeNFT,
  Kasu : Kasu,
}
export {ABIIndex}

*/ 

import hardhat_abis from '../abis/hardhat'
import rinkeby_abis from '../abis/rinkeby'

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
    return hardhat_abis()
  }
  
  get KasuContract() {
      return this.getABIDirectory().Kasu;
  }
  
  get ContractAddress() {
      return this.getABIDirectory().contractAddress;
  }
  
  get FakeNFTContract() {
      return this.getABIDirectory().FakeNFT;
  }
}

export {ABIManager, }