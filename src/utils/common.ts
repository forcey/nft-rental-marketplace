import { ethers } from "ethers";

export type Listing = {
    id: ethers.BigNumber,
    tokenId: ethers.BigNumber,
    tokenAddress: string,
    lenderAddress: string,
    duration: number,
    dailyInterestRate: number,
    collateralRequired: ethers.BigNumber,
    rental: {
        borrowerAddress: string,
        rentedAt: ethers.BigNumber,
    }
};

export function isRentalAvailable(listing: Listing) {
    return listing.rental.rentedAt.isZero();
}
