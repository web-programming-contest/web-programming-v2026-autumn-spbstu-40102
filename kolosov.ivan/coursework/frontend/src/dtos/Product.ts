export type Product = {
    id: number;
    title: string;
    price: number;
    text: string;
    specs: Record<string, string>;
    image: string;
    labels: string[];
    stars: number;
    type: string;
    colour: string;
}