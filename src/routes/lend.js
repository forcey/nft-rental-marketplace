import { ethers } from 'ethers';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Container } from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';
import CreateListingModal from '../components/CreateListingModal';
import LoginService from '../utils/LoginService';
import { isRentalAvailable } from "../utils/common";
import { FakeNFTContract, KasuContract } from '../utils/abiManager';
import { FetchOwnedNFTs } from "../utils/opensea";

function LendPage() {
    const [nftsInUserWallet, setNFTsInUserWallet] = useState([]);
    const [nftsListedForLending, setNFTsListedForLending] = useState([]);
    const nftsTerminatedRentalsRef = useRef(new Set());
    const nftsListedForLendingRef = useRef(new Set());
    const [nftsLentOut, setNFTsLentOut] = useState([]);
    const [error, setError] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(LoginService.getInstance().isLoggedIn);
    const [listingModalState, setListingModalState] = useState({ isShown: false, tokenID: '', tokenAddress: ''});
    const listNFT = useCallback((tokenID, tokenAddress) => {
        setListingModalState({ isShown: true, tokenID: tokenID, tokenAddress: tokenAddress });
    }, [setListingModalState]);

    const loadOpensea = useCallback(() => {
        const parseOpenSeaResponse = (response) => {
            const fetchedNFTs = response.map(metadata => ({
                address: metadata.address,
                tokenID: metadata.tokenID,
                name: metadata.name,
                contractName: metadata.contractName,
                imageURI: metadata.imageURI,
                actionButtonStyle: 'LIST',
                didClickActionButton: listNFT,
            }));
            setNFTsInUserWallet(fetchedNFTs);
        };
        FetchOwnedNFTs(LoginService.getInstance().walletAddress)
            .then(parseOpenSeaResponse)
            .catch((error) => {
                setError(error);
            });
    }, [setNFTsInUserWallet, setError, listNFT]);

    const loadFakeNFT = useCallback(async () => {
        const signer = LoginService.getInstance().signer
        const contract = FakeNFTContract();
        const walletAddress = await signer.getAddress();
        const balance = await contract.balanceOf(walletAddress);
        var fetchedNFTs = [];
        for (var i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
            fetchedNFTs.push({
                address: contract.address,
                tokenID: tokenId,
                name: `Katsu #${tokenId}`,
                contractName: "Chicken Katsu",
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                actionButtonStyle: 'LIST',
                didClickActionButton: listNFT,
            });
        }
        setNFTsInUserWallet(fetchedNFTs);
    }, [setNFTsInUserWallet, listNFT]);

    const loadOwnedNFTsBasedOnChainId = useCallback((chainId) => {
        if (chainId === 1 || chainId === 4) {
            // Ethereum mainnet or rinkeby
            loadOpensea();
        } else {
            // Unknown, maybe local network?
            // Try to load fake NFTs
            loadFakeNFT();
        }
    }, [loadOpensea, loadFakeNFT]);

    const fetchAvailableListings = useCallback(() => {
        const contract = KasuContract();
        const filter = { address: contract.address,
                         topics: [ethers.utils.id("ListNFT(uint256)")] };

        LoginService.getInstance().provider.on(filter, event => {
            const tokenID = Number(event.data);
            nftsListedForLendingRef.current.add(tokenID);
            setNFTsInUserWallet(nfts => {
                return nfts.filter(obj => !nftsListedForLendingRef.current.has(obj.tokenID.toNumber()));
              });
        });

    }, [setNFTsInUserWallet]);

    // eslint-disable-next-line
    const unlistNFT = useCallback((listingID) => {
        // TODO: Implement unlist smart contract integration logic
    }, []);

    const terminateRental = useCallback((listingID) => {
        const contract = KasuContract();
        contract.terminateRental(listingID)
          .then(() => {
                nftsTerminatedRentalsRef.current.add(listingID.toNumber());
              setNFTsLentOut(nfts => {
                    return nfts.filter(obj => !nftsTerminatedRentalsRef.current.has(obj.listingID.toNumber()));
              });
          });
    }, [setNFTsLentOut]);

    const fetchOwnedOngoingListingsAndRentals = useCallback(() => {
        const contract = KasuContract();
        contract.viewOwnedOngoingListingsAndRentals()
          .then((fetchedListingsAndRentals) => {
            const ongoingListings = fetchedListingsAndRentals
                                .filter(obj => isRentalAvailable(obj))
                                .map(obj => {
                                    return {
                                        address: obj.tokenAddress,
                                        tokenID: obj.tokenId,
                                        listingID: obj.id,
                                        collateral: ethers.utils.formatEther(obj.collateralRequired),
                                        rentalDuration: obj.duration,
                                        interestRate: obj.dailyInterestRate,
                                        actionButtonStyle: 'UNLIST',
                                        // TODO: Need to get image URI from OpenSea
                                        imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                                    };
                                });
            const ongoingRentals = fetchedListingsAndRentals
                                    .filter(obj => !isRentalAvailable(obj))
                                    .map(obj => {
                                        const dateOptions = { hour: "numeric", minute: "numeric" };
                                        const rentalDueDate = new Date((obj.rental.rentedAt
                                                                            .add(obj.duration * 86400)
                                                                            .mul(1000))
                                                                        .toNumber())
                                                                    .toLocaleDateString("en-US", dateOptions);
                                        const rentedAtDate = new Date((obj.rental.rentedAt
                                                                            .mul(1000))
                                                                        .toNumber())
                                                                    .toLocaleDateString("en-US", dateOptions);
                                        const isTerminatable = ethers.BigNumber.from(Date.now()).div(1000)
                                                                .gte(obj.rental.rentedAt.add(obj.duration * 86400));
                                        return {
                                            address: obj.tokenAddress,
                                            tokenID: obj.tokenId,
                                            listingID: obj.id,
                                            collateral: ethers.utils.formatEther(obj.collateralRequired),
                                            rentalDuration: obj.duration,
                                            interestRate: obj.dailyInterestRate,
                                            actionButtonStyle: isTerminatable ? 'TERMINATE_RENTAL' : null,
                                            didClickActionButton: isTerminatable ? terminateRental : null,
                                            rentalDueDate: rentalDueDate,
                                            rentedAtDate: rentedAtDate,
                                            // TODO: Need to get image URI from OpenSea
                                            imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                                        };
                                    });
            setNFTsListedForLending(ongoingListings);
            setNFTsLentOut(ongoingRentals);
        });
    }, [setNFTsListedForLending, setNFTsLentOut, terminateRental]);

    const loadOwnedNFTs = useCallback(() => {
        loadOwnedNFTsBasedOnChainId(LoginService.getInstance().chainId);
        fetchOwnedOngoingListingsAndRentals();
    }, [loadOwnedNFTsBasedOnChainId, fetchOwnedOngoingListingsAndRentals]);

    // One-time Effects
    const didRunOneTimeEffectRef = useRef(false);
    useEffect(() => {
        if (didRunOneTimeEffectRef.current) { return; }
        didRunOneTimeEffectRef.current = true;
        LoginService.getInstance().maybeLogin()
            .then(didLoginSuccessfully => {
                setIsLoggedIn(didLoginSuccessfully);
                if (!didLoginSuccessfully) { return; }
                loadOwnedNFTs();
            });
    }, [loadOwnedNFTs]);

    const onLogin = useCallback(() => {
        setIsLoggedIn(true);
        loadOwnedNFTs();
    }, [setIsLoggedIn, loadOwnedNFTs]);
    // Listen to login service events. This will get run multiple times and can't be only run one-time.
    useEffect(() => {
        LoginService.getInstance().onLogin(onLogin);
        LoginService.getInstance().onChainChanged(loadOwnedNFTs);
        LoginService.getInstance().onAccountsChanged(loadOwnedNFTs);
        return () => {
            LoginService.getInstance().detachLoginObserver(onLogin);
            LoginService.getInstance().detachChainChangedObserver(loadOwnedNFTs);
            LoginService.getInstance().detachAccountsChangedObserver(loadOwnedNFTs);
        };
    }, [loadOwnedNFTs, onLogin]);

    const closeListingModal = useCallback((didListNFT) => {
        setListingModalState({ isShown: false, tokenID: '', tokenAddress: '' });
        if (didListNFT) {
            fetchAvailableListings();
            fetchOwnedOngoingListingsAndRentals();
        }
    }, [setListingModalState, fetchOwnedOngoingListingsAndRentals, fetchAvailableListings]);

    if (!isLoggedIn) {
        return (<Alert variant="warning">Connect Your Wallet</Alert>);
    }

    if (error) {
        return (<Alert variant="danger">{error}</Alert>);
    }

    return (
        <Container>
            <h4>Available</h4>
            <NFTCardGrid data={nftsInUserWallet} />
            <h4>Listed for Lending</h4>
            <NFTCardGrid data={nftsListedForLending} />
            <h4>Lent Out</h4>
            <NFTCardGrid data={nftsLentOut} />
            {listingModalState.isShown &&
                <CreateListingModal
                    isShown={listingModalState.isShown}
                    tokenID={listingModalState.tokenID}
                    tokenAddress={listingModalState.tokenAddress}
                    onShouldClose={closeListingModal} />}
        </Container>
    )
}

export default LendPage;
