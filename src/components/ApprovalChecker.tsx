import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

export enum ApprovalState {
    UNKNOWN,
    NOT_APPROVED,
    PENDING,
    APPROVED
}

interface Props {
    verb: string, // "list" or "return"
    onStateChange: (state: ApprovalState) => void,
}

export function ApprovalChecker(props: Props) {
    const [approvalState, setApprovalState] = useState(ApprovalState.UNKNOWN);

    useEffect(() => {
        // Load the initial approval state.

    });

    const didClickApproveButton = useCallback(() => {
        // Send the approve transaction.
    }, []);

    const messageMap = new Map<ApprovalState, string>([
        [ApprovalState.UNKNOWN, "Checking approval status..."],
        [ApprovalState.NOT_APPROVED, `In order to ${props.verb} the NFT, Kasu must be approved to manage the item on your behalf.`],
        [ApprovalState.PENDING, "Waiting for approval to be completed..."],
        [ApprovalState.APPROVED, `Item is approved and ready to be ${props.verb}ed.`],
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

    const buttonMap = new Map<ApprovalState, JSX.Element|null>([
        [ApprovalState.UNKNOWN, spinnerButton],
        [ApprovalState.NOT_APPROVED, <Button onClick={didClickApproveButton}>Approve</Button>],
        [ApprovalState.PENDING, spinnerButton],
        [ApprovalState.APPROVED, null],
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
