export const priceSaleFormula = (
    price: string | number,
    dataAmount: number | string,
): any => {
    const calPrice = typeof price === 'string' ? +price : price;
    if (Number.isNaN(calPrice)) {
        return null;
    }

    let multipliedPrice;

    if (dataAmount === 1000) {
        multipliedPrice = calPrice * 2.2; // For 1GB
    } else if (dataAmount === 2000) {
        multipliedPrice = calPrice * 2.2; // For 2GB
    } else if (dataAmount === 3000) {
        multipliedPrice = calPrice * 2.3; // For 3GB
    } else if (dataAmount === 5000) {
        multipliedPrice = calPrice * 1.95; // For 5GB
    } else if (dataAmount === 10000) {
        multipliedPrice = calPrice * 1.65; // For 10GB
    } else if (dataAmount === 20000) {
        multipliedPrice = calPrice * 1.55; // For 20GB
    } else if (dataAmount === 50000) {
        multipliedPrice = calPrice * 1.45; // For 50GB
    }

    // Round to nearest .99 or .49
    const roundedPrice = Math.round(multipliedPrice);
    const decimal = multipliedPrice % 1;

    // console.log(
    //     'calPrice =>',
    //     calPrice,
    //     'roundedPrice => ',
    //     roundedPrice,
    //     'decimal => ',
    //     decimal,
    // );

    // Adjust to nearest .99 or .49
    if (multipliedPrice < 4) {
        return 3.99;
    } else if (decimal < 0.35) {
        return roundedPrice - 0.01; // Round to nearest .99
    } else {
        return Math.floor(roundedPrice) + 0.99; // Round to nearest .99
    }
};
