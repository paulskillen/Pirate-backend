import { registerEnumType } from '@nestjs/graphql';
import * as dotenv from 'dotenv';

export const BUNDLE_CACHE_TTL = 24 * 60 * 60 * 1000;
export const BUNDLE_PREFIX_CODE = 'BDL';
export const BUNDLE_CACHE_KEY = '{bundle_cache_key}:';
