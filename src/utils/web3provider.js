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

    async isEnabled() {
        return (this.provider !== null && (await this.provider.listAccounts()).length);
    }

    // If popup == true, will pop the metamask login window if not connected.
    // If popup == false, will try to initialize without popping the window.
    // In both cases, returns a Promise<bool> to indicate whether the login was successful.
    async Enable(popup){
        if (await this.isEnabled()) {
            return true;
        }
        
        if (typeof window.ethereum != undefined) {
            if (popup) {
                var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.account = accounts[0];
            }
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();

            window.ethereum.on('accountsChanged', function () {
                window.location.reload();
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
        return await this.isEnabled();
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