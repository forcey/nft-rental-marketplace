import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from "react-toastify";

import { KasuContract } from '../utils/abiManager';
import "react-toastify/dist/ReactToastify.css";

interface Props {
    listingID: number,
    isShown: boolean,
    onShouldClose: (didUnlistNFT: boolean, listingID: number) => void,
    onTransactionConfirmed: () => void,
}

function UnlistingModal(props: Props) {
    const [isUnlistButtonDisabled, setIsUnlistButtonDisabled] = useState(false);
    const [error, setError] = useState(null);

    const didClickUnlistNFTButton = async () => {
        setIsUnlistButtonDisabled(true);
        setError(null);

        const contract = KasuContract();

        contract.unlistNFT(props.listingID)
            .then((tx: any) => {
                props.onShouldClose(true, props.listingID);
                toast.promise(
                    tx.wait(),
                    {
                        pending: 'Unlisting Your NFT...',
                        success: 'NFT Unlisted 👌',
                        error: 'Error Unlisting NFT'
                    }
                ).then(() => {
                    props.onTransactionConfirmed();
                });
            })
            .catch((error: any) => {
                setIsUnlistButtonDisabled(false);
                setError(error.data.message);
            });
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false, props.listingID);
    };

    return (
        <Modal show={props.isShown}>
            <Modal.Dialog style={{width: '100%', marginTop: 0, marginBottom: 0}}>
                <Modal.Header>
                    <Modal.Title>Unlist NFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to unlist this NFT?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickUnlistNFTButton} disabled={isUnlistButtonDisabled}>Unlist</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default UnlistingModal;
