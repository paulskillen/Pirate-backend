import EsimGoLoader, {
    EsimGoLoaderType,
} from 'src/modules/provider/eSim-go/cache/eSimGo.loader';
import CustomerLoader, {
    CustomerLoaderType,
} from 'src/modules/customer/cache/customer.loader';
import AdminUserLoader, {
    AdminUserLoaderType,
} from 'src/admin/admin-user/admin-user.loader';
import AdminRoleLoader, {
    AdminRoleLoaderType,
} from 'src/admin/admin-role/admin-role.loader';
import MediaFolderLoader, {
    MediaFolderLoaderType,
} from 'src/modules/media-module/media-folder/cache/media-folder.loader';
import MediaFileLoader, {
    MediaFileLoaderType,
} from 'src/modules/media-module/media-file/cache/media-file.loaders';

const AppLoaderModule = () => ({
    ...EsimGoLoader,
    ...CustomerLoader,
    ...AdminUserLoader,
    ...AdminRoleLoader,
    ...MediaFolderLoader,
    ...MediaFileLoader,
});

export default AppLoaderModule;

export type AppLoaderType = EsimGoLoaderType &
    CustomerLoaderType &
    AdminUserLoaderType &
    AdminRoleLoaderType &
    MediaFileLoaderType &
    MediaFolderLoaderType;
