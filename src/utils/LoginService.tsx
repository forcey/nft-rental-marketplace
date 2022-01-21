import { ethers } from "ethers";

declare let window: any;

export type LoginServiceObserver = (connectedWalletAddress: string) => void;

export default class LoginService {
    private static instance: LoginService;
    private _observers: LoginServiceObserver[] = [];
    private _loggedInUserAddress: string | null;

    private constructor() {
        this._loggedInUserAddress = null;
    }

    public static getInstance() {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }
        return LoginService.instance;
    }

    public get loggedInUserAddress() {
        return LoginService.instance._loggedInUserAddress;
    }

    public connectToMetamask() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Prompt user for account connections
        provider.send("eth_requestAccounts", [])
            .then((data) => {
                LoginService.instance._loggedInUserAddress = data[0];
                LoginService.instance._observers.forEach(observer => observer(LoginService.instance._loggedInUserAddress ?? ''));
            },
            (error) => {
                console.log(error);
            });
    }

    public attach(observer: LoginServiceObserver) {
        LoginService.instance._observers.push(observer);
    }

    public detach(observerToRemove: LoginServiceObserver) {
        LoginService.instance._observers = LoginService.instance._observers.filter(observer => observerToRemove !== observer);
    }
}
