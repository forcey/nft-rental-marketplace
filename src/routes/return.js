import { ethers } from 'ethers';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';
import LoginService from '../utils/LoginService';
import {KasuContract, ERC721Contract} from '../utils/abiManager';

function ReturnPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(LoginService.getInstance().isLoggedIn);
    const [rentedNFTs, setRentedNFTs] = useState([]);
    const returnNFT = async function(listing){
        const tokenContract = ERC721Contract(listing.tokenAddress);
        await tokenContract.approve(listing.lenderAddress, listing.tokenId)
        .then(() =>{
                const contract = KasuContract()
                contract.returnNFT(listing.id)
            })
    }
    const fetchRentedNFTs = useCallback( async() => {
        // TODO: Implement fetching returnable NFTs
        const loginService = LoginService.getInstance();
        async function getListings(){
            const contract = KasuContract();
            const listings = await contract.viewRentedListings(loginService.walletAddress);
            const filtered_listings = listings.filter(
                // Some listings in the array will be the default "empty" listings
                listing => listing.tokenAddress !== ethers.constants.AddressZero
                );
            return filtered_listings;
        }
        const listings = await getListings()
        setRentedNFTs(listings.map(listing => {
            const card = {
                address: listing.tokenAddress,
                tokenID: listing.tokenId.toString(),
                listingID: listing.id,
                name: listing.name,
                contractName: listing.contractName,                
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                collateral: ethers.utils.formatEther(listing.collateralRequired),
                rentalDuration: listing.duration,
                interestRate: listing.dailyInterestRate,
                actionButtonStyle: 'RETURN',
                //actionButtonDisabled: ethers.utils.getAddress(listing.lenderAddress) === walletAddress,
                didClickActionButton: () => returnNFT(listing),
            }
            return card;
        }));
    }, [setRentedNFTs]);

    const onLogin = useCallback(() => {
        setIsLoggedIn(true);
        fetchRentedNFTs();
    }, [setIsLoggedIn, fetchRentedNFTs]);

    useEffect(() => {
        LoginService.getInstance().onLogin(onLogin);
        return () => LoginService.getInstance().detachLoginObserver(onLogin);
    }, [onLogin]);

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

    if (!isLoggedIn) {
        return (<Alert variant="warning">Connect Your Wallet</Alert>);
    }

    return <NFTCardGrid data={rentedNFTs} />
}

export default ReturnPage;
