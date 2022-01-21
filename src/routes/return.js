import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';
import LoginService from '../utils/LoginService';

function ReturnPage() {
    const [walletAddress, setWalletAddress] = useState(LoginService.getInstance().loggedInUserAddress);
    const onLogin = (loggedInUserWalletAddress: string) => {
        setWalletAddress(loggedInUserWalletAddress);
    };

    useEffect(() => {
        LoginService.getInstance().attach(onLogin);
        return () => LoginService.getInstance().detach(onLogin);
    }, []);

    if (!walletAddress) {
        return (
            <Container>
                <h4>Connect Your Wallet</h4>
            </Container>
        );
    }

    const nfts = [
        {
            address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
            tokenID: '1',
            contractName: "Chicken Katsu",
            name: "Katsu #1",
            imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            collateral: 2.33,
            rentalDuration: 2,
            interestRate: 1.4,
            actionButtonStyle: 'RETURN',
            didClickActionButton: () => {}
        },
        {
            address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
            tokenID: '2',
            contractName: "Chicken Katsu",
            name: "Katsu #2",
            imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            collateral: 2.33,
            rentalDuration: 2,
            interestRate: 1.4,
            actionButtonStyle: 'RETURN',
            didClickActionButton: () => {}
        },
        {
            address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
            tokenID: '3',
            contractName: "Chicken Katsu",
            name: "Katsu #3",
            imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            collateral: 2.33,
            rentalDuration: 2,
            interestRate: 1.4,
            actionButtonStyle: 'RETURN',
            didClickActionButton: () => {}
        }
    ];
    return <NFTCardGrid data={nfts} />
}

export default ReturnPage;
