export const PERMISSION = {
    COMMON: 'COMMON',
    PRODUCT: {
        LIST: 'PRODUCT.LIST',
        DETAIL: 'PRODUCT.DETAIL',
        CREATE: 'PRODUCT.CREATE',
        UPDATE: 'PRODUCT.UPDATE',
        SEARCH: 'PRODUCT.SEARCH',
    },
    ROLE: {
        LIST: 'ROLE.LIST',
        DETAIL: 'ROLE.DETAIL',
        CREATE: 'ROLE.CREATE',
        UPDATE: 'ROLE.UPDATE',
        SEARCH: 'ROLE.SEARCH',
    },

    ADMIN: {
        LIST: 'USER.LIST',
        DETAIL: 'USER.DETAIL',
        CREATE: 'USER.CREATE',
        UPDATE: 'USER.UPDATE',
        SEARCH: 'USER.SEARCH',
    },
    CUSTOMER: {
        LIST: 'CUSTOMER.LIST',
        DETAIL: 'CUSTOMER.DETAIL',
        CREATE: 'CUSTOMER.CREATE',
        UPDATE: 'CUSTOMER.UPDATE',
        SEARCH: 'CUSTOMER.SEARCH',
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

    BLOG: {
        LIST: 'BLOG.LIST',
        DETAIL: 'BLOG.DETAIL',
        CREATE: 'BLOG.CREATE',
        UPDATE: 'BLOG.UPDATE',
    },

    ORDER: {
        LIST: 'ORDER.LIST',
        DETAIL: 'ORDER.DETAIL',
        CREATE: 'ORDER.CREATE',
        UPDATE: 'ORDER.UPDATE',
        SUMMARY: 'ORDER.SUMMARY',
        CANCEL_ORDER: 'ORDER.CANCEL_ORDER',
    },

    BUNDLE: {
        LIST: 'BUNDLE.LIST',
        DETAIL: 'BUNDLE.DETAIL',
        CREATE: 'BUNDLE.CREATE',
        UPDATE: 'BUNDLE.UPDATE',
        SUMMARY: 'BUNDLE.SUMMARY',
    },
};
