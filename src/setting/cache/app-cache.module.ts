import EsimGoLoader, {
    EsimGoLoaderType,
} from 'src/modules/provider/eSim-go/cache/eSimGo.loader';
import CustomerLoader, {
    CustomerLoaderType,
} from 'src/modules/customer/cache/customer.loader';

const AppLoaderModule = () => ({ ...EsimGoLoader, ...CustomerLoader });

export default AppLoaderModule;

export type AppLoaderType = EsimGoLoaderType & CustomerLoaderType;
