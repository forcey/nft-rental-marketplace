import LoginService from "./LoginService";
import { NFTMetadata } from "./common";

const chainToDomain = new Map<number, string>([
    [1, "api.opensea.io"],
    [4, "rinkeby-api.opensea.io"],
]);

export async function FetchOwnedNFTs(walletAddress: string): Promise<Array<NFTMetadata>> {
    const chainId = LoginService.getInstance().chainId;
    const domain = chainId && chainToDomain.get(chainId);
    if (!domain) {
        throw Error(`Invalid chainId ${chainId}`);
    }
    const options = { method: 'GET', headers: { Accept: 'application/json' } };
    const response = await fetch(`https://${domain}/api/v1/assets?owner=${walletAddress}&order_direction=desc&offset=0&limit=20`, options);
    if (!response.ok) {
        throw Error(`Error ${response.status} while calling OpenSea API`);
    }
    return (await response.json()).assets.map((asset: any) => ({
        address: asset.asset_contract.address,
        tokenID: asset.token_id,
        name: asset.name,
        contractName: asset.asset_contract.name,
        imageURI: asset.image_preview_url
    }));
}
