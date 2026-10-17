export type NewOrder = {
    clientId: number;
    products: string;
    productsAmount: number;
    totalPrice: number;
    email: string | null;
    phone: string;
    address: string | null;
    isCash: boolean;
    isPackagingRequired: boolean;
}