import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';
import { ERC721Contract, KasuContract } from '../utils/abiManager';
import LoginService from '../utils/LoginService';

export enum ApprovalState {
    UNKNOWN,
    NOT_APPROVED,
    PENDING,
    APPROVED,
    ERROR
}

interface Props {
    verb: string, // "list" or "return"
    tokenAddress: string,
    tokenID: ethers.BigNumber,
    onStateChange: (state: ApprovalState) => void,
}

export function ApprovalChecker(props: Props) {
    const [approvalState, setApprovalState] = useState(ApprovalState.UNKNOWN);
    const [error, setError] = useState("");

    useEffect(() => {
        // Load the initial approval state.
        const tokenContract = ERC721Contract(props.tokenAddress);
        const kasuContract = KasuContract();

        (async () => {
            try {
                const walletAddress = LoginService.getInstance().walletAddress;
                const approved = (await tokenContract.getApproved(props.tokenID) === kasuContract.address ||
                    await tokenContract.isApprovedForAll(walletAddress, kasuContract.address));
                setApprovalState(approved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED);
            } catch (e: any) {
                setApprovalState(ApprovalState.ERROR);
                setError(e.toString());
            }
        })();
    });

    const didClickApproveButton = useCallback(() => {
        // Send the approve transaction.
    }, []);

    const messageMap = new Map<ApprovalState, string|JSX.Element>([
        [ApprovalState.UNKNOWN, "Checking approval status..."],
        [ApprovalState.NOT_APPROVED, `In order to ${props.verb} the NFT, Kasu must be approved to manage the item on your behalf.`],
        [ApprovalState.PENDING, "Waiting for approval to be completed..."],
        [ApprovalState.APPROVED, `Item is approved and ready to be ${props.verb}ed.`],
        [ApprovalState.ERROR, <Alert variant="danger">{error}</Alert>],
    ]);

    const spinnerButton = (<Button variant="primary" disabled>
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
        />
        <span className="visually-hidden">Loading...</span>
    </Button>);

    const buttonMap = new Map<ApprovalState, JSX.Element | null>([
        [ApprovalState.UNKNOWN, spinnerButton],
        [ApprovalState.NOT_APPROVED, <Button onClick={didClickApproveButton}>Approve</Button>],
        [ApprovalState.PENDING, spinnerButton],
        [ApprovalState.APPROVED, null],
        [ApprovalState.ERROR, null],
    ]);

    const message = messageMap.get(approvalState);
    const button = buttonMap.get(approvalState);

    return (
        <Card>
            <Card.Header>Pre-requisite</Card.Header>
            <Card.Body>
                <Card.Text>
                    {message}
                </Card.Text>
                {button}
            </Card.Body>
        </Card>);
}
