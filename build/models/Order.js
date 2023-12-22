"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, userId, products, quantity) {
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.quantity = quantity;
    }
}
exports.Order = Order;
