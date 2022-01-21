import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';
import CreateListingModal from '../components/CreateListingModal';

function LendPage() {
    const [nftsInUserWallet, setNFTsInUserWallet] = useState([]);
    const [nftsListedForLending, setNFTsListedForLending] = useState([]);
    const [nftsLentOut, setNFTsLentOut] = useState([]);
    const [error, setError] = useState();
    const [shouldShowCreateListingModal, setShouldShowCreateListingModal] = useState(false);

    const listNFT = (tokenID, tokenAddress) => {
        setShouldShowCreateListingModal(true);
        // TODO: Implement modal
    };
    const parseOpenSeaResponse = (response) => {
        const fetchedNFTs = response.assets.map(asset => ({
            address: asset.asset_contract.address,
            tokenID: asset.token_id,
            name: asset.name,
            contractName: asset.asset_contract.name,
            imageURI: asset.image_preview_url,
            actionButtonStyle: 'LIST',
            didClickActionButton: listNFT,
        }));
        setNFTsInUserWallet(nftsInUserWallet.concat(fetchedNFTs));
    };

    // Fetch all available NFTs in wallet
    useEffect(() => {
        const options = { method: 'GET', headers: { Accept: 'application/json' } };
        // TODO: pass in the wallet address from props.
        const walletAddress = "0x1086A7DC518546bb8615Df03F23A27433a5EeeE5";
        // https://docs.opensea.io/reference/getting-assets
        fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}&order_direction=desc&offset=0&limit=20`, options)
            .then(response => {
                if (response.ok) {
                    response.json().then(parseOpenSeaResponse);
                } else {
                    setError(Error(`Error ${response.status} while calling OpenSea API`))
                }
            })
            .catch((error) => {
                setError(error);
            });
    }, []);

    const unlistNFT = (tokenID, tokenAddress) => {
        // TODO: Implement unlist smart contract integration logic
    };
    // Fetch listed NFTs
    useEffect(() => {
        // TODO: Implement listed NFTs logic
        setNFTsListedForLending([{
                address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
                tokenID: '2',
                contractName: "Chicken Katsu",
                name: "Katsu #2",
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                actionButtonStyle: 'UNLIST',
                didClickActionButton: unlistNFT,
            }]);
    }, []);

    const terminateRental = (tokenID, tokenAddress) => {
        // TODO: Implement terminate rental smart contract integration logic
    };
    // Fetch lent out NFTs
    useEffect(() => {
        // TODO: Implement lent out NFTs logic
        setNFTsLentOut([{
                address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
                tokenID: '3',
                contractName: "Chicken Katsu",
                name: "Katsu #3",
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                collateral: 2.33,
                rentalDuration: 2,
                interestRate: 1.4,
                actionButtonStyle: 'TERMINATE_RENTAL',
                didClickActionButton: terminateRental,
            },
            {
                address: '0x280956156bfbb02959adcac28e50af9ed49c1f21',
                tokenID: '4',
                contractName: "Chicken Katsu",
                name: "Katsu #4",
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                collateral: 2.33,
                rentalDuration: 2,
                interestRate: 1.4,
            }]);
    }, []);

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
        </Container>
    )
}

export default LendPage;
