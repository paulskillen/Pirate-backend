export class ESimGoOrderInput {
    type: 'validate' | 'transaction';

    assign: boolean;

    Order: { type: 'bundle'; item: string; quantity: number }[];
}
