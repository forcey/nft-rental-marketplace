
import { Button, Navbar } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import LoginService from '../utils/LoginService';
import { ethers } from 'ethers';

function Login() {
    const [walletAddress, setWalletAddress] = useState(LoginService.getInstance().walletAddress);
    const changeWalletAddress = (provider: ethers.providers.Web3Provider, signer: ethers.Signer, walletAddress: string) => {
        setWalletAddress(walletAddress);
    };

    useEffect(() => {
        LoginService.getInstance().onLogin(changeWalletAddress);
        return () => LoginService.getInstance().detachLoginObserver(changeWalletAddress);
    }, []);

    if (LoginService.getInstance()?.walletAddress != null) {
        return (
            <Navbar.Text>
                Wallet: {walletAddress}
            </Navbar.Text>
        );
    }

    return (<Button variant="primary" onClick={LoginService.getInstance().linkAccount}>Connect Wallet</Button>);
}

export default Login;
