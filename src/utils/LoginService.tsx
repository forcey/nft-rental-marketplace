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
    private _provider: ethers.providers.Web3Provider;
    private _signer: ethers.Signer;
    private _walletAddress: string | null;
    private _chainId: number | null;

    private constructor() {
        this._provider = new ethers.providers.Web3Provider(window.ethereum);
        this._signer = this._provider.getSigner();
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

    public get chainName(): string {
        const chainMapping: {[key: number]: string} = {
            1: "Mainnet",
            4: "Rinkeby",
        };
        const chainId = LoginService.instance._chainId ?? -1;
        if (!(chainId in chainMapping)) { return "Unknown" }
        return chainMapping[chainId];
    }

    public get isLoggedIn() {
        return LoginService.instance._provider !== null && LoginService.instance._walletAddress !== null;
    }

    public linkAccount() {
        // Prompt user for account connections
        LoginService.instance._provider.send("eth_requestAccounts", [])
            .then((data) => {
                (async () => {
                    LoginService.instance.attachObservers();
                    const chainId = await LoginService.instance._signer.getChainId();
                    LoginService.instance._chainId = chainId;
                    LoginService.instance._walletAddress = data[0];
                    LoginService.instance._loginObservers.forEach(observer => observer(LoginService.instance._provider, LoginService.instance._provider.getSigner(), data[0], chainId));
                })();
            },
            (error) => {
                console.log(error);
            });
    }

    // Attempts to connect without using the metamask prompt
    public async maybeLogin(): Promise<boolean> {
        const listAccountPromise = LoginService.instance.provider.listAccounts();
        const getChainIDPromise = LoginService.instance._signer.getChainId();
        const didLoginSuccessfullyPromise: Promise<boolean> = new Promise((resolve, reject) => {
            Promise.all([listAccountPromise, getChainIDPromise]).then(values => {
                const returnedAccounts = values[0]
                const primaryWalletAddress = returnedAccounts[0];
                const returnedChainID = values[1];
                LoginService.getInstance()._walletAddress = primaryWalletAddress;
                LoginService.getInstance()._chainId = returnedChainID;
                if (returnedAccounts.length > 0) {
                    LoginService.instance.attachObservers();
                }
                resolve(returnedAccounts.length > 0);
            });
        });
        return didLoginSuccessfullyPromise;
    }

    private attachObservers() {
        window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
            LoginService.instance._walletAddress = accounts[0];
            LoginService.instance._accountChangedObservers.forEach(observer => observer(accounts));
        });
        window.ethereum.on('chainChanged', (chainId: any) => {
            LoginService.instance._chainId = Number(chainId);
            LoginService.instance._chainChangedObservers.forEach(observer => observer(Number(chainId)));
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
