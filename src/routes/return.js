import { ethers } from 'ethers';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Container } from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';
import LoginService from '../utils/LoginService';
import { KasuContract } from '../utils/abiManager';
import { FetchMetadata } from "../utils/opensea";
import ReturnModal from '../components/ReturnModal';

function mapKey(token) {
    // Normalize the address for case-sensitive map lookup.
    return `${ethers.utils.getAddress(token.address)}/${token.tokenID}`;
}

function ReturnPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(LoginService.getInstance().isLoggedIn);
    const [rentedNFTs, setRentedNFTs] = useState([]);
    const [returnModalState, setReturnModalState] = useState({ isShown: false });
    const returnNFT = useCallback((listing) => {
        setReturnModalState({ isShown: true, listing: listing });
    }, [setReturnModalState]);

    const renderFakeNFTs = useCallback(fetchedNFTsWithoutMetadata => {
        const fakeNFTs = fetchedNFTsWithoutMetadata.map(listing => {
            return {
                name: `Katsu #${listing.tokenId.toString()}`,
                contractName: "Chicken Katsu",
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                address: listing.tokenAddress,
                tokenID: listing.tokenId,
                listingID: listing.id,
                collateral: ethers.utils.formatEther(listing.collateralRequired),
                rentalDuration: listing.duration,
                interestRate: listing.dailyInterestRate,
                actionButtonStyle: 'RETURN',
                didClickActionButton: () => returnNFT(listing),
            };
        });
        setRentedNFTs(fakeNFTs);
    }, [setRentedNFTs, returnNFT]);

    const fetchRentedNFTs = useCallback(async () => {
        const contract = KasuContract();
        const fetchedRentedNFTsWithoutMetadata = await contract.viewRentedListings();
        const partialMetadata = fetchedRentedNFTsWithoutMetadata.map(listing => ({
            address: listing.tokenAddress,
            tokenID: listing.tokenId.toString(),
        }));
        // Can't fetch metadata on local network.
        if (LoginService.getInstance().chainName === "Unknown") {
            renderFakeNFTs(fetchedRentedNFTsWithoutMetadata);
            return;
        }
        FetchMetadata(partialMetadata)
            .then(response => {
                const kvPairs = response.map(metadata => [mapKey(metadata), metadata]);
                const metadata = new Map(kvPairs);
                const rentedNFTsWithMetadata = fetchedRentedNFTsWithoutMetadata.map(listing => {
                    const card = {
                        address: listing.tokenAddress,
                        tokenID: listing.tokenId,
                        listingID: listing.id,
                        collateral: ethers.utils.formatEther(listing.collateralRequired),
                        rentalDuration: listing.duration,
                        interestRate: listing.dailyInterestRate,
                        actionButtonStyle: 'RETURN',
                        didClickActionButton: () => returnNFT(listing),
                    };
                    const tokenMetadata = metadata.get(mapKey(card));
                    if (tokenMetadata) {
                        card.name = tokenMetadata.name;
                        card.contractName = tokenMetadata.contractName;
                        card.imageURI = tokenMetadata.imageURI;
                    }
                    return card;
                });
                setRentedNFTs(rentedNFTsWithMetadata);
            })
            .catch(error => console.log(error));
    }, [returnNFT, setRentedNFTs, renderFakeNFTs]);

    const onLogin = useCallback(() => {
        setIsLoggedIn(true);
        fetchRentedNFTs();
    }, [setIsLoggedIn, fetchRentedNFTs]);

    useEffect(() => {
        LoginService.getInstance().onLogin(onLogin);
        LoginService.getInstance().onChainChanged(fetchRentedNFTs);
        LoginService.getInstance().onAccountsChanged(fetchRentedNFTs);
        return () => {
            LoginService.getInstance().detachLoginObserver(onLogin);
            LoginService.getInstance().detachChainChangedObserver(fetchRentedNFTs);
            LoginService.getInstance().detachAccountsChangedObserver(fetchRentedNFTs);
        }
    }, [onLogin, fetchRentedNFTs]);

    // One-time Effects
    const didRunOneTimeEffectRef = useRef(false);
    useEffect(() => {
        if (didRunOneTimeEffectRef.current) { return; }
        didRunOneTimeEffectRef.current = true;
        LoginService.getInstance().maybeLogin()
            .then(didLoginSuccessfully => {
                setIsLoggedIn(didLoginSuccessfully);
                if (!didLoginSuccessfully) { return; }
                fetchRentedNFTs();
            });
    }, [fetchRentedNFTs]);

    const closeReturnModal = useCallback((didReturn) => {
        setReturnModalState({ isShown: false });
        if (didReturn) {
            fetchRentedNFTs();
        }
    }, [setReturnModalState, fetchRentedNFTs]);

    if (!isLoggedIn) {
        return (<Alert variant="warning">Connect Your Wallet</Alert>);
    }

    return (<Container>
        <NFTCardGrid data={rentedNFTs} />
        {returnModalState.isShown &&
            <ReturnModal
                isShown={returnModalState.isShown}
                listing={returnModalState.listing}
                onShouldClose={closeReturnModal} />}
    </Container>);
}

export default ReturnPage;
