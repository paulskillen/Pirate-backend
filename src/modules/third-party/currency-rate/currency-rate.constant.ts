export const CURRENCY_RATE_CACHE_TTL = 12 * 60 * 60 * 1000;
export const CURRENCY_RATE_CACHE_KEY = '{currency_rate_cache_key}:';

export const exchangeRateApi = (currency = 'USD') => {
    return `https://v6.exchangerate-api.com/v6/3ad925936a07e76b832eb1b8/latest/${currency}`;
};
