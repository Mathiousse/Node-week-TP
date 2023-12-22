"use strict";
class Product {
    constructor(id, name, price, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}
class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
class Order {
    constructor(id, userId, products, quantity) {
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.quantity = quantity;
    }
}
