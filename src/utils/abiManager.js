class ABIManager{
  chainId = null;

  constructor(chainId){
      this.chainId = chainId;
  }
  
  getABIDirectory(){
    const ABIDirectory = __dirname +  '/../abis';
    const DirectoryByChainID = {
      "1": "/mainnet",
      "4": "/rinkeby",
      "31337": "/hardhat",
    };
    console.log(this.chainId)
    const subDir = DirectoryByChainID[this.chainId];
    console.log(ABIDirectory);
    if (subDir !== undefined){
      return ABIDirectory + subDir;
    }
    console.log(`chainId: ${this.chainId} was not in mapping`)
    return ABIDirectory + '/hardhat';
  }
  
  async KasuContract() {
      return await import(this.getABIDirectory() + '/Kasu.json');
  }
  
  async ContractAddress(){
      return await import(this.getABIDirectory() + '/contract-address.json');
  }
  
  async FakeNFTContract() {
      return await import(this.getABIDirectory() + '/FakeNFT.json');
  }
}

module.exports =  { 
  ABIManager,
};