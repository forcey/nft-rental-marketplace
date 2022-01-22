import { ethers } from 'ethers';

class Web3Provider {
    static instance = null;

    provider = null;
    signer = null;
    account = null;

    constructor(){
        this.provider = null;
        this.signer = null;
        this.account = null;
    }
    
    static createInstance() {
        return new Web3Provider();
    }

    isEnabled(){
        return (this.provider !== null);
    }

    async Enable(){
        if (this.provider !== null) return;
        
        if (typeof window.ethereum != undefined) {
            var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.account = accounts[0];

            window.ethereum.on('accountsChanged', function () {
                window.location.reload();
            });
        }
    }

    static getInstance () {
        if (!Web3Provider.instance) {
            Web3Provider.instance = new Web3Provider();
        }
        return Web3Provider.instance;
    }
}

const web3provider = Web3Provider.getInstance();
export default web3provider;