export class ESimGoBundleCountry {
    name: string;
    region: string;
    iso: string;
}

export class ESimGoBundle {
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
