import { UploadAuthType } from './upload.constant';
import * as moment from 'moment';
import { existsSync, mkdirSync } from 'fs';

export const getFolderUploadByUploadType = (
    uploadType: UploadAuthType,
    root: string,
): string => {
    const outerFolderUrl = `${root}/${uploadType}`;
    if (!existsSync(outerFolderUrl)) {
        mkdirSync(outerFolderUrl);
    }
    const date = moment().format('YYYY-MM-DD');
    const innerFolderUrl = `${outerFolderUrl}/${date}`;
    if (!existsSync(innerFolderUrl)) {
        mkdirSync(innerFolderUrl);
    }
    return `${uploadType}/${date}`;
};

const getExt = (fileName: string) => {
    return fileName.slice(
        (Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1,
    );
};

export const generateFileNameWithExtension = (orgFileName?: string): string => {
    const length = 36;
    let result = '';
    const ext = orgFileName ? `.${getExt(orgFileName)}` : '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }

    return `${result}${ext || '.webp'}`;
};
