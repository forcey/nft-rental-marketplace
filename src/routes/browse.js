import { useState, useEffect, useCallback } from 'react';
import { Container, Alert } from 'react-bootstrap';
import LoginService from '../utils/LoginService';
import NFTCardGrid from '../components/NFTCardGrid';
import { ethers } from "ethers";
import { RentalStatus } from "../abis/constants";
import { ABIManager } from "../utils/abiManager"

function BrowsePage() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState();
    const fetchListings = useCallback(() => {
        (async () => {
            const abiManager = new ABIManager(LoginService.getInstance().chainId);
            const contract = new ethers.Contract(abiManager.ContractAddress.Kasu, abiManager.KasuContract.abi, LoginService.getInstance().signer);
            let fetchedListings = [];
            try {
                fetchedListings = await contract.viewAllListings();
            } catch (e) {
                setError(e.toString());
                return;
            }
            const availableListings = [];
            for (const listing of fetchedListings) {
                if (listing.rentalStatus !== RentalStatus.Available) {
                    continue;
                }
                const tokenId = listing.tokenId.toString();
                availableListings.push({
                    address: listing.tokenAddress,
                    tokenID: tokenId,
                    // TODO: load metadata from opensea (or contract itself)
                    name: `Katsu #${tokenId}`,
                    contractName: "Chicken Katsu",
                    imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                    collateral: listing.collateralRequired.toString(),
                    rentalDuration: listing.duration,
                    interestRate: listing.dailyInterestRate,
                    actionButtonStyle: 'BORROW',
                    didClickActionButton: () => {},
                });
            }
            setListings(listings.concat(availableListings));
        })();
    }, [setListings, listings]);

    // Listen to login service events. This will get run multiple times and can't be only run one-time.
    useEffect(() => {
        LoginService.getInstance().onLogin(fetchListings);
        LoginService.getInstance().onChainChanged(fetchListings);
        return () => {
            LoginService.getInstance().detachLoginObserver(fetchListings)
            LoginService.getInstance().detachChainChangedObserver(fetchListings);
        };
    }, [fetchListings]);

    if (!LoginService.getInstance().provider) {
        return (
            <Container>
                <h4>Connect Your Wallet</h4>
            </Container>
        );
    }

    if (error) {
        return (<Alert variant="danger">{error}</Alert>);
    }

    return <NFTCardGrid data={listings} />
}

export default BrowsePage;
