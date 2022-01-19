import type { NFTDisplayable } from './NFTCard';
import NFTCard from './NFTCard';
import { Container, Col, Row } from 'react-bootstrap';

type Props = {
    data: Array<NFTDisplayable>
}

function keyNFT(nft : NFTDisplayable) {
    return `${nft.address}/${nft.tokenID}`;
}

function NFTCardGrid(props: Props) {
    const groupedNFTs = groupNFTs(props.data);
    return (
        <Container style={styles.container}>
            {
                groupedNFTs.map((nftGroup) => {
                    return (
                        <Row key={keyNFT(nftGroup[0])} md={3} style={styles.cardRow}>
                            {
                                nftGroup.map((nft) => {
                                    return (
                                        <Col key={keyNFT(nft)}>
                                            <NFTCard {...nft}/>
                                        </Col>
                                    );
                                })
                            }
                        </Row>
                    );
                })
            }
        </Container>
    );
}

function groupNFTs(nfts: Array<NFTDisplayable>) {
    const groupedNFTs = [];
    for (let i = 0; i < nfts.length; i += 3) {
        const nftGroup = [];
        for (let j = i; j < nfts.length && j < i + 3; j += 1) {
            nftGroup.push(nfts[j]);
        }
        groupedNFTs.push(nftGroup);
    }
    return groupedNFTs;
}

const styles = {
    container: {
        margin: '1em 0em',
        padding: '0em',
    },
    cardRow: {
        marginBottom: '1.5em',
    }
};

export default NFTCardGrid;
