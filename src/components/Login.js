import { useRef, useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import web3provider from "../utils/web3provider";

function Login() {
    const didFetchLoginStateRef = useRef(false);
    const [address, setAddress] = useState();
    const [network, setNetwork] = useState();

    useEffect(() => {
        if (didFetchLoginStateRef.current) { return; }
        didFetchLoginStateRef.current = true;

        (async () => {
            if (await web3provider.Enable(false)) {
                setAddress(await web3provider.signer.getAddress());
                setNetwork(await web3provider.signer.getChainId());
            }
        })();
    });

    if (address) {
        const networkMapping = {
            "1": <Badge pill bg="primary">Mainnet</Badge>,
            "4": <Badge pill bg="secondary">Rinkeby</Badge>,
        };
        const networkLabel = networkMapping[network] ?? <Badge pill bg="warning" text="dark">Other/Local: {network}</Badge>;
        return (<div style={{textAlign: "right"}}>Wallet: {address} {networkLabel}</div>);
    } else {
        const connectWallet = async () => {
            await web3provider.Enable(true);
            didFetchLoginStateRef.current = false;
        };
        return (<Button onClick={connectWallet}>Login with Metamask</Button>);
    }
}

export default Login;
