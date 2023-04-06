import { ESIM_GO_API_URL } from '../eSimGo.constant';

// ****************************** ESIMS ********************************//

export const LIST_ESIM_ASSIGNED_TO_YOU = `${ESIM_GO_API_URL}/esims`;
export const GET_ESIM_FROM_ORDER_REF = `${ESIM_GO_API_URL}/esims/assignments`;

// ****************************** BUNDLES ********************************//

export const LIST_BUNDLES = `${ESIM_GO_API_URL}/catalogue`;

// ****************************** ORDERS ********************************//

export const PROCESS_ORDERS = `${ESIM_GO_API_URL}/orders`; // post
