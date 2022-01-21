import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState, useRef } from 'react';

interface Props {
    tokenID: string,
    tokenAddress: string,
    isShown: boolean,
    onShouldClose: (didListNFT: boolean) => void,
}

function CreateListingModal(props: Props) {
    const [shouldDisableListButton, setShouldDisableListButton] = useState(true);
    const isValidCollateralRef = useRef(false);
    const isValidRentalDurationRef = useRef(false);
    const isValidInterestRateRef = useRef(false);
    const didClickListNFTButton = () => {
        // TODO: Call smart contract API to list NFT
        setShouldDisableListButton(true);
        props.onShouldClose(true);
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false);
    };

    const validateCollateral = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputCollateral = parseFloat(event.target.value);
        isValidCollateralRef.current = inputCollateral >= 0.0 && inputCollateral <= 100.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    const validateRentalDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputRentalDuration = parseFloat(event.target.value);
        isValidRentalDurationRef.current = inputRentalDuration > 0.0 && inputRentalDuration <= 90.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    const validateInterestRate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputInterestRate = parseFloat(event.target.value);
        isValidInterestRateRef.current = inputInterestRate >= 0.0 && inputInterestRate <= 100.0;
        setShouldDisableListButton(!isValidCollateralRef.current || !isValidRentalDurationRef.current || !isValidInterestRateRef.current);
    };

    return (
        <Modal show={props.isShown}>
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>List NFT for Lending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formCollateralRequired">
                        <Form.Label>Collateral Required</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="number"
                                min="0"
                                max="100"
                                placeholder="1"
                                onInput={validateCollateral}
                                aria-label="Collateral Required"
                                aria-describedby="basic-addon2"/>
                            <InputGroup.Text id="basic-addon2">ETH</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRentalDuration">
                        <Form.Label>Rental Duration</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="number"
                                min="1"
                                max="120"
                                placeholder="1"
                                onInput={validateRentalDuration}
                                aria-label="Rental Duration"
                                aria-describedby="basic-addon2"/>
                            <InputGroup.Text id="basic-addon2">days</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Interest Rate</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="number"
                                min="0"
                                max="100"
                                placeholder="1"
                                onInput={validateInterestRate}
                                aria-label="Interest Rate"
                                aria-describedby="basic-addon2"/>
                            <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickListNFTButton} disabled={shouldDisableListButton}>List</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default CreateListingModal;
