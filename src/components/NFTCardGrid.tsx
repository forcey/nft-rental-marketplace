import type { NFTDisplayable } from './NFTCard';
import NFTCard from './NFTCard';
import { Container, Col, Row } from 'react-bootstrap';

type Props = {
    data: Array<NFTDisplayable>
}

function keyNFT(nft : NFTDisplayable, index: Number) {
    return `${nft.address}/${nft.tokenID}/${index}`;
}

function NFTCardGrid(props: Props) {
    const groupedNFTs = groupNFTs(props.data);
    return (
        <Container style={styles.container}>
            {
                groupedNFTs.map((nftGroup, groupIndex) => {
                    return (
                        <Row key={keyNFT(nftGroup[0], groupIndex)} md={3} style={styles.cardRow}>
                            {
                                nftGroup.map((nft, nftIndex) => {
                                    return (
                                        <Col key={keyNFT(nft, nftIndex)}>
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
