import { ethers } from 'ethers';
import { Alert, Modal, Button, Table } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import { Listing } from "../utils/common";
import { KasuContract } from "../utils/abiManager"
import { ApprovalChecker, ApprovalState } from './ApprovalChecker';
import { toast } from "react-toastify";;

interface Props {
    listing: Listing,
    isShown: boolean,
    onShouldClose: (didReturn: boolean) => void,
    onTransactionConfirmed: () => void,
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

        const contract = KasuContract();
        contract.returnNFT(props.listing.id)
            .then((tx: any) => {
                // ... close the dialog and wait for transaction to be mined into a block ...
                props.onShouldClose(true);
                toast.promise(
                    tx.wait(),
                    {
                        pending: 'Returning NFT...',
                        success: 'NFT Returned 👌',
                        error: 'Error returning NFT'
                    },
                ).then(() => props.onTransactionConfirmed());
            }).catch((error: any) => {
                console.log(error);
                setTransactionSubmitted(false);
                setError(error.data.message);
            });
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
                    <Table bordered>
                    <tbody>
                            <tr>
                                <td colSpan={2} className="bg-light"><b>Refunded to you</b></td>
                            </tr>
                            <tr>
                                <td>Collateral</td>
                                <td>{ethers.utils.formatEther(paymentBreakdown.collateral)} ETH</td>
                            </tr>
                            <tr>
                                <td>Unused interest</td>
                                <td>{ethers.utils.formatEther(paymentBreakdown.interestRefunded)} ETH</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="bg-light"><b>Paid to lender</b></td>
                            </tr>
                            <tr>
                                <td>Interest</td>
                                <td>{ethers.utils.formatEther(paymentBreakdown.interestPaid)} ETH</td>
                            </tr>
                        </tbody>
                    </Table>
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
        </Modal>
    );
}

export default ReturnModal;
