import { ethers } from 'ethers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Container } from 'react-bootstrap';
import LoginService from '../utils/LoginService';
import NFTCardGrid from '../components/NFTCardGrid';
import { isRentalAvailable } from "../utils/common";
import { KasuContract } from "../utils/abiManager"
import BorrowModal from '../components/BorrowModal';

function BrowsePage() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState();
    const [borrowModalState, setBorrowModalState] = useState({ isShown: false });
    const [isLoggedIn, setIsLoggedIn] = useState(LoginService.getInstance().isLoggedIn);
    const borrowNFT = useCallback((listing) => {
        setBorrowModalState({ isShown: true, listing: listing });
    }, [setBorrowModalState]);

    const fetchListings = useCallback(() => {
        (async () => {
            const contract = KasuContract();
            let fetchedListings = [];
            try {
                fetchedListings = await contract.viewAllListings();
            } catch (e) {
                setError(e.toString());
                return;
            }
            setError(null);
            const availableListings = [];
            for (const listing of fetchedListings) {
                if (!isRentalAvailable(listing)) {
                    continue;
                }
                const tokenId = listing.tokenId.toString();
                availableListings.push({
                    address: listing.tokenAddress,
                    tokenID: tokenId,
                    listingID: listing.id,
                    // TODO: load metadata from opensea (or contract itself)
                    name: `Katsu #${tokenId}`,
                    contractName: "Chicken Katsu",
                    imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                    collateral: ethers.utils.formatEther(listing.collateralRequired),
                    rentalDuration: listing.duration,
                    interestRate: listing.dailyInterestRate,
                    actionButtonStyle: 'BORROW',
                    // Normalize all addresses to checksummed addresses for comparison.
                    actionButtonDisabled: ethers.utils.getAddress(listing.lenderAddress) === ethers.utils.getAddress(LoginService.getInstance().walletAddress),
                    didClickActionButton: () => borrowNFT(listing),
                });
            }
            setListings(availableListings);
        })();
    }, [setListings, borrowNFT]);

    // Listen to login service events. This will get run multiple times and can't be only run one-time.
    useEffect(() => {
        LoginService.getInstance().onLogin(fetchListings);
        LoginService.getInstance().onAccountsChanged(fetchListings);    // TODO: actually only need to refresh button status.
        LoginService.getInstance().onChainChanged(fetchListings);
        return () => {
            LoginService.getInstance().detachLoginObserver(fetchListings);
            LoginService.getInstance().detachAccountsChangedObserver(fetchListings);
            LoginService.getInstance().detachChainChangedObserver(fetchListings);
        };
    }, [fetchListings]);

    // One-time Effects
    const didRunOneTimeEffectRef = useRef(false);
    useEffect(() => {
        if (didRunOneTimeEffectRef.current) { return; }
        didRunOneTimeEffectRef.current = true;
        LoginService.getInstance().maybeLogin()
            .then(didLoginSuccessfully => {
                setIsLoggedIn(didLoginSuccessfully);
                if (!didLoginSuccessfully) { return; }
                fetchListings();
            });
    });

    const closeBorrowModal = useCallback((didBorrow) => {
        setBorrowModalState({ isShown: false });
        if (didBorrow) {
            fetchListings();
        }
    }, [setBorrowModalState, fetchListings]);

    if (!isLoggedIn) {
        return (<Alert variant="warning">Connect Your Wallet</Alert>);
    }

    if (error) {
        return (<Alert variant="danger">{error}</Alert>);
    }

    if (listings.length) {
        return (<Container>
            <NFTCardGrid data={listings} />
            {borrowModalState.isShown &&
                <BorrowModal
                    isShown={borrowModalState.isShown}
                    listing={borrowModalState.listing}
                    onShouldClose={closeBorrowModal} />}
        </Container>)
    } else {
        return (<Alert variant="primary">No listings available</Alert>);
    }
}

export default BrowsePage;
