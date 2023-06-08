import * as dotenv from 'dotenv';

dotenv.config();

export const isPro = process.env.APP_ENV === 'production';
