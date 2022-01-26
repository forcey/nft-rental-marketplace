import { ethers } from 'ethers';
import { Alert, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Listing } from "../utils/common";
import { KasuContract } from "../utils/abiManager"

interface Props {
    listing: Listing,
    isShown: boolean,
    onShouldClose: (didReturn: boolean) => void,
}

type paymentBreakdown = {
    collateral: ethers.BigNumber,
    interestPaid: ethers.BigNumber,
    interestRefunded: ethers.BigNumber,
}

function calculatePayment(listing: Listing): paymentBreakdown {
    console.log(Date.now() / 1000);
    console.log(listing.rental.rentedAt.toNumber());
    const rentalPeriodInSeconds = Date.now() / 1000 - listing.rental.rentedAt.toNumber();
    // Clamp the rentalPeriod to [0, duration] to avoid negative numbers (caused by local network timestamp benig manually set ahead).
    const rentalPeriodInDays = Math.min(Math.max(rentalPeriodInSeconds / 86400, 0), listing.duration);
    const interestPaid = listing.collateralRequired.mul(listing.dailyInterestRate * rentalPeriodInDays).div(100);
    const totalInterest = listing.collateralRequired.mul(listing.dailyInterestRate * listing.duration).div(100);

    return {
        collateral: listing.collateralRequired,
        interestPaid: interestPaid,
        interestRefunded: totalInterest.sub(interestPaid),
    };
}

function ReturnModal(props: Props) {
    const [shouldDisableReturnButton, setShouldDisableReturnButton] = useState(false);
    const [error, setError] = useState(null);

    const paymentBreakdown = calculatePayment(props.listing);

    const didClickReturnButton = () => {
        const contract = KasuContract();
        setShouldDisableReturnButton(true);
        setError(null);

        contract.returnNFT(props.listing.id)
            .then((response: any) => {
                console.log("response", response);
                // ... close the dialog and wait for transaction to be mined into a block ...
                props.onShouldClose(true);
            }).catch((error: any) => {
                console.log(error);
                setShouldDisableReturnButton(false);
                setError(error.data.message);
            });
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false);
    };

    let errorMessage;
    if (error) {
        errorMessage = (<Alert variant="danger">{error}</Alert>);
    }
    return (
        <Modal show={props.isShown}>
            <Modal.Dialog style={{ width: '100%', marginTop: 0, marginBottom: 0 }}>
                <Modal.Header>
                    <Modal.Title>Return NFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You will be refunded {ethers.utils.formatEther(paymentBreakdown.collateral)} ETH of collateral.</p>
                    <p>The lender will be paid {ethers.utils.formatEther(paymentBreakdown.interestPaid)} ETH of interest.</p>
                    <p>You will be refunded {ethers.utils.formatEther(paymentBreakdown.interestRefunded)} ETH for the interest for the remaining period.</p>
                    {errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickReturnButton} disabled={shouldDisableReturnButton}>Return</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default ReturnModal;
