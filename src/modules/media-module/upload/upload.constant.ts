import { registerEnumType } from '@nestjs/graphql';

export const AWS_REGION = 'ap-southeast-1';
export const APP_LIMITED_FILE_SIZE = 10000000;
export const UPLOAD_FOLDER_DATE_FORMAT = 'YYYY-MM-DD';

export enum UploadModeStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    PENDING = 'PENDING',
}

registerEnumType(UploadModeStatus, {
    name: 'UploadModeStatus',
});

export enum UploadAuthType {
    DEFAULT = 'DEFAULT',
    // modules
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    // other
}
registerEnumType(UploadAuthType, {
    name: 'UploadAuthType',
});

export enum UploadType {
    OTHER = 'OTHER',
    // modules
    ORDER = 'ORDER',
    QUOTATION = 'QUOTATION',
    BOOKING = 'BOOKING',
    CUSTOMER = 'CUSTOMER',
    APPOINTMENT = 'APPOINTMENT',
    DOCTOR_ORDER = 'DOCTOR_ORDER',
    TREATMENT = 'TREATMENT',
    PRODUCT = 'PRODUCT',
    EQUIPMENT = 'EQUIPMENT',
}
registerEnumType(UploadType, {
    name: 'UploadType',
});

export interface ResultFileDeleted {
    filename?: string;
    deleted?: boolean;
}

export interface ResultFileUpload {
    filename?: string;
    fileUrl?: string;
    type?: string;
}

export const ORIGINAL_IMAGE_SIZE_UPLOAD_LIST = [UploadAuthType.CUSTOMER];
