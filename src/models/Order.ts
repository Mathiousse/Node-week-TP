import { Product } from "./Product";

type OrderProduct = {
    product: Product;
    quantity: number;
};

export class Order {
    id: number;
    userId: number;
    orderProducts: OrderProduct[];
    constructor(id: number, userId: number, orderProducts: OrderProduct[]) {
        this.id = id;
        this.userId = userId;
        this.orderProducts = orderProducts;
    }
}
