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
        multipliedPrice = calPrice * 1.8; // For 1GB
    } else if (dataAmount === 2000) {
        multipliedPrice = calPrice * 1.8; // For 2GB
    } else if (dataAmount === 3000) {
        multipliedPrice = calPrice * 1.8; // For 3GB
    } else if (dataAmount === 5000) {
        multipliedPrice = calPrice * 1.6; // For 5GB
    } else if (dataAmount === 10000) {
        multipliedPrice = calPrice * 1.5; // For 10GB
    } else if (dataAmount === 20000) {
        multipliedPrice = calPrice * 1.35; // For 20GB
    } else if (dataAmount === 50000) {
        multipliedPrice = calPrice * 1.3; // For 50GB
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
    if (multipliedPrice < 3.35) {
        return 2.99;
    } else if (decimal < 0.35) {
        return roundedPrice - 0.01; // Round to nearest .99
    } else if (decimal > 0.35 && decimal < 0.65) {
        return Math.floor(roundedPrice) + 0.49; // Round to nearest .4
    } else {
        return Math.floor(roundedPrice) + 0.99; // Round to nearest .99
    }
};
