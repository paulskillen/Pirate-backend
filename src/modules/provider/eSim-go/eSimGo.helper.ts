import { split } from 'lodash';
import { ESimGoBundle } from './schema/bundle/eSimGo-bundle.schema';

export class EsimGoHelper {
    static checkIsGoldBundle = (bundle: ESimGoBundle): boolean => {
        const { name } = bundle;
        if (name) {
            const arrStr = split(name, '_');
            return arrStr?.[0] === 'esimg';
        }
        return false;
    };
}
