
import { Button, Navbar } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import LoginService from '../utils/LoginService';

declare let window: any;

function Login() {
    const [walletAddress, setWalletAddress] = useState(LoginService.getInstance().loggedInUserAddress);
    const onLogin = (loggedInUserWalletAddress: string) => {
        setWalletAddress(loggedInUserWalletAddress);
    };

    useEffect(() => {
        LoginService.getInstance().attach(onLogin);
        return () => LoginService.getInstance().detach(onLogin);
    }, []);

    if (LoginService.getInstance()?.loggedInUserAddress != null) {
        return (
            <Navbar.Text>
                Wallet: {walletAddress}
            </Navbar.Text>
        );
    }

    return (<Button variant="primary" onClick={LoginService.getInstance().connectToMetamask}>Connect Wallet</Button>);
}

export default Login;
