import { Product } from "./Product";

export class Order {
    id: number;
    userId: number;
    products: Product[];
    quantity: number[];
    constructor(id: number, userId: number, products: Product[], quantity: number[]) {
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.quantity = quantity;
    }
}