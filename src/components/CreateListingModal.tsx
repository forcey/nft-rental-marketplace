import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

interface Props {
    tokenID: string,
    address: string,
    name: string,
    contractName: string,
    imageURI: string
}

function CreateListingModal(props: Props) {
    return (
        <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>List NFT for Lending</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formCollateralRequired">
                    <Form.Label>Collateral Required</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl
                            type="number"
                            placeholder="1"
                            aria-label="Collateral Required"
                            aria-describedby="basic-addon2"/>
                        <InputGroup.Text id="basic-addon2">ETH</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRentalDuration">
                    <Form.Label>Rental Duration</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Select aria-label="Rental Duration">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </Form.Select>
                        <InputGroup.Text id="basic-addon2">days</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Interest Rate</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl
                            type="number"
                            placeholder="1"
                            aria-label="Interest Rate"
                            aria-describedby="basic-addon2"/>
                        <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="success">List</Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
}

export default CreateListingModal;
