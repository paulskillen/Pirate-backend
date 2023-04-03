export class ESimGoOrderInput {
    type: string;

    assign: boolean;

    Order: { type: string; item: string; quantity: number }[];
}
