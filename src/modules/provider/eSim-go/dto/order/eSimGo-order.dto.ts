export class ESimGoOrderInput {
    type: 'validate' | 'transaction';

    assign: boolean;

    Order: { type: 'bundle'; item: string; quantity: number }[];
}

export class ESimGoApplyBundleToEsimInput {
    iccid: string; // ICCID of target eSIM to apply Bundle to. If not provided, a new eSIM will be assigned to you.
    name: string; // Name of Bundle to apply
    startTime: string; // When the Bundle should start (if left empty, Bundle will start immediately),Format as defined in https://datatracker.ietf.org/doc/html/rfc3339#section-5.6, section 5.6. Timezone is UTC (ends with 'Z'). Example: 2006-01-02T15:04:05Z
    repeat?: number; // How many bundles should be applied (each returns a new eSIM)
}
