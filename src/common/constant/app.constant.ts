const serviceFee = 1.3;

// const marginFactor =2.5;

const marginFactor = 2;

export const priceSaleFormula = (price: string | number) => {
    const calPrice = typeof price === 'string' ? +price : price;
    if (Number.isNaN(calPrice)) {
        return null;
    }
    const marginBase = marginFactor * calPrice + 0;
    const priceBase: number = marginBase;
    const priceCharged = +(Math.ceil(priceBase) - 0.01).toFixed(2);
    // if (priceBase > 0 && priceBase <= 5) {
    //     priceCharged = 4.99;
    // } else if (priceBase > 5 && priceBase <= 10) {
    //     priceCharged = 9.99;
    // } else if (priceBase > 10 && priceBase <= 15) {
    //     priceCharged = 14.99;
    // } else if (priceBase > 15 && priceBase <= 20) {
    //     priceCharged = 19.99;
    // } else if (priceBase > 20 && priceBase <= 25) {
    //     priceCharged = 24.99;
    // } else if (priceBase > 25 && priceBase <= 30) {
    //     priceCharged = 29.99;
    // } else if (priceBase > 30 && priceBase <= 35) {
    //     priceCharged = 34.99;
    // } else if (priceBase > 35 && priceBase <= 40) {
    //     priceCharged = 39.99;
    // } else if (priceBase > 40 && priceBase <= 45) {
    //     priceCharged = 44.99;
    // } else if (priceBase > 45 && priceBase <= 50) {
    //     priceCharged = 49.99;
    // } else if (priceBase > 50) {
    //     priceCharged = priceBase.toFixed(2);
    // }
    return priceCharged;
};
