import EsimGoLoader, {
    EsimGoLoaderType,
} from 'src/modules/provider/eSim-go/cache/eSimGo.loader';

const AppLoaderModule = () => ({ ...EsimGoLoader });

export default AppLoaderModule;

export type AppLoaderType = EsimGoLoaderType;
