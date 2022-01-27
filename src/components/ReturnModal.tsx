import { ethers } from 'ethers';
import { Alert, Modal, Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import { Listing } from "../utils/common";
import { KasuContract } from "../utils/abiManager"
import { ApprovalChecker, ApprovalState } from './ApprovalChecker';
import { ToastContainer, toast } from "react-toastify";
import LoginService from '../utils/LoginService';

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
    let rentalPeriodInSeconds = Date.now() / 1000 - listing.rental.rentedAt.toNumber();
    // Clamp the rentalPeriod to [0, duration] to avoid negative numbers (caused by local network timestamp benig manually set ahead).
    rentalPeriodInSeconds = Math.floor(Math.min(Math.max(rentalPeriodInSeconds, 0), listing.duration * 86400));
    const interestPaid = listing.collateralRequired.mul(listing.dailyInterestRate * rentalPeriodInSeconds).div(86400).div(100);
    const totalInterest = listing.collateralRequired.mul(listing.dailyInterestRate * listing.duration).div(100);

    return {
        collateral: listing.collateralRequired,
        interestPaid: interestPaid,
        interestRefunded: totalInterest.sub(interestPaid),
    };
}

function ReturnModal(props: Props) {
    const [transactionSubmitted, setTransactionSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [approvalState, setApprovalState] = useState(ApprovalState.UNKNOWN);

    const paymentBreakdown = calculatePayment(props.listing);

    const didClickReturnButton = () => {
        setTransactionSubmitted(true);
        setError(null);
        const toastPromise = new Promise<void>(resolve => {
            const contract = KasuContract();
            const filter = { address: contract.address,
                             topics: [ethers.utils.id("Returned(uint256)")] };
            contract.returnNFT(props.listing.id)
                .then((response: any) => {
                    LoginService.getInstance().provider.on(filter, event => {
                        resolve();
                        props.onShouldClose(true);
                    });
                    props.onShouldClose(true);
                }).catch((error: any) => {
                    console.log(error);
                    setTransactionSubmitted(false);
                    setError(error.data.message);
                });
        });
        toast.promise(
            toastPromise,
            {
              pending: 'Returning NFT...',
              success: 'NFT Returned 👌',
              error: 'Error returning NFT'
            },
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: false,
            }
        );
    };

    const onApprovalStateChange = useCallback((state: ApprovalState) => {
        setApprovalState(state);
    }, []);

    const shouldDisableReturnButton = transactionSubmitted || approvalState !== ApprovalState.APPROVED;

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
                    <ApprovalChecker verb="return"
                        tokenID={props.listing.tokenId}
                        tokenAddress={props.listing.tokenAddress}
                        onStateChange={onApprovalStateChange} />
                    {errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickReturnButton} disabled={shouldDisableReturnButton}>Return</Button>
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

export default ReturnModal;
