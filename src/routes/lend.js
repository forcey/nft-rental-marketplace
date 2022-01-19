import React from 'react';
import {Alert} from 'react-bootstrap';
import NFTCardGrid from '../components/NFTCardGrid';

class LendPage extends React.Component {
    constructor(props) {
        super(props);
        // TODO: pass in the wallet address from props.
        this.walletAddress = "0x1086A7DC518546bb8615Df03F23A27433a5EeeE5";
        this.state = {
            error: null,
            owned: [],
        }
    }

    componentDidMount() {
        this.getAssetsByOwner(this.walletAddress,
            this.parseResponse.bind(this),
            err => this.setState({
                owned: null,
                error: err
            }))
    }

    getAssetsByOwner(address, handleResponse, handleError) {
        const options = { method: 'GET', headers: { Accept: 'application/json' } };

        // https://docs.opensea.io/reference/getting-assets
        fetch(`https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`, options)
            .then(response => response.json())
            .then(handleResponse)
            .catch(handleError);
    }

    // Translates OpenSea assets response to a list of NFTCard entities.
    parseResponse(response) {
        let owned = response.assets.map(asset => ({
            tokenID: asset.token_id,
            imageURI: asset.image_preview_url,
            actionButtonStyle: 'LIST',
            didClickActionButton: this.sayHello,
        }))
        this.setState({
            owned: owned,
            error: null,
        })
    }

    sayHello() {
        console.log('hello');
    };

    render() {
        if (this.state.error) {
            return (<Alert variant="danger">
                {this.state.error}
            </Alert>)
        }
        const nfts = (this.state.owned ?? []).concat([
            {
                tokenID: '2',
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                actionButtonStyle: 'UNLIST',
                didClickActionButton: this.sayHello,
            },
            {
                tokenID: '3',
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                collateral: 2.33,
                rentalDuration: 2,
                interestRate: 1.4,
                actionButtonStyle: 'TERMINATE_RENTAL',
                didClickActionButton: this.sayHello,
            },
            {
                tokenID: '4',
                imageURI: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                collateral: 2.33,
                rentalDuration: 2,
                interestRate: 1.4,
            }
        ]);
        return <NFTCardGrid data={nfts} />
    }
}

export default LendPage;
