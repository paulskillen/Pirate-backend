export class ESimGoBundleCountry {
    name: string;
    region: string;
    iso: string;
}

export class ESimGoOrder {
    name: string;

    description: string;

    countries: ESimGoBundleCountry[];

    dataAmount: number;

    duration: number;

    speed: string[];

    autoStart: boolean;

    roamingEnabled: ESimGoBundleCountry[];

    imageUrl: string;

    price: number;
}

export class ESimGoEsimData {
    iccid: string;
    matchingId: string;
    rspUrl: string;
    bundle: string;
    reference: string;
    qrCode?: string;
}
