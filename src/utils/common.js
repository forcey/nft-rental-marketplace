function isRentalAvailable(listing) {
    return listing.rental.rentedAt.isZero();
}

export { isRentalAvailable }
