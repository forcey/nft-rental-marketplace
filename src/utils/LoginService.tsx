import { ethers } from "ethers";

declare let window: any;

export type LoginServiceObserver = (provider: ethers.providers.Web3Provider, signer: ethers.Signer, walletAddress: string, chainId: number) => void;
export type AccountsChangedObserver = (accounts: Array<string>) => void;
export type ChainChangedObserver = (id: number) => void;

export default class LoginService {
    private static instance: LoginService;
    private _loginObservers: LoginServiceObserver[] = [];
    private _accountChangedObservers: AccountsChangedObserver[] = [];
    private _chainChangedObservers: ChainChangedObserver[] = [];
    private _provider: ethers.providers.Web3Provider | null;
    private _signer: ethers.Signer | null;
    private _walletAddress: string | null;
    private _chainId: number | null;

    private constructor() {
        this._provider = null;
        this._signer = null;
        this._walletAddress = null;
        this._chainId = null;
    }

    public static getInstance(): LoginService {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }
        return LoginService.instance;
    }

    public get provider() {
        return LoginService.instance._provider;
    }

    public get signer() {
        return LoginService.instance._signer;
    }

    public get walletAddress() {
        return LoginService.instance._walletAddress;
    }

    public get chainId() {
        return LoginService.instance._chainId;
    }

    public linkAccount() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Prompt user for account connections
        provider.send("eth_requestAccounts", [])
            .then((data) => {
                (async () => {
                    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
                        LoginService.instance._walletAddress = accounts[0];
                        LoginService.instance._accountChangedObservers.forEach(observer => observer(accounts));
                    });
                    window.ethereum.on('chainChanged', (chainId: any) => {
                        LoginService.instance._chainId = Number(chainId);
                        LoginService.instance._chainChangedObservers.forEach(observer => observer(Number(chainId)));
                    });
                    LoginService.instance._provider = provider;
                    LoginService.instance._signer = provider.getSigner();
                    const chainId = await provider.getSigner().getChainId();
                    LoginService.instance._chainId = chainId;
                    LoginService.instance._walletAddress = data[0];
                    LoginService.instance._loginObservers.forEach(observer => observer(provider, provider.getSigner(), data[0], chainId));
                })();
            },
            (error) => {
                console.log(error);
            });
    }

    public onLogin(observer: LoginServiceObserver) {
        LoginService.instance._loginObservers.push(observer);
    }

    public detachLoginObserver(observerToRemove: LoginServiceObserver) {
        LoginService.instance._loginObservers = LoginService.instance._loginObservers.filter(observer => observerToRemove !== observer);
    }

    public onAccountsChanged(observer: AccountsChangedObserver) {
        LoginService.instance._accountChangedObservers.push(observer);
    }

    public detachAccountsChangedObserver(observerToRemove: AccountsChangedObserver) {
        LoginService.instance._accountChangedObservers = LoginService.instance._accountChangedObservers.filter(observer => observerToRemove !== observer);
    }

    public onChainChanged(observer: ChainChangedObserver) {
        LoginService.instance._chainChangedObservers.push(observer);
    }

    public detachChainChangedObserver(observerToRemove: ChainChangedObserver) {
        LoginService.instance._chainChangedObservers = LoginService.instance._chainChangedObservers.filter(observer => observerToRemove !== observer);
    }
}
