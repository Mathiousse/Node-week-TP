"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const router = express_1.default.Router();
router.get("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield database_1.default.order.findMany();
    res.status(200).json(orders);
}));
router.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body;
    if (!order.userId || !order.products) {
        res.status(400).json({ error: "Order data is missing from request" });
        return;
    }
    // Check if the User exists
    const user = yield database_1.default.user.findUnique({ where: { id: order.userId } });
    if (!user) {
        res.status(400).json({ error: "User with id " + order.userId + " does not exist" });
        return;
    }
    // Check if all Products exist
    for (const product of order.products) {
        const productExists = yield database_1.default.product.findUnique({ where: { id: product.productId } });
        if (!productExists) {
            res.status(400).json({ error: "Product with id " + product.productId + " does not exist" });
            return;
        }
    }
    try {
        const newOrder = yield database_1.default.order.create({
            data: {
                userId: order.userId,
                products: {
                    create: order.products.map(product => ({
                        productId: product.productId,
                        quantity: product.quantity
                    }))
                }
            },
            include: {
                products: true
            }
        });
        res.status(201).json(newOrder);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.patch("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const orderUpdate = req.body;
    const order = yield database_1.default.order.findUnique({ where: { id } });
    if (!order) {
        res.status(404).json({ error: "Order with an id of " + id + " could not be found" });
        return;
    }
    if (!orderUpdate.userId && !orderUpdate.products) {
        res.status(400).json({ error: "Order data is missing from request" });
        return;
    }
    for (const product of orderUpdate.products) {
        const productExists = yield database_1.default.product.findUnique({
            where: { id: product.productId }
        });
        if (!productExists) {
            res.status(400).json({ error: "Product with an id of " + product.productId + " does not exist" });
            return;
        }
        const orderProduct = yield database_1.default.orderProduct.findFirst({
            where: { productId: product.productId, orderId: id }
        });
        if (orderProduct) {
            yield database_1.default.orderProduct.update({
                where: { id: orderProduct.id },
                data: { quantity: product.quantity }
            });
        }
        else {
            yield database_1.default.orderProduct.create({
                data: { productId: product.productId, quantity: product.quantity, orderId: id }
            });
        }
    }
    const updatedOrder = yield database_1.default.order.update({
        where: { id },
        data: {
            userId: orderUpdate.userId,
        },
        include: {
            products: true
        }
    });
    res.json(updatedOrder);
}));
router.delete("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: "Order ID is incorrect or missing" });
        return;
    }
    const order = yield database_1.default.order.findUnique({ where: { id } });
    if (!order) {
        res.status(404).json({ error: "Order with an id of " + id + " could not be found" });
        return;
    }
    yield database_1.default.orderProduct.deleteMany({
        where: { orderId: id }
    });
    yield database_1.default.order.delete({ where: { id } });
    res.status(204).end();
}));
exports.default = router;
