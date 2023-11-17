export const PERMISSION = {
    COMMON: 'COMMON',
    PRODUCT: {
        CREATE: 'PRODUCT.CREATE',
        UPDATE: 'PRODUCT.UPDATE',
        LIST: 'PRODUCT.LIST',
        DETAIL: 'PRODUCT.DETAIL',
        SEARCH: 'PRODUCT.SEARCH',
    },
    ADMIN: {
        ROLE: {
            ALL: 'ROLE.ALL',
            LIST: 'ROLE.LIST',
            DETAIL: 'ROLE.DETAIL',
            CREATE: 'ROLE.CREATE',
            UPDATE: 'ROLE.UPDATE',
        },
        USER: {
            ALL: 'USER.ALL',
            LIST: 'USER.LIST',
            DETAIL: 'USER.DETAIL',
            CREATE: 'USER.CREATE',
            UPDATE: 'USER.UPDATE',
            UPDATE_SPECIAL_ACCESS: 'UPDATE_SPECIAL_ACCESS',
            SEARCH: 'USER.SEARCH',
        },
    },
    CUSTOMER: {
        LIST: 'CUSTOMER.LIST',
        SEARCH: 'CUSTOMER.SEARCH',
        DETAIL: 'CUSTOMER.DETAIL',
        CREATE: 'CUSTOMER.CREATE',
        UPDATE_PERSONAL: 'CUSTOMER.UPDATE_PERSONAL',
        UPDATE_PRIVACY: 'CUSTOMER.UPDATE_PRIVACY',
        UPDATE_CONTACT: 'CUSTOMER.UPDATE_CONTACT',
        UPDATE_SETTING: 'CUSTOMER.UPDATE_SETTING',
        ORDER_HISTORY: 'CUSTOMER.DETAIL.ORDER_HISTORY',
        VOUCHERS: 'CUSTOMER.DETAIL.VOUCHERS',
    },
    MEDIA: {
        UPLOAD: {
            GET_URL: 'MEDIA.UPLOAD.GET_URL',
        },
        FILE: {
            ALL: 'MEDIA.FILE.ALL',
            LIST: 'MEDIA.FILE.LIST',
            DETAIL: 'MEDIA.FILE.DETAIL',
            CREATE: 'MEDIA.FILE.CREATE',
            UPDATE: 'MEDIA.FILE.UPDATE',
            MOVE: 'MEDIA.FILE.MOVE',
            DELETE: 'MEDIA.FILE.DELETE',
        },
        FOLDER: {
            ALL: 'MEDIA.FOLDER.ALL',
            CREATE: 'MEDIA.FOLDER.CREATE',
            UPDATE: 'MEDIA.FOLDER.UPDATE',
            MOVE: 'MEDIA.FOLDER.MOVE',
            DELETE: 'MEDIA.FOLDER.DELETE',
        },
    },

    VOUCHER: {
        LIST: 'VOUCHER.LIST',
        DETAIL: 'VOUCHER.DETAIL',
        CREATE: 'VOUCHER.CREATE',
        UPDATE: 'VOUCHER.UPDATE',
        CANCEL: 'VOUCHER.CANCEL',
    },

    ORDER: {
        LIST: 'ORDER.LIST',
        DETAIL: 'ORDER.DETAIL',
        CREATE: 'ORDER.CREATE',
        UPDATE: 'ORDER.UPDATE',
        SUMMARY: 'ORDER.SUMMARY',
        CANCEL_ORDER: 'ORDER.CANCEL_ORDER',
    },
};
