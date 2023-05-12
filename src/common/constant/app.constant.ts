const serviceFee = 1.3;

export const priceSaleFormula = (price: string | number) => {
    const calPrice = typeof price === 'string' ? +price : price;
    if (Number.isNaN(calPrice)) {
        return null;
    }
    const marginBase = 1.5 * calPrice + serviceFee;
    const priceBase: number = marginBase + calPrice;
    let priceCharged;
    if (priceBase > 0 && priceBase <= 5) {
        priceCharged = 4.99;
    } else if (priceBase > 5 && priceBase <= 10) {
        priceCharged = 9.99;
    } else if (priceBase > 10 && priceBase <= 15) {
        priceCharged = 14.99;
    } else if (priceBase > 15 && priceBase <= 20) {
        priceCharged = 19.99;
    } else if (priceBase > 20 && priceBase <= 25) {
        priceCharged = 24.99;
    } else if (priceBase > 25 && priceBase <= 30) {
        priceCharged = 29.99;
    } else if (priceBase > 30) {
        priceCharged = priceBase;
    }
    return priceCharged;
};
