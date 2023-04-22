import { ESIM_GO_API_URL, ESIM_GO_API_URL_VERSION_1 } from '../eSimGo.constant';

// ****************************** ESIMS ********************************//

export const ESIM_GO_LIST_ESIM_ASSIGNED_TO_YOU = `${ESIM_GO_API_URL}/esims`;
export const ESIM_GO_GET_ESIM_FROM_ORDER_REF = `${ESIM_GO_API_URL}/esims/assignments`;
export const ESIM_GO_GET_ESIM_QR_CODE_IMG = (code: string) =>
    `${ESIM_GO_API_URL}/esims/${code}/qr`;

// ****************************** BUNDLES ********************************//

export const ESIM_GO_LIST_BUNDLES = `${ESIM_GO_API_URL}/catalogue`;

// ****************************** ORDERS ********************************//

export const ESIM_GO_PROCESS_ORDERS = `${ESIM_GO_API_URL}/orders`; // post
