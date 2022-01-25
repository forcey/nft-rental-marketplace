import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

export type NFTDisplayable = {
    address: string,
    tokenID: string,
    name: string,
    contractName: string,
    imageURI: string,
    listingID?: number,
    collateral?: number,
    rentalDuration?: number,
    interestRate?: number,
    actionButtonStyle?: 'BORROW' | 'LIST' | 'UNLIST' | 'TERMINATE_RENTAL' | 'RETURN',
    actionButtonDisabled: boolean,
    didClickActionButton?: ((tokenID: string, tokenAddress: string, listingID: number | null | undefined) => void),
};

function NFTCard(props: NFTDisplayable) {
    let buttonVariant;
    let buttonString;
    if (props.actionButtonStyle != null) {
        switch(props.actionButtonStyle) {
            case 'BORROW':
                buttonVariant = 'primary';
                buttonString = 'Borrow';
                break;
            case 'LIST':
                buttonVariant = 'success';
                buttonString = 'List';
                break;
            case 'UNLIST':
                buttonVariant = 'warning';
                buttonString = 'Unlist';
                break;
            case 'TERMINATE_RENTAL':
                buttonVariant = 'danger';
                buttonString = 'Terminate Rental';
                break;
            case 'RETURN':
                buttonVariant = 'success';
                buttonString = 'Return';
                break;
            default:
                break;
        }
    }
    const didClickActionButton = () => {
        props.didClickActionButton && props.didClickActionButton(props.tokenID, props.address, props.listingID);
    };
    return (
        <Card style={styles.cardContainer}>
            <Card.Img variant="top" src={props.imageURI} />
            <Card.Body>
                <Card.Title>{props.contractName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{props.name}</Card.Subtitle>
                <ListGroup className="list-group-flush" style={styles.listGroupContainer}>
                    {props.collateral && <ListGroupItem style={styles.listGroupItem}>Collateral: {props.collateral.toString()} ETH</ListGroupItem>}
                    {props.interestRate && <ListGroupItem style={styles.listGroupItem}>Interest: {props.interestRate.toString()}%</ListGroupItem>}
                    {props.rentalDuration && <ListGroupItem style={styles.listGroupItem}>Duration: {props.rentalDuration.toString()} days</ListGroupItem>}
                </ListGroup>
                <div className="row" style={styles.buttonRow}>
                { props.actionButtonStyle && <Button variant={buttonVariant} onClick={didClickActionButton} disabled={props.actionButtonDisabled}>{buttonString}</Button>}
                </div>
            </Card.Body>
        </Card>
    );
}

const styles = {
    cardContainer: {
        width: '18rem'
    },
    listGroupContainer: {
        padding: '0rem 0rem',
        marginBottom: '0rem'
    },
    listGroupItem: {
        padding: '0.5rem 0rem'
    },
    buttonRow: {
        justifyContent: 'center',
        padding: '0rem 0.5rem'
    }
}

export default NFTCard;
