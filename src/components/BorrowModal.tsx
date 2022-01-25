import { ethers } from 'ethers';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

import ContractAddress from "../abis/contract-address.json";
import KasuContract from "../abis/Kasu.json";
import LoginService from '../utils/LoginService';

interface Props {
    listingId: string,
    isShown: boolean,
    onShouldClose: (didBorrow: boolean) => void,
}

function BorrowModal(props: Props) {
    const [shouldDisableBorrowButton, setShouldDisableBorrowButton] = useState(false);

    const didClickBorrowButton = () => {
        const contract = new ethers.Contract(ContractAddress.Kasu, KasuContract.abi, LoginService.getInstance().signer);

        const paymentAmount = ethers.utils.parseEther("123.4");
        try {
            contract.borrow(
                props.listingId,
                { value: paymentAmount }
            ).then((response: any) => {
                console.log("response", response);
                setShouldDisableBorrowButton(true);
                props.onShouldClose(true);
            });
        } catch (error: any) {
            console.log("error", error.toString());
            return;
        }
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false);
    };

    return (
        <Modal show={props.isShown}>
            <Modal.Dialog style={{ width: '100%', marginTop: 0, marginBottom: 0 }}>
                <Modal.Header>
                    <Modal.Title>List NFT for Lending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Total payment is 123.4 ETH
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickBorrowButton} disabled={shouldDisableBorrowButton}>Borrow</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default BorrowModal;
