import { ESIM_GO_API_URL, ESIM_GO_API_URL_VERSION_1 } from '../eSimGo.constant';

// ****************************** ESIMS ********************************//

export const ESIM_GO_LIST_ESIM_ASSIGNED_TO_YOU = `${ESIM_GO_API_URL}/esims`;
export const ESIM_GO_GET_ESIM_FROM_ORDER_REF = `${ESIM_GO_API_URL}/esims/assignments`;
export const ESIM_GO_GET_ESIM_QR_CODE_IMG = (code: string) =>
    `${ESIM_GO_API_URL}/esims/${code}/qr`;
export const ESIM_GO_SEND_SMS_TO_ESIM = (iccid: string) =>
    `${ESIM_GO_API_URL}/esims/${iccid}/sms`;

// ****************************** BUNDLES ********************************//

export const ESIM_GO_LIST_BUNDLES = `${ESIM_GO_API_URL}/catalogue`;
export const ESIM_GO_LIST_BUNDLES_APPLIED_TO_ESIM = (iccid: string) =>
    `${ESIM_GO_API_URL}/esims/${iccid}/bundles`;
export const ESIM_GO_APPLY_BUNDLE_TO_ESIM = `${ESIM_GO_API_URL}/esims/apply`;

// ****************************** ORDERS ********************************//

export const ESIM_GO_PROCESS_ORDERS = `${ESIM_GO_API_URL}/orders`; // post
