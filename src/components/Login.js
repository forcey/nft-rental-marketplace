import { Button } from "react-bootstrap";
import web3provider from "../utils/web3provider";

function Login() {
    const connectWallet = () => web3provider.Enable(true);

    return (<Button onClick={connectWallet}>Login with Metamask</Button>);
}

export default Login;
