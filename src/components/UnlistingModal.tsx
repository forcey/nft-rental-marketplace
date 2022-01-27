import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";

import { KasuContract } from '../utils/abiManager';
import "react-toastify/dist/ReactToastify.css";

interface Props {
    listingID: number,
    isShown: boolean,
    onShouldClose: (didUnlistNFT: boolean, listingID: number) => void
}

function UnlistingModal(props: Props) {
    const [transactionSubmitted, setTransactionSubmitted] = useState(false);

    const didClickUnlistNFTButton = () => {
        const contract = KasuContract();

        const onUnlistNFTCompletion = (async () => {
            try {
                setTransactionSubmitted(true);
                const tx = await contract.unlistNFT(props.listingID);
                await tx.wait();
                props.onShouldClose(true, props.listingID);
            } catch (e: any) {
                setTransactionSubmitted(false);
            }
        })();

        toast.promise(
            onUnlistNFTCompletion,
            {
                pending: 'Unlist NFT is pending',
                success: 'Unlisting Your NFT... 👌',
                error: 'Error Unlisting NFT'
            },
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        );
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false, props.listingID);
    };

    const shouldDisableUnlistButton = transactionSubmitted;

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
                    <Button variant="success" onClick={didClickUnlistNFTButton} disabled={shouldDisableUnlistButton}>Unlist</Button>
                </Modal.Footer>
            </Modal.Dialog>
            <ToastContainer
                position={toast.POSITION.TOP_CENTER}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Modal>
    );
}

export default UnlistingModal;